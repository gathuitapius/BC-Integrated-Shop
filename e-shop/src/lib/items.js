const emojiFor = (item) => (item.type === 'Service' ? '🛠️' : '📦')

// Map a Business Central item to the shape the shop uses
export const toProduct = (i) => ({
  id: i.id,
  number: i.number,
  name: i.displayName || i.number,
  category: i.itemCategoryCode || 'General',
  price: i.unitPrice ?? 0,
  emoji: emojiFor(i),
  description: `${i.number} · ${i.type}${i.type === 'Inventory' ? ` · ${i.inventory} in stock` : ''}`,
})

export async function fetchProducts() {
  const res = await fetch('/api/items')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.value.filter((i) => !i.blocked).map(toProduct)
}
