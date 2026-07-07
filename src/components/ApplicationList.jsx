import { Fragment, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { getApplications, deleteApplication } from '../api'
import ConfirmModal from './ConfirmModal'

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

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return
    const appId = deleteConfirm.id
    setDeletingId(appId)
    try {
      await deleteApplication(appId)
      setApps((prev) => prev.filter((a) => a.id !== appId))
      setDeleteConfirm(null)
    } catch (e) {
      setError(e.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
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
        <ConfirmModal
          titleId="delete-app-confirm-title"
          title="Delete application?"
          message={<>Application from &ldquo;{deleteConfirm.full_name}&rdquo; will be permanently deleted. This cannot be undone.</>}
          onCancel={closeDeleteConfirm}
          onConfirm={handleConfirmDelete}
          confirmLabel={deletingId === deleteConfirm.id ? 'Deleting…' : 'Delete'}
          busy={!!deletingId}
        />
      )}
    </Fragment>
  )
}

ApplicationList.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
