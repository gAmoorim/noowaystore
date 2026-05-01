import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, CartProvider, ThemeProvider, ToastProvider, useAuth } from './context/AppContext'
import { Navbar } from './components/Shared'
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import ProdutoDetalhe from './pages/ProdutoDetalhe'
import Carrinho from './pages/Carrinho'
import Checkout from './pages/Checkout'
import { Login, Cadastro } from './pages/Auth'
import Conta from './pages/Conta'
import Admin from './pages/Admin'

function ProtectedAdmin({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.tipo !== 'admin') return <Navigate to="/" />
  return children
}

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/produtos" element={<StoreLayout><Produtos /></StoreLayout>} />
      <Route path="/produto/:id" element={<StoreLayout><ProdutoDetalhe /></StoreLayout>} />
      <Route path="/carrinho" element={<StoreLayout><Carrinho /></StoreLayout>} />
      <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
      <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
      <Route path="/cadastro" element={<StoreLayout><Cadastro /></StoreLayout>} />
      <Route path="/conta" element={<StoreLayout><Conta /></StoreLayout>} />
      <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}
