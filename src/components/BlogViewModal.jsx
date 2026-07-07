import PropTypes from 'prop-types'
import Modal from './Modal'

export default function BlogViewModal({ blog, onClose }) {
  const sections = Array.isArray(blog.content_sections) ? blog.content_sections : []

  return (
    <Modal onClose={onClose} labelledBy="blog-view-title" className="blog-view-modal">
      <div className="modal-header">
        <h2 id="blog-view-title" className="modal-title">{blog.title}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="modal-body">
        <p className="blog-view-meta">
          <span className="blog-view-status">{blog.status}</span>
          {blog.slug && <span>Slug: {blog.slug}</span>}
          {blog.published_at && <span>{new Date(blog.published_at).toLocaleString()}</span>}
        </p>
        {blog.excerpt && <p className="blog-view-excerpt">{blog.excerpt}</p>}
        {blog.featured_image_url && (
          <div className="blog-view-featured">
            <img src={blog.featured_image_url} alt={blog.featured_image_alt || ''} />
          </div>
        )}
        <div className="blog-view-content">
          {sections.map((sec, i) => (
            <div key={i} className="blog-view-section">
              {sec.title && <h3>{sec.title}</h3>}
              {sec.content && <div dangerouslySetInnerHTML={{ __html: sec.content }} />}
              {sec.images?.length > 0 && (
                <div className="blog-view-section-images">
                  {sec.images.map((img, j) => (
                    <img key={j} src={img.url} alt={img.alt || ''} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

BlogViewModal.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    status: PropTypes.string,
    slug: PropTypes.string,
    published_at: PropTypes.string,
    excerpt: PropTypes.string,
    featured_image_url: PropTypes.string,
    featured_image_alt: PropTypes.string,
    content_sections: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
      })),
    })),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
