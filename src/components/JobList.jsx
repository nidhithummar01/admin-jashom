import { Fragment, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getJobs, deleteJob } from '../api'
import ApplicationList from './ApplicationList'
import ConfirmModal from './ConfirmModal'

const STATUS_COLOR = { published: '#22c55e', draft: '#f59e0b', closed: '#6b7280' }

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [viewingApps, setViewingApps] = useState(null) // job object

  const load = () => {
    setLoading(true)
    setError(null)
    getJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  const closeDeleteConfirm = useCallback(() => {
    if (!deletingId) setDeleteConfirm(null)
  }, [deletingId])

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return
    setDeletingId(deleteConfirm.id)
    deleteJob(deleteConfirm.id)
      .then(() => { setDeleteConfirm(null); load() })
      .catch((e) => setError(e.message || 'Delete failed'))
      .finally(() => setDeletingId(null))
  }

  if (loading) return <p className="list-message">Loading jobs…</p>
  if (error) return <p className="list-message list-message--error">Error: {error}</p>

  return (
    <>
      <div className="blog-list-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>All Jobs ({jobs.length})</h2>
          <Link to="/jobs/add" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
            + Add Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="list-message">No jobs yet. <Link to="/jobs/add">Add one</Link>.</p>
        ) : (
          <ul className="blog-list">
            {jobs.map((j) => (
              <Fragment key={j.id}>
                <li className="blog-list-item">
                  <div className="blog-list-item__info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="blog-list-item__title">{j.title}</span>
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4,
                        background: STATUS_COLOR[j.status] + '22',
                        color: STATUS_COLOR[j.status],
                        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>{j.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                      {j.department && <span className="blog-list-item__date">📁 {j.department}</span>}
                      {j.location && <span className="blog-list-item__date">📍 {j.location}</span>}
                      {j.employment_type && <span className="blog-list-item__date">⏱ {j.employment_type}</span>}
                      {j.experience && <span className="blog-list-item__date">🎯 {j.experience}</span>}
                    </div>
                  </div>
                  <div className="blog-list-item__actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setViewingApps(viewingApps?.id === j.id ? null : j)}
                    >
                      {viewingApps?.id === j.id ? 'Hide Applications' : 'Applications'}
                    </button>
                    <Link
                      to={`/jobs/edit/${j.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteConfirm(j)}
                      disabled={deletingId === j.id}
                    >
                      {deletingId === j.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </li>
                {viewingApps?.id === j.id && (
                  <li className="blog-list-item blog-list-item--applications">
                    <ApplicationList job={j} onClose={() => setViewingApps(null)} />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <ConfirmModal
          titleId="delete-job-confirm-title"
          title="Delete job?"
          message={<>&ldquo;{deleteConfirm.title}&rdquo; will be permanently deleted. This cannot be undone, and all applications for this job will be detached.</>}
          onCancel={closeDeleteConfirm}
          onConfirm={handleConfirmDelete}
          confirmLabel={deletingId ? 'Deleting…' : 'Yes, Delete'}
          busy={!!deletingId}
        />
      )}
    </>
  )
}
