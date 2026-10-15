import { useCart } from '../context/CartContext'
import { money } from '../lib/format'

export default function ProductCard({ product }) {
  const { add } = useCart()
  return (
    <article className="card">
      <div className="thumb">{product.emoji}</div>
      <h2>{product.name}</h2>
      <p className="muted">{product.description}</p>
      <div className="row">
        <strong>{money(product.price)}</strong>
        <button className="primary" onClick={() => add(product)}>
          Add to cart
        </button>
      </div>
    </article>
  )
}
