import { useState, useEffect } from 'react'
import { createBlog, updateBlog } from '../api'
import ImagePicker from './ImagePicker'
import RichTextEditor from './RichTextEditor'

const emptySection = () => ({ title: '', content: '', images: [] })

function normSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return [emptySection()]
  const first = sections[0]
  return [{ title: first.title || '', content: first.content || '', images: [] }]
}

export default function BlogAddForm({ initialBlog = null, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageName, setImageName] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [featured, setFeatured] = useState(false)
  const [contentSections, setContentSections] = useState([emptySection()])
  // SEO & blog detail (WordPress-style)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [metaRobots, setMetaRobots] = useState('index, follow')
  const [schemaCode, setSchemaCode] = useState('')

  const isEdit = !!initialBlog

  useEffect(() => {
    if (!initialBlog) return
    setTitle(initialBlog.title || '')
    setSlug(initialBlog.slug || '')
    setExcerpt(initialBlog.excerpt || '')
    setAuthor(initialBlog.author_name || '')
    setImageUrl(initialBlog.featured_image_url || '')
    setImageAlt(initialBlog.featured_image_alt || '')
    setImageName(initialBlog.featured_image_name || '')
    setFeatured(!!initialBlog.is_featured)
    setPublishedAt(initialBlog.published_at ? new Date(initialBlog.published_at).toISOString().slice(0, 16) : '')
    setContentSections(normSections(initialBlog.content_sections))
    setMetaTitle(initialBlog.meta_title || '')
    setMetaDescription(initialBlog.meta_description || '')
    setCanonicalUrl(initialBlog.canonical_url || '')
    setMetaRobots(initialBlog.meta_robots || 'index, follow')
    setSchemaCode(initialBlog.schema_code || '')
  }, [initialBlog])

  const setSection = (idx, field, value) => {
    setContentSections((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const buildPayload = (status) => {
    const sec = contentSections[0] || emptySection()
    const content_sections = [{
      title: sec.title?.trim() || '',
      content: sec.content?.trim() || '',
      images: [],
    }].filter((s) => s.title || s.content)
    return {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: '',
      author_name: author.trim() || null,
      featured_image_url: imageUrl.trim() || null,
      featured_image_alt: imageAlt.trim() || null,
      featured_image_name: imageName.trim() || null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      canonical_url: canonicalUrl.trim() || null,
      meta_robots: metaRobots.trim() || null,
      schema_code: schemaCode.trim() || null,
      tags: null,
      status,
      published_at: status === 'published' ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null,
      is_featured: featured,
      allow_comments: false,
      content_sections,
    }
  }

  const handleSubmit = async (e, mode = 'published') => {
    e.preventDefault()
    setSubmitError(null)
    if (!title.trim() || !slug.trim()) {
      setSubmitError('Title and slug are required.')
      return
    }
    setSubmitting(true)
    try {
      const payload = buildPayload(mode)
      if (isEdit) {
        await updateBlog(initialBlog.id, payload)
      } else {
        await createBlog(payload)
      }
      onSuccess?.()
    } catch (err) {
      setSubmitError(err.message || 'Save failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const sec = contentSections[0] || emptySection()
  const sIdx = 0

  return (
    <form className="blog-form" onSubmit={(e) => handleSubmit(e, 'published')}>
      <div className="form-section">
        <h2 className="form-section-title">Post details</h2>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" placeholder="Enter blog title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="slug">URL slug</label>
          <input id="slug" type="text" placeholder="blog-url-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="excerpt">Hero description</label>
          <textarea id="excerpt" placeholder="Short description for hero and listings" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">Media & meta</h2>
        <div className="field">
          <label>Featured image</label>
          <ImagePicker
            value={imageUrl}
            onChange={setImageUrl}
            label="Choose featured image"
            showUrlFallback
            urlPlaceholder="Or paste image URL"
          />
          <div className="field field--mt">
            <label htmlFor="imageAlt">Featured image alt text</label>
            <input id="imageAlt" type="text" placeholder="Alt text for accessibility" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
          </div>
          <div className="field field--mt">
            <label htmlFor="imageName">Featured image name</label>
            <input id="imageName" type="text" placeholder="Image title/caption" value={imageName} onChange={(e) => setImageName(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="author">Author</label>
          <input id="author" type="text" placeholder="Author name" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="publishedAt">Publish date</label>
          <input id="publishedAt" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
        </div>
        <div className="field field-row">
          <input id="featured" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <label htmlFor="featured">Featured post</label>
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">SEO & Blog detail</h2>
        <p className="form-section-desc">Meta tags and schema for the blog detail page (WordPress-style).</p>
        <div className="field">
          <label htmlFor="metaTitle">Meta title</label>
          <input id="metaTitle" type="text" placeholder="e.g. 50–60 chars for search" maxLength={70} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="metaDescription">Meta description</label>
          <textarea id="metaDescription" placeholder="Short description for search results (e.g. 150–160 chars)" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="canonicalUrl">Canonical URL</label>
          <input id="canonicalUrl" type="url" placeholder="https://yoursite.com/blogs/this-post" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="metaRobots">Meta robots</label>
          <input id="metaRobots" type="text" placeholder="index, follow" value={metaRobots} onChange={(e) => setMetaRobots(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="schemaCode">Schema code (JSON-LD)</label>
          <textarea id="schemaCode" placeholder='{"@context":"https://schema.org","@type":"Article",...}' rows={6} value={schemaCode} onChange={(e) => setSchemaCode(e.target.value)} className="font-mono" />
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">Content section</h2>
        <div className="content-section-block">
          <div className="field">
            <label>Section title</label>
            <input type="text" placeholder="e.g. Introduction" value={sec.title} onChange={(e) => setSection(sIdx, 'title', e.target.value)} />
          </div>
          <div className="field">
            <label>Section content</label>
            <RichTextEditor
              value={sec.content}
              onChange={(html) => setSection(sIdx, 'content', html)}
              placeholder="Section text – use toolbar for formatting"
              minHeight={140}
            />
          </div>
        </div>
      </div>

      {submitError && <p className="form-submit-error">{submitError}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={(e) => handleSubmit(e, 'draft')} disabled={submitting}>
          {submitting ? 'Saving…' : 'Save draft'}
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
        </button>
      </div>
    </form>
  )
}
