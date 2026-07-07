import { Fragment, useState, useEffect, useCallback } from 'react'
import { getApplications, deleteApplication } from '../api'

const STATUS_COLOR = {
  new: '#3b82f6', reviewing: '#fbbf24', shortlisted: '#8b5cf6',
  rejected: '#f87171', hired: '#34d399',
}

export default function ApplicationList({ job, onClose }) {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    getApplications({ job_id: job.id, limit: 200 })
      .then(setApps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [job.id])

  const closeDeleteConfirm = useCallback(() => {
    if (!deletingId) setDeleteConfirm(null)
  }, [deletingId])

  useEffect(() => {
    if (!deleteConfirm) return
    const onKey = (e) => e.key === 'Escape' && closeDeleteConfirm()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteConfirm, closeDeleteConfirm])

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return
    const appId = deleteConfirm.id
    setDeletingId(appId)
    deleteApplication(appId)
      .then(() => {
        setApps((prev) => prev.filter((a) => a.id !== appId))
        setDeleteConfirm(null)
      })
      .catch((e) => setError(e.message || 'Delete failed'))
      .finally(() => setDeletingId(null))
  }

  return (
    <Fragment>
      <div className="applications-panel">
        <div className="applications-panel__header">
          <h3 className="applications-panel__title">Applications — {job.title} ({apps.length})</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Hide</button>
        </div>

        <div className="applications-panel__body">
          {loading && <p className="list-message">Loading…</p>}
          {error && <p className="list-message list-message--error">{error}</p>}

          {!loading && apps.length === 0 && (
            <p className="list-message">No applications yet for this job.</p>
          )}

          {apps.map((a) => (
            <div key={a.id} className="application-card">
              <div className="application-card__head">
                <div className="application-card__who">
                  <strong>{a.full_name}</strong>
                  <span className="application-card__email">{a.email}</span>
                  {a.phone && <span className="application-card__phone">· {a.phone}</span>}
                </div>
                <div className="application-card__meta">
                  <span
                    className="application-card__status"
                    style={{
                      background: (STATUS_COLOR[a.status] || '#94a3b8') + '22',
                      color: STATUS_COLOR[a.status] || '#94a3b8',
                    }}
                  >
                    {a.status}
                  </span>
                  <span className="application-card__date">
                    {new Date(a.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {(a.linkedin_url || a.portfolio_url) && (
                <div className="application-card__links">
                  {a.linkedin_url && <a href={a.linkedin_url} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
                  {a.portfolio_url && <a href={a.portfolio_url} target="_blank" rel="noreferrer">Portfolio ↗</a>}
                </div>
              )}

              {a.cover_letter && (
                <details className="application-card__cover">
                  <summary>Cover Letter</summary>
                  <pre>{a.cover_letter}</pre>
                </details>
              )}

              <div className="application-card__actions">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteConfirm(a)}
                  disabled={deletingId === a.id}
                >
                  {deletingId === a.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteConfirm && (
        <div
          className="modal-backdrop modal-backdrop--center"
          onClick={closeDeleteConfirm}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-app-confirm-title"
        >
          <div className="modal-content modal-content--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="delete-app-confirm-title" className="modal-title">Delete application?</h2>
              <button type="button" className="modal-close" onClick={closeDeleteConfirm} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              <p className="delete-confirm-message">
                Application from &ldquo;{deleteConfirm.full_name}&rdquo; will be permanently deleted. This cannot be undone.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeDeleteConfirm} disabled={!!deletingId}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={!!deletingId}
                >
                  {deletingId === deleteConfirm.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}
