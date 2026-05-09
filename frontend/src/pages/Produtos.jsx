import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProdutos, getCategorias, getPromocoes } from '../services/api'
import { ProductCard } from '../components/Shared'

const cleanParams = params => Object.fromEntries(
  Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
)

export default function Produtos() {
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('')
  const [filters, setFilters] = useState({ nome: '', preco_min: '', preco_max: '', disponivel: '' })
  const [saleOnly, setSaleOnly] = useState(false)
  const [searchParams] = useSearchParams()
  const catQuery = searchParams.get('cat')
  const offersQuery = searchParams.get('ofertas') === '1'
  const [activeCat, setActiveCat] = useState(null)

  const setFilter = key => e => setFilters(prev => ({ ...prev, [key]: e.target.value }))

  useEffect(() => {
    getCategorias()
      .then(setCats)
      .catch(() => setCats([]))
  }, [])

  useEffect(() => {
    setSaleOnly(offersQuery)
    if (offersQuery) setActiveCat(null)
  }, [offersQuery])

  useEffect(() => {
    if (offersQuery) return
    if (catQuery && cats.length) {
      const found = cats.find(c => c.nome.toLowerCase().includes(catQuery.toLowerCase()))
      setActiveCat(found?.id || null)
    }
  }, [catQuery, cats, offersQuery])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getProdutos(cleanParams({ ...filters, categoria_id: activeCat })),
      getPromocoes().catch(() => [])
    ])
      .then(([data, promocoes]) => {
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
        setProducts(merged)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeCat, filters])

  let sorted = [...products]
  if (sort === 'asc') sorted = sorted.sort((a, b) => a.preco - b.preco)
  if (sort === 'desc') sorted = sorted.sort((a, b) => b.preco - a.preco)
  if (sort === 'az') sorted = sorted.sort((a, b) => a.nome.localeCompare(b.nome))
  if (saleOnly) sorted = sorted.filter(p => p.preco_promocional)

  const clearFilters = () => {
    setActiveCat(null)
    setSaleOnly(false)
    setFilters({ nome: '', preco_min: '', preco_max: '', disponivel: '' })
    setSort('')
  }

  return (
    <div>
      <div className="catalog-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '64px 52px 28px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300 }}>Colecao Completa</h1>
          <p style={{ fontSize: 12, color: 'var(--mid)' }}>{sorted.length} produto{sorted.length !== 1 ? 's' : ''}</p>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 14px', fontSize: 12, border: '1px solid var(--border)', background: 'var(--warm)', color: 'var(--char)', letterSpacing: '.04em' }}>
          <option value="">Ordenar</option>
          <option value="asc">Menor preco</option>
          <option value="desc">Maior preco</option>
          <option value="az">Nome A-Z</option>
        </select>
      </div>

      <div className="catalog-cats" style={{ padding: '18px 52px', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', background: 'var(--warm)', position: 'sticky', top: 68, zIndex: 50 }}>
        {[{ id: null, nome: 'Todos' }, ...cats].map(c => (
          <button key={c.id ?? 'all'} onClick={() => { setSaleOnly(false); setActiveCat(c.id) }}
            style={{ padding: '7px 18px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', background: !saleOnly && activeCat === c.id ? 'var(--cta-bg)' : 'none', color: !saleOnly && activeCat === c.id ? 'var(--cta-text)' : 'var(--mid)', border: `1px solid ${!saleOnly && activeCat === c.id ? 'var(--cta-bg)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all .2s' }}>
            {c.nome}
          </button>
        ))}
        <button onClick={() => { setSaleOnly(prev => !prev); setActiveCat(null) }}
          style={{ padding: '7px 18px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', background: saleOnly ? 'var(--accent)' : 'none', color: saleOnly ? '#fff' : 'var(--accent)', border: `1px solid ${saleOnly ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all .2s' }}>
          Ofertas
        </button>
      </div>

      <div className="catalog-filters" style={{ padding: '18px 52px', display: 'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(3, minmax(120px, .7fr)) auto', gap: 10, alignItems: 'end', borderBottom: '1px solid var(--border)', background: 'var(--warm)' }}>
        <div>
          <label className="fl">Buscar</label>
          <input className="fi" value={filters.nome} onChange={setFilter('nome')} placeholder="Nome do produto" />
        </div>
        <div>
          <label className="fl">Preco min.</label>
          <input className="fi" type="number" min="0" step="0.01" value={filters.preco_min} onChange={setFilter('preco_min')} />
        </div>
        <div>
          <label className="fl">Preco max.</label>
          <input className="fi" type="number" min="0" step="0.01" value={filters.preco_max} onChange={setFilter('preco_max')} />
        </div>
        <div>
          <label className="fl">Estoque</label>
          <select className="fi" value={filters.disponivel} onChange={setFilter('disponivel')}>
            <option value="">Todos</option>
            <option value="true">Disponiveis</option>
            <option value="false">Sem estoque</option>
          </select>
        </div>
        <button className="btn-s" onClick={clearFilters} style={{ height: 42, padding: '0 18px' }}>Limpar</button>
      </div>

      <div className="section-pad" style={{ padding: '0 52px 80px' }}>
        {loading ? (
          <div className="spin-wrap"><div className="spinner" /></div>
        ) : !sorted.length ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mid)' }}>Nenhum produto encontrado.</div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
            {sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
