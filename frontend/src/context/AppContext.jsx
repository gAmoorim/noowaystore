import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ===== TOAST =====
const ToastCtx = createContext(null)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = useCallback((msg, type = 'i') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)

// ===== THEME =====
const ThemeCtx = createContext(null)
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('nws_theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') document.documentElement.dataset.theme = 'dark'
    else delete document.documentElement.dataset.theme
    localStorage.setItem('nws_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return <ThemeCtx.Provider value={{ theme, toggleTheme }}>
    {children}
  </ThemeCtx.Provider>
}
export const useTheme = () => useContext(ThemeCtx)

// ===== AUTH =====
const AuthCtx = createContext(null)

function getPayloadFromToken(token) {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function getTipoFromToken(token) {
  return getPayloadFromToken(token)?.tipo || null
}

function isTokenExpired(token) {
  const exp = getPayloadFromToken(token)?.exp
  return !exp || exp * 1000 <= Date.now()
}

function clearStoredAuth() {
  localStorage.removeItem('nws_token')
  localStorage.removeItem('nws_user')
}

function normalizeUser(user, token) {
  const tipo = user?.tipo || getTipoFromToken(token)
  return user && tipo ? { ...user, tipo } : user
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('nws_token')
    if (!savedToken || isTokenExpired(savedToken)) {
      clearStoredAuth()
      return null
    }

    return savedToken
  })
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('nws_token')
    if (!savedToken || isTokenExpired(savedToken)) {
      clearStoredAuth()
      return null
    }

    const savedUser = JSON.parse(localStorage.getItem('nws_user') || 'null')
    return normalizeUser(savedUser, savedToken)
  })

  const setAuth = (token, user) => {
    const normalizedUser = normalizeUser(user, token)
    setToken(token); setUser(normalizedUser)
    localStorage.setItem('nws_token', token)
    localStorage.setItem('nws_user', JSON.stringify(normalizedUser))
  }
  const logout = () => {
    setToken(null); setUser(null)
    clearStoredAuth()
  }

  return <AuthCtx.Provider value={{ user, token, setAuth, logout, isAdmin: user?.tipo === 'admin' }}>
    {children}
  </AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)

// ===== CART =====
const CartCtx = createContext(null)
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('nws_cart') || '[]'))

  useEffect(() => {
    localStorage.setItem('nws_cart', JSON.stringify(cart))
  }, [cart])

  const addItem = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.estoqueId === item.estoqueId)
      if (ex) {
        if (ex.quantidade + item.quantidade > item.estoqueDisp) return prev
        return prev.map(c => c.estoqueId === item.estoqueId ? { ...c, quantidade: c.quantidade + item.quantidade } : c)
      }
      return [...prev, { ...item }]
    })
  }

  const removeItem = (estoqueId) => setCart(prev => prev.filter(c => c.estoqueId !== estoqueId))

  const updateQty = (estoqueId, qty) => {
    if (qty < 1) return
    setCart(prev => prev.map(c => c.estoqueId === estoqueId ? { ...c, quantidade: Math.min(qty, c.estoqueDisp) } : c))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const count = cart.reduce((s, i) => s + i.quantidade, 0)

  return <CartCtx.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total, count }}>
    {children}
  </CartCtx.Provider>
}
export const useCart = () => useContext(CartCtx)
