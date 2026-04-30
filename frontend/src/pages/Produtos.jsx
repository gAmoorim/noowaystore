import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProdutos, getCategorias } from '../services/api'
import { ProductCard } from '../components/Shared'

export default function Produtos() {
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('')
  const [searchParams] = useSearchParams()
  const catQuery = searchParams.get('cat')
  const [activeCat, setActiveCat] = useState(null)

  useEffect(() => {
    Promise.all([getProdutos(), getCategorias()])
      .then(([p, c]) => {
        setProducts(Array.isArray(p) ? p : (p.produtos || []))
        setCats(Array.isArray(c) ? c : [])
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (catQuery && cats.length) {
      const found = cats.find(c => c.nome.toLowerCase().includes(catQuery.toLowerCase()))
      setActiveCat(found?.id || null)
    }
  }, [catQuery, cats])

  let filtered = activeCat ? products.filter(p => p.categoria_id === activeCat) : products
  if (sort === 'asc') filtered = [...filtered].sort((a, b) => a.preco - b.preco)
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.preco - a.preco)
  if (sort === 'az') filtered = [...filtered].sort((a, b) => a.nome.localeCompare(b.nome))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '64px 52px 28px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300 }}>Coleção Completa</h1>
          <p style={{ fontSize: 12, color: 'var(--mid)' }}>{filtered.length} produto{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 14px', fontSize: 12, border: '1px solid var(--border)', background: 'var(--warm)', color: 'var(--char)', letterSpacing: '.04em' }}>
          <option value="">Ordenar</option>
          <option value="asc">Menor preço</option>
          <option value="desc">Maior preço</option>
          <option value="az">Nome A–Z</option>
        </select>
      </div>

      {/* Categories bar */}
      <div style={{ padding: '18px 52px', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', background: 'var(--warm)', position: 'sticky', top: 68, zIndex: 50 }}>
        {[{ id: null, nome: 'Todos' }, ...cats].map(c => (
          <button key={c.id ?? 'all'} onClick={() => setActiveCat(c.id)}
            style={{ padding: '7px 18px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', background: activeCat === c.id ? 'var(--black)' : 'none', color: activeCat === c.id ? '#fff' : 'var(--mid)', border: `1px solid ${activeCat === c.id ? 'var(--black)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all .2s' }}>
            {c.nome}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '0 52px 80px' }}>
        {loading ? (
          <div className="spin-wrap"><div className="spinner" /></div>
        ) : !filtered.length ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mid)' }}>Nenhum produto nesta categoria.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '1px solid var(--border)' }}>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
