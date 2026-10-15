// Sends the cart to the proxy, which creates one BC webOrders record per line
export async function placeOrder(lines) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lines: lines.map((l) => ({ itemNo: l.product.number, quantity: l.qty })),
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data // { orderNos, lines }
}
