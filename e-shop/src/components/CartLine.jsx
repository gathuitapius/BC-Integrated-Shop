import { useCart } from '../context/CartContext'
import { money } from '../lib/format'

export default function CartLine({ line }) {
  const { setQty } = useCart()
  const { product, qty } = line
  return (
    <li>
      <span className="emoji">{product.emoji}</span>
      <div className="grow">
        <div>{product.name}</div>
        <div className="muted">{money(product.price)}</div>
      </div>
      <div className="qty">
        <button onClick={() => setQty(product, qty - 1)}>−</button>
        <span>{qty}</span>
        <button onClick={() => setQty(product, qty + 1)}>+</button>
      </div>
      <strong className="line-total">{money(product.price * qty)}</strong>
    </li>
  )
}
