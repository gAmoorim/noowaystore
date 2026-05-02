import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, useCart, useTheme } from '../context/AppContext'

// ===== SHOE SVG =====
export function ShoeIcon({ size = 'md' }) {
  const s = size === 'lg' ? { w: 280, h: 200, scale: 1 } : { w: 64, h: 44, scale: 0.23 }
  return (
    <svg width={s.w} height={s.h} viewBox="0 0 280 200" fill="none">
      <ellipse cx="140" cy="168" rx="115" ry="10" fill="#EDEAE4"/>
      <path d="M48 155 Q64 163 140 163 Q216 163 232 155 L228 148 Q196 158 140 158 Q84 158 52 148Z" fill="#D8CFC4"/>
      <path d="M52 148 Q64 136 80 132 L80 118 Q62 121 52 133Z" fill="#C4B8A8"/>
      <path d="M80 132 Q106 127 140 125 Q174 123 204 127 L228 148 Q196 158 140 158 Q84 158 52 148Z" fill="#8B3A2A"/>
      <path d="M196 127 Q218 124 230 130 L228 148 Q212 155 196 158Z" fill="#A04535"/>
      <path d="M84 129 Q116 123 152 122 Q166 121 180 122" stroke="rgba(255,255,255,.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="90" y="118" width="74" height="14" rx="2" fill="#6B2A1D" opacity=".8"/>
      <path d="M80 118 Q82 110 90 105 L108 103 Q96 109 92 118Z" fill="#6B2A1D"/>
      <path d="M108 129 Q128 124 158 123" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M108 124 Q128 119 158 118" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ===== PRODUCT CARD =====
export function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
  const image = product.imagem || product.img_principal || product.imagens?.[0]?.url
  const isNew = product.criado_em && new Date(product.criado_em) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <div
      onClick={() => navigate(`/produto/${product.id}`)}
      style={{
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '28px 22px 58px',
        cursor: 'pointer',
        transition: 'background .2s',
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeUp .4s ease ${index * 0.06}s both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--cream)'
        e.currentTarget.querySelector('.pc-cta').style.opacity = '1'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.querySelector('.pc-cta').style.opacity = '0'
      }}
    >
      {product.preco_promocional
        ? <div style={badgeStyle('#8B3A2A')}>Promoção</div>
        : isNew ? <div style={badgeStyle('#1C1C1C')}>Novo</div> : null}

      <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--image-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, overflow: 'hidden' }}>
        {image
          ? <img src={image} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <ShoeIcon size="sm" />}
      </div>

      <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 4 }}>{product.categoria_nome || ''}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, lineHeight: 1.2, marginBottom: 10, color: 'var(--black)' }}>{product.nome}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {product.preco_promocional
          ? <>
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--accent)' }}>{fmt(product.preco_promocional)}</span>
            <span style={{ fontSize: 13, color: 'var(--mid)', textDecoration: 'line-through' }}>{fmt(product.preco)}</span>
          </>
          : <span style={{ fontSize: 15, fontWeight: 500 }}>{fmt(product.preco)}</span>}
      </div>

      <div className="pc-cta" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 38, background: 'var(--cta-bg)', color: 'var(--cta-text)', opacity: 0, transition: 'opacity .2s', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Ver Produto
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

function badgeStyle(bg) {
  return { position: 'absolute', top: 14, left: 14, background: bg, color: '#fff', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 10px' }
}

function ThemeIcon({ theme }) {
  if (theme === 'dark') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 2.8v2.7M12 18.5v2.7M4.8 4.8l1.9 1.9M17.3 17.3l1.9 1.9M2.8 12h2.7M18.5 12h2.7M4.8 19.2l1.9-1.9M17.3 6.7l1.9-1.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M18.7 14.8A7.6 7.6 0 0 1 9.2 5.3a7.9 7.9 0 1 0 9.5 9.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M17.7 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" fill="currentColor" />
    </svg>
  )
}

// ===== MODAL =====
export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--warm)', padding: '44px 48px', width, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', position: 'relative', animation: 'fadeUp .2s ease' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', fontSize: 22, color: 'var(--mid)', cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, marginBottom: 28 }}>{title}</div>
        {children}
      </div>
    </div>
  )
}

// ===== NAVBAR =====
export function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)

  const navBtnStyle = {
    height: 68, padding: '0 18px', background: 'none', border: 'none',
    borderLeft: '1px solid var(--border)', fontSize: 12,
    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)',
    cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 8
  }

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--warm)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 52px', height: 68 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/')}>Noo Way Store</span>

        <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }}>
          <li><Link to="/" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)', transition: 'color .2s' }} onMouseEnter={e=>e.target.style.color='var(--black)'} onMouseLeave={e=>e.target.style.color='var(--mid)'}>Início</Link></li>
          <li><Link to="/produtos" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)', transition: 'color .2s' }} onMouseEnter={e=>e.target.style.color='var(--black)'} onMouseLeave={e=>e.target.style.color='var(--mid)'}>Produtos</Link></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button style={navBtnStyle} onClick={() => setSearchOpen(true)} onMouseEnter={e=>e.currentTarget.style.color='var(--black)'} onMouseLeave={e=>e.currentTarget.style.color='var(--mid)'}>⌕ Buscar</button>
          <button
            style={{ ...navBtnStyle, minWidth: 56, justifyContent: 'center' }}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo noturno'}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo noturno'}
            onMouseEnter={e=>e.currentTarget.style.color='var(--black)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--mid)'}
          >
            <ThemeIcon theme={theme} />
          </button>
          {user ? (
            <>
              <button style={navBtnStyle} onClick={() => navigate('/conta')} onMouseEnter={e=>e.currentTarget.style.color='var(--black)'} onMouseLeave={e=>e.currentTarget.style.color='var(--mid)'}>{user.nome?.split(' ')[0] || 'Conta'}</button>
              {user.tipo === 'admin' && <button style={navBtnStyle} onClick={() => navigate('/admin')} onMouseEnter={e=>e.currentTarget.style.color='var(--black)'} onMouseLeave={e=>e.currentTarget.style.color='var(--mid)'}>Admin</button>}
            </>
          ) : (
            <button style={navBtnStyle} onClick={() => navigate('/login')} onMouseEnter={e=>e.currentTarget.style.color='var(--black)'} onMouseLeave={e=>e.currentTarget.style.color='var(--mid)'}>Entrar</button>
          )}
          <button style={navBtnStyle} onClick={() => navigate('/carrinho')} onMouseEnter={e=>e.currentTarget.style.color='var(--black)'} onMouseLeave={e=>e.currentTarget.style.color='var(--mid)'}>
            Carrinho
            {count > 0 && <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
          </button>
        </div>
      </nav>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

function SearchOverlay({ onClose }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const navigate = useNavigate()
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  const handleSearch = async (val) => {
    setQ(val)
    if (!val.trim()) { setResults([]); return }
    try {
      const params = new URLSearchParams({ nome: val })
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/produtos?${params}`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.produtos || [])
      setResults(list.slice(0, 7))
    } catch {}
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120 }}>
      <div style={{ background: 'var(--warm)', width: 600, maxWidth: '92vw', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <span style={{ fontSize: 18, color: 'var(--mid)', marginRight: 12 }}>⌕</span>
          <input autoFocus style={{ flex: 1, padding: '20px 0', fontSize: 16, border: 'none', background: 'none', color: 'var(--char)' }} placeholder="Buscar produtos..." value={q} onChange={e => handleSearch(e.target.value)} onKeyDown={e => e.key === 'Escape' && onClose()} />
        </div>
        {results.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', maxHeight: 400, overflowY: 'auto' }}>
            {results.map(p => (
              <div key={p.id} onClick={() => { navigate(`/produto/${p.id}`); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <div style={{ width: 56, height: 40, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {p.imagem || p.img_principal ? <img src={p.imagem || p.img_principal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoeIcon />}
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17 }}>{p.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--mid)' }}>{fmt(p.preco_promocional || p.preco)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {q && !results.length && <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--mid)', fontSize: 14 }}>Nenhum resultado para "{q}"</div>}
      </div>
    </div>
  )
}

// ===== FOOTER =====
export function Footer() {
  const navigate = useNavigate()
  const col = { }
  return (
    <footer style={{ background: 'var(--footer-bg)', color: 'var(--footer-text)', padding: '64px 52px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 44, marginBottom: 52 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--footer-strong)', marginBottom: 12 }}>Noo Way Store</div>
          <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 220 }}>Calçados com personalidade para quem não segue tendências — as cria.</p>
        </div>
        {[
          { title: 'Loja', links: [{ l: 'Todos os Produtos', to: '/produtos' }, { l: 'Sandálias', to: '/produtos?cat=Sandália' }, { l: 'Tênis', to: '/produtos?cat=Tênis' }, { l: 'Botas', to: '/produtos?cat=Bota' }] },
          { title: 'Conta', links: [{ l: 'Minha Conta', to: '/conta' }, { l: 'Meus Pedidos', to: '/conta?tab=pedidos' }, { l: 'Endereços', to: '/conta?tab=enderecos' }] },
          { title: 'Contato', links: [{ l: 'contato@noowaystore.com', to: '#' }, { l: '(85) 9 9999-0000', to: '#' }, { l: '@noowaystore', to: '#' }] },
        ].map(({ title, links }) => (
          <div key={title}>
            <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.75)', marginBottom: 16 }}>{title}</div>
            <ul style={{ listStyle: 'none' }}>
              {links.map(({ l, to }) => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <span onClick={() => navigate(to)} style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', cursor: 'pointer', transition: 'color .2s' }} onMouseEnter={e=>e.target.style.color='rgba(255,255,255,.8)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.4)'}>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 24, textAlign: 'center', fontSize: 12 }}>© 2026 Noo Way Store · Todos os direitos reservados</div>
    </footer>
  )
}
