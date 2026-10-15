export default function SuccessBanner({ children, onClose }) {
  return (
    <div className="banner success" role="status">
      <span>✅ {children}</span>
      <button onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  )
}
