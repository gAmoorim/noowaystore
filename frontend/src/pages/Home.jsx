import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProdutos } from '../services/api'
import { ProductCard, ShoeIcon, Footer } from '../components/Shared'

export default function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getProdutos().then(data => {
      const list = Array.isArray(data) ? data : (data.produtos || [])
      setProducts(list.slice(0, 8))
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* HERO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100vh - 68px)' }}>
        <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 28 }}>Coleção 2025 · Calçados &amp; Sandálias</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 76, fontWeight: 300, lineHeight: 1.02, color: 'var(--black)', marginBottom: 28 }}>
            Pisando<br />com <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Estilo</em><br />e Atitude
          </h1>
          <p style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.75, maxWidth: 360, marginBottom: 44 }}>
            Do clássico ao ousado — encontre o calçado que conta a sua história com qualidade premium.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="btn-p" onClick={() => navigate('/produtos')}>Ver Coleção →</button>
            <button className="btn-s" onClick={() => document.getElementById('highlights').scrollIntoView({ behavior: 'smooth' })}>Destaques</button>
          </div>
        </div>

        <div style={{ background: '#131210', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(139,58,42,.18) 0%,transparent 65%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <svg width="340" height="240" viewBox="0 0 340 240" fill="none">
              <ellipse cx="170" cy="200" rx="140" ry="11" fill="rgba(255,255,255,.04)"/>
              <path d="M60 185 Q80 195 170 195 Q260 195 280 185 L275 178 Q240 188 170 188 Q100 188 65 178Z" fill="#3A2A20"/>
              <path d="M65 178 Q80 165 100 160 L100 145 Q78 148 65 162Z" fill="#5C3D2A"/>
              <path d="M100 160 Q130 155 170 153 Q210 151 250 155 L275 178 Q240 188 170 188 Q100 188 65 178Z" fill="#8B3A2A"/>
              <path d="M240 155 Q265 152 280 158 L275 178 Q260 185 240 188Z" fill="#A04535"/>
              <path d="M105 157 Q140 150 180 149 Q200 148 220 149" stroke="rgba(255,255,255,.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <rect x="115" y="148" width="90" height="15" rx="2" fill="#6B2A1D" opacity=".8"/>
              <path d="M125 152 Q152 150 185 152" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" fill="none"/>
              <path d="M125 157 Q152 155 185 157" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" fill="none"/>
              <path d="M100 145 Q100 135 110 128 L130 125 Q120 132 115 145Z" fill="#6B2A1D"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: 32, right: 40, fontFamily: "'Cormorant Garamond',serif", fontSize: 90, fontWeight: 300, color: 'rgba(255,255,255,.04)', letterSpacing: '.05em', lineHeight: 1, pointerEvents: 'none' }}>STYLE</div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div id="highlights">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '64px 52px 28px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 8 }}>Destaque da Semana</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300 }}>Novidades em Foco</h2>
          </div>
          <span onClick={() => navigate('/produtos')} style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)', cursor: 'pointer' }}>Ver todos →</span>
        </div>
        <div style={{ padding: '0 52px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
            {products.length ? products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            )) : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 28, height: 300, background: 'var(--cream)', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES FEATURE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--char)' }}>
        {[
          { num: '01', name: 'Sandálias & Rasteiras', q: 'Sandália' },
          { num: '02', name: 'Tênis & Esportivos', q: 'Tênis' },
          { num: '03', name: 'Botas & Coturnos', q: 'Bota' },
        ].map(({ num, name, q }, i) => (
          <div key={num} onClick={() => navigate(`/produtos?cat=${q}`)} style={{ padding: '52px 44px', cursor: 'pointer', borderRight: i < 2 ? '1px solid rgba(255,255,255,.08)' : 'none', transition: 'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.04)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
            <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 12 }}>Categoria {num}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300, color: '#fff', marginBottom: 16 }}>{name}</div>
            <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>Explorar →</div>
          </div>
        ))}
      </div>

      <Footer />
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  )
}
