import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SuccessBanner from '../components/SuccessBanner'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import { useProducts } from '../hooks/useProducts'

export default function ShopPage() {
  const { products, status } = useProducts()
  const { state } = useLocation()
  const [orderNos, setOrderNos] = useState(state?.orderNos ?? null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    )
  }, [products, query, category])

  const banner = orderNos && (
    <SuccessBanner onClose={() => setOrderNos(null)}>Orders Posted Successfully (order {orderNos.join(', ')})</SuccessBanner>
  )

  if (status === 'loading') return <p className="empty">Loading items from Business Central…</p>
  if (status === 'error')
    return <p className="empty">Could not load items. Is the proxy running (npm run server)?</p>

  return (
    <>
      {banner}
      <SearchBar value={query} onChange={setQuery} />
      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
      {visible.length === 0 ? <p className="empty">No products match your search.</p> : <ProductGrid products={visible} />}
    </>
  )
}
