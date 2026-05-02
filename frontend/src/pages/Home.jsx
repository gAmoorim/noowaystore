import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProdutos } from '../services/api'
import { ProductCard, Footer } from '../components/Shared'

const productImage = product => product?.imagem || product?.img_principal || product?.imagens?.[0]?.url

export default function Home() {
  const [products, setProducts] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)
  const navigate = useNavigate()
  const heroProducts = products.filter(productImage).slice(0, 4)

  useEffect(() => {
    getProdutos().then(data => {
      const list = Array.isArray(data) ? data : (data.produtos || [])
      setProducts(list.slice(0, 8))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (heroProducts.length < 2) return

    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroProducts.length)
    }, 3600)

    return () => clearInterval(timer)
  }, [heroProducts.length])

  useEffect(() => {
    if (heroIndex >= heroProducts.length) setHeroIndex(0)
  }, [heroIndex, heroProducts.length])

  return (
    <div>
      {/* HERO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100vh - 68px)' }}>
        <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 28 }}>Coleção 2026 · Calçados &amp; Sandálias</p>
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

        <HeroCarousel products={heroProducts} active={heroIndex} onSelect={setHeroIndex} onOpen={id => navigate(`/produto/${id}`)} />
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--category-bg)' }}>
        {[
          { num: '01', name: 'Sandálias & Rasteiras', q: 'Sandália' },
          { num: '02', name: 'Tênis & Esportivos', q: 'Tênis' },
          { num: '03', name: 'Botas & Coturnos', q: 'Bota' },
        ].map(({ num, name, q }, i) => (
          <div key={num} onClick={() => navigate(`/produtos?cat=${q}`)} style={{ padding: '52px 44px', cursor: 'pointer', borderRight: i < 2 ? '1px solid var(--category-border)' : 'none', transition: 'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--category-hover)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
            <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--category-muted)', marginBottom: 12 }}>Categoria {num}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300, color: 'var(--category-heading)', marginBottom: 16 }}>{name}</div>
            <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--category-muted)' }}>Explorar →</div>
          </div>
        ))}
      </div>

      <Footer />
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  )
}

function HeroCarousel({ products, active, onSelect, onOpen }) {
  const product = products[active]

  return (
    <div style={{ background: '#131210', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(139,58,42,.2),rgba(10,10,10,.82) 48%,#0A0A0A)' }} />

      {product ? (
        <>
          {products.map((p, i) => {
            const img = productImage(p)
            return (
              <button
                key={p.id}
                onClick={() => onOpen(p.id)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'none',
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? 'scale(1)' : 'scale(1.03)',
                  transition: 'opacity .7s ease, transform 1.2s ease',
                  pointerEvents: active === i ? 'auto' : 'none',
                  cursor: 'pointer'
                }}
              >
                <img src={img} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '72px 86px 110px' }} />
              </button>
            )
          })}

          <div style={{ position: 'absolute', left: 48, right: 48, bottom: 40, zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>{product.categoria_nome || 'Produto'}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300, color: '#fff', lineHeight: 1.05 }}>{product.nome}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(i)}
                  aria-label={`Ver ${p.nome}`}
                  style={{
                    width: active === i ? 34 : 10,
                    height: 4,
                    border: 'none',
                    background: active === i ? '#fff' : 'rgba(255,255,255,.28)',
                    cursor: 'pointer',
                    transition: 'all .25s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,.62)', fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Imagens dos produtos
        </div>
      )}
    </div>
  )
}
