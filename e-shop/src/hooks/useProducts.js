import { useEffect, useState } from 'react'
import { fetchProducts } from '../lib/items'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    fetchProducts()
      .then((p) => {
        setProducts(p)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  return { products, status }
}
