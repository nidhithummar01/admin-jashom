import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { createJob, updateJob } from '../api'

const EMPTY = {
  title: '',
  slug: '',
  department: '',
  location: '',
  employment_type: 'Full-time',
  experience: '',
  salary_range: '',
  description: '',
  requirements: '',
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(?:^-)|(?:-$)/g, '')
}

export default function JobAddForm({ initialData, jobId }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        ...EMPTY,
        title: initialData.title || '',
        slug: initialData.slug || '',
        department: initialData.department || '',
        location: initialData.location || '',
        employment_type: initialData.employment_type || 'Full-time',
        experience: initialData.experience || '',
        salary_range: initialData.salary_range || '',
        description: initialData.description || '',
        requirements: initialData.requirements || '',
      })
    }
  }, [initialData])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleTitleChange = (e) => {
    const val = e.target.value
    set('title', val)
    if (!jobId) set('slug', slugify(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        ...form,
        status: 'published',
        posted_at: new Date().toISOString(),
      }
      if (jobId) {
        await updateJob(jobId, payload)
      } else {
        await createJob(payload)
      }
      setSuccess(true)
      setTimeout(() => navigate('/jobs'), 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const saveLabel = jobId ? 'Update Job' : 'Publish Job'

  return (
    <form onSubmit={handleSubmit} className="blog-form">

      {/* Basic Info */}
      <div className="form-section">
        <h2 className="form-section-title">{jobId ? 'Edit Job' : 'Add New Job'}</h2>

        {error && <p className="form-submit-error">{error}</p>}
        {success && <p style={{ color: 'var(--accent)', padding: '0.5rem 0' }}>Saved! Redirecting…</p>}

        <div className="field">
          <label htmlFor="job-title">Job Title *</label>
          <input
            id="job-title"
            type="text"
            required
            value={form.title}
            onChange={handleTitleChange}
            placeholder="e.g. Senior CUDA Developer"
          />
        </div>

        <div className="field">
          <label htmlFor="job-slug">Slug *</label>
          <input
            id="job-slug"
            type="text"
            required
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="senior-cuda-developer"
          />
        </div>

        <div className="field">
          <label htmlFor="job-dept">Department</label>
          <input
            id="job-dept"
            type="text"
            value={form.department}
            onChange={(e) => set('department', e.target.value)}
            placeholder="e.g. Engineering"
          />
        </div>

        <div className="field">
          <label htmlFor="job-loc">Location</label>
          <input
            id="job-loc"
            type="text"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Remote / Ahmedabad"
          />
        </div>

        <div className="field">
          <label htmlFor="job-type">Employment Type</label>
          <select
            id="job-type"
            value={form.employment_type}
            onChange={(e) => set('employment_type', e.target.value)}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Freelance</option>
            <option>Internship</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="job-exp">Experience</label>
          <input
            id="job-exp"
            type="text"
            value={form.experience}
            onChange={(e) => set('experience', e.target.value)}
            placeholder="e.g. 3+ years"
          />
        </div>

      </div>

      {/* Content */}
      <div className="form-section">
        <h2 className="form-section-title">Job Content</h2>

        <div className="field">
          <label htmlFor="job-desc">Job Description</label>
          <textarea
            id="job-desc"
            rows={8}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the role, responsibilities, and what the candidate will work on…"
          />
        </div>

        <div className="field">
          <label htmlFor="job-req">Requirements / Skills</label>
          <textarea
            id="job-req"
            rows={6}
            value={form.requirements}
            onChange={(e) => set('requirements', e.target.value)}
            placeholder="List required skills, qualifications, tools…"
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : saveLabel}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/jobs')}>
          Cancel
        </button>
      </div>

    </form>
  )
}

JobAddForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    department: PropTypes.string,
    location: PropTypes.string,
    employment_type: PropTypes.string,
    experience: PropTypes.string,
    salary_range: PropTypes.string,
    description: PropTypes.string,
    requirements: PropTypes.string,
  }),
  jobId: PropTypes.number,
}

JobAddForm.defaultProps = {
  initialData: null,
  jobId: null,
}
