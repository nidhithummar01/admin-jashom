import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

/** Native <dialog> wrapper — gives us a real backdrop, focus trap, and
 * Escape-to-close for free, without manual keydown listeners or a11y
 * workarounds for non-interactive elements with click handlers. */
export default function Modal({ onClose, labelledBy, className, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    const handleCancel = (e) => {
      e.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  const handleClick = (e) => {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={`modal-content ${className || ''}`.trim()}
      aria-labelledby={labelledBy}
      onClick={handleClick}
    >
      {children}
    </dialog>
  )
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  labelledBy: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

Modal.defaultProps = {
  labelledBy: undefined,
  className: '',
}
