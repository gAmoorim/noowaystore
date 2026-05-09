import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProdutos, getPromocoes } from '../services/api'
import { ProductCard, Footer } from '../components/Shared'

const productImage = product => product?.imagem || product?.img_principal || product?.imagens?.[0]?.url

export default function Home() {
  const [products, setProducts] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)
  const navigate = useNavigate()
  const heroProducts = products.filter(productImage).slice(0, 4)
  const offerProducts = products.filter(p => p.preco_promocional).slice(0, 4)

  useEffect(() => {
    Promise.all([
      getProdutos(),
      getPromocoes().catch(() => [])
    ]).then(([data, promocoes]) => {
      const list = Array.isArray(data) ? data : (data.produtos || [])
      const promos = Array.isArray(promocoes) ? promocoes : []
      const merged = list.map(product => {
        const promo = promos.find(p => Number(p.produto_id) === Number(product.id))
        return promo && !product.preco_promocional
          ? {
            ...product,
            promocao_id: promo.id,
            preco_promocional: promo.preco_promocional,
            promocao_comeca_em: promo.começa_em,
            promocao_termina_em: promo.termina_em
          }
          : product
      })
      setProducts(merged.slice(0, 8))
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
      <div className="home-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(360px,.9fr) minmax(0,1.1fr)', minHeight: 'calc(100vh - 68px)', background: 'var(--warm)', borderBottom: '1px solid var(--border)' }}>
        <div className="home-hero-copy" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '84px 72px', position: 'relative', overflow: 'hidden' }}>
          <div className="home-hero-kicker" style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24 }}>Coleção 2026 · Noo Way Store</div>
          <h1 className="home-hero-title" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 82, fontWeight: 300, lineHeight: .96, color: 'var(--black)', marginBottom: 30 }}>
            Calçados<br />com <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>presença</em><br />no detalhe
          </h1>
          <p style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.75, maxWidth: 360, marginBottom: 44 }}>
            Uma seleção de tênis, chinelos e sandálias pensada para unir conforto, personalidade e acabamento premium.
          </p>
          <div className="home-hero-actions" style={{ display: 'flex', gap: 16 }}>
            <button className="btn-p" onClick={() => navigate('/produtos')}>Ver Coleção →</button>
            <button className="btn-s" onClick={() => document.getElementById('highlights').scrollIntoView({ behavior: 'smooth' })}>Destaques</button>
          </div>
          <div className="home-hero-meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 58, paddingTop: 24, borderTop: '1px solid var(--border)', maxWidth: 520 }}>
            {['Curadoria urbana', 'Imagens reais', 'Estoque atualizado'].map(item => (
              <span key={item} style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mid)', lineHeight: 1.5 }}>{item}</span>
            ))}
          </div>
        </div>

        <HeroCarousel products={heroProducts} active={heroIndex} onSelect={setHeroIndex} onOpen={id => navigate(`/produto/${id}`)} />
      </div>

      {/* OFFERS */}
      {offerProducts.length > 0 && (
        <div id="offers">
          <div className="section-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '64px 52px 28px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Ofertas Ativas</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300 }}>Preços em Destaque</h2>
            </div>
            <span onClick={() => navigate('/produtos?ofertas=1')} style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)', cursor: 'pointer' }}>Ver ofertas →</span>
          </div>
          <div className="section-pad" style={{ padding: '0 52px 72px', background: 'var(--cream)' }}>
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
              {offerProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </div>
      )}

      {/* HIGHLIGHTS */}
      <div id="highlights">
        <div className="section-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '64px 52px 28px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Destaque da Semana</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300 }}>Curadoria em Foco</h2>
          </div>
          <span onClick={() => navigate('/produtos')} style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)', cursor: 'pointer' }}>Ver todos →</span>
        </div>
        <div className="section-pad" style={{ padding: '0 52px 80px' }}>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
            {products.length ? products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            )) : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 28, height: 300, background: 'var(--cream)', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES FEATURE */}
      <div className="home-categories" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--category-bg)' }}>
        {[
          { num: '01', name: 'Sandálias & Rasteiras', q: 'Sandália' },
          { num: '02', name: 'Tênis & Esportivos', q: 'Tênis' },
          { num: '03', name: 'Botas & Coturnos', q: 'Bota' },
        ].map(({ num, name, q }, i) => (
          <div className="home-category-card" key={num} onClick={() => navigate(`/produtos?cat=${q}`)} style={{ padding: '52px 44px', cursor: 'pointer', borderRight: i < 2 ? '1px solid var(--category-border)' : 'none', transition: 'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--category-hover)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
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
    <div className="hero-carousel" style={{ background: '#131210', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderLeft: '1px solid var(--border)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(196,99,62,.24),rgba(10,10,10,.72) 46%,#050505)' }} />
      <div className="hero-carousel-frame" style={{ position: 'absolute', inset: 42, border: '1px solid rgba(255,255,255,.08)' }} />

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
                <img className="hero-carousel-img" src={img} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '72px 96px 120px', filter: 'drop-shadow(0 28px 40px rgba(0,0,0,.32))' }} />
              </button>
            )
          })}

          <div className="hero-carousel-caption" style={{ position: 'absolute', left: 48, right: 48, bottom: 40, zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28 }}>
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
