/* global process */
import http from 'node:http'
import fs from 'node:fs'
import httpntlm from 'httpntlm'

// Minimal .env loader (server/.env)
try {
  for (const line of fs.readFileSync(new URL('./.env', import.meta.url), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m) process.env[m[1]] ??= m[2]
  }
} catch {
  /* no .env file */
}

const { BC_URL, BC_ORDERS_URL, BC_CUSTOMER_NO, BC_ORDER_DATE, BC_DOMAIN, BC_USER, BC_PASSWORD, PORT = 3001 } = process.env

const auth = { username: BC_USER, password: BC_PASSWORD, domain: BC_DOMAIN, workstation: '' }

// Promise wrapper around httpntlm; resolves with { statusCode, body } or rejects on network error
const ntlm = (method, options) =>
  new Promise((resolve, reject) => {
    httpntlm[method]({ ...auth, ...options }, (err, res) => (err || !res ? reject(err ?? new Error('No response from BC')) : resolve(res)))
  })

const send = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(typeof payload === 'string' ? payload : JSON.stringify(payload))
}

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw))
      } catch (e) {
        reject(e)
      }
    })
  })

async function getItems(res) {
  const bc = await ntlm('get', { url: `${BC_URL}/items` })
  send(res, bc.statusCode, bc.body)
}

// Body: { lines: [{ itemNo, quantity }] }. Creates one webOrders record per line; BC assigns each orderNo.
async function postOrder(req, res) {
  const { lines } = await readJson(req)
  if (!Array.isArray(lines) || lines.length === 0) return send(res, 400, { error: 'No order lines' })

  // BC_ORDER_DATE (YYYY-MM-DD) overrides today's date, e.g. when the BC license only allows certain months
  const orderDate = BC_ORDER_DATE || new Date().toISOString().slice(0, 10)

  const orderNos = []
  for (const line of lines) {
    const bc = await ntlm('post', {
      url: BC_ORDERS_URL,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerNo: BC_CUSTOMER_NO, itemNo: line.itemNo, quantity: line.quantity, orderDate }),
    })
    if (bc.statusCode !== 201) {
      let reason = bc.body
      try {
        reason = JSON.parse(bc.body).error.message
      } catch {
        /* body wasn't BC's JSON error format */
      }
      console.error(`BC rejected item ${line.itemNo} (HTTP ${bc.statusCode}): ${reason}`)
      return send(res, 502, { error: `BC rejected item ${line.itemNo}: ${reason}` })
    }
    orderNos.push(JSON.parse(bc.body).orderNo)
  }
  send(res, 201, { orderNos, lines: lines.length })
}

http
  .createServer(async (req, res) => {
    try {
      if (req.method === 'GET' && req.url === '/api/items') return await getItems(res)
      if (req.method === 'POST' && req.url === '/api/orders') return await postOrder(req, res)
      res.writeHead(404).end()
    } catch (err) {
      send(res, 502, { error: String(err) })
    }
  })
  .listen(PORT, () => console.log(`BC proxy on http://localhost:${PORT}`))
