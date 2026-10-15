import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { count } = useCart()
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <h1>🛍️ BC Shop</h1>
      </Link>
      <nav className="nav">
        <NavLink to="/" end>Shop</NavLink>
        <NavLink to="/cart">
          Cart <span className="badge">{count}</span>
        </NavLink>
      </nav>
    </header>
  )
}
