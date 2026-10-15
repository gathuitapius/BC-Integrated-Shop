import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartLine from '../components/CartLine'
import { useCart } from '../context/CartContext'
import { money } from '../lib/format'
import { placeOrder } from '../lib/orders'

export default function CartPage() {
  const { lines, total, clear } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const checkout = async () => {
    setSubmitting(true)
    setError('')
    try {
      const { orderNos } = await placeOrder(lines)
      clear()
      navigate('/', { state: { orderNos } })
    } catch (e) {
      setError(`Could not place order: ${e.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="cart-page">
      <h2>Your cart</h2>
      {lines.length === 0 ? (
        <p className="muted">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <ul className="lines">
            {lines.map((l) => (
              <CartLine key={l.product.id} line={l} />
            ))}
          </ul>
          <div className="row total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="primary wide" onClick={checkout} disabled={submitting}>
            {submitting ? 'Placing order…' : 'Checkout'}
          </button>
        </>
      )}
    </section>
  )
}
