import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('bc-shop-cart')) ?? {}
  } catch {
    return {}
  }
}

// Cart is stored as { [productId]: { product, qty } } so it works without the catalog loaded
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem('bc-shop-cart', JSON.stringify(cart))
    } catch {
      /* storage unavailable */
    }
  }, [cart])

  const setQty = (product, qty) =>
    setCart((c) => {
      const next = { ...c }
      if (qty <= 0) delete next[product.id]
      else next[product.id] = { product, qty }
      return next
    })

  const add = (product) => setQty(product, (cart[product.id]?.qty ?? 0) + 1)
  const clear = () => setCart({})

  const lines = Object.values(cart)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0)

  return (
    <CartContext.Provider value={{ lines, count, total, add, setQty, clear }}>{children}</CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
