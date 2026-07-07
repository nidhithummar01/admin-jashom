import PropTypes from 'prop-types'
import Modal from './Modal'

export default function ConfirmModal({ titleId, title, message, onCancel, onConfirm, confirmLabel, busy }) {
  return (
    <Modal onClose={onCancel} labelledBy={titleId} className="modal-content--confirm">
      <div className="modal-header">
        <h2 id={titleId} className="modal-title">{title}</h2>
        <button type="button" className="modal-close" onClick={onCancel} aria-label="Close">×</button>
      </div>
      <div className="modal-body">
        <p className="delete-confirm-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

ConfirmModal.propTypes = {
  titleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  busy: PropTypes.bool,
}

ConfirmModal.defaultProps = {
  confirmLabel: 'Delete',
  busy: false,
}
