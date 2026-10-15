import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <p className="empty">
      Page not found. <Link to="/">Back to the shop</Link>
    </p>
  )
}
