import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { CartProvider } from './context/CartContext'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'
import ShopPage from './pages/ShopPage'
import './App.css'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ShopPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
