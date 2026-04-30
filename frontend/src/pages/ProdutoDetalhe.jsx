import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduto, getImagensProduto, getEstoque } from '../services/api'
import { useCart, useToast } from '../context/AppContext'
import { ShoeIcon } from '../components/Shared'

export default function ProdutoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [estoque, setEstoque] = useState([])
  const [loading, setLoading] = useState(true)
  const [mainImg, setMainImg] = useState(null)
  const [selSize, setSelSize] = useState(null)
  const [selColor, setSelColor] = useState(null)
  const [qty, setQty] = useState(1)

  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getProduto(id),
      getImagensProduto(id).catch(() => []),
      getEstoque().catch(() => [])
    ]).then(([prod, imgs, allEst]) => {
      const productImages = Array.isArray(imgs) && imgs.length ? imgs : (prod.imagens || [])
      setProduct(prod)
      setImages(productImages)
      const est = (Array.isArray(allEst) ? allEst : []).filter(e => e.produto_id === Number(id))
      setEstoque(est)
      const principal = productImages.find(i => i.img_principal) || productImages[0]
      setMainImg(principal?.url || prod.imagem || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const sizes = [...new Set(estoque.map(e => e.tamanho).filter(Boolean))]
  const colors = [...new Set(estoque.map(e => e.cor).filter(Boolean))]

  const resolveEst = (size, color) => {
    return estoque.find(e =>
      (!size || e.tamanho === size) && (!color || e.cor === color)
    )
  }

  const currentEst = resolveEst(selSize, selColor)
  const totalQty = estoque.length
    ? estoque.reduce((s, e) => s + e.quantidade, 0)
    : Number(product?.estoque || 0)

  const handleAdd = () => {
    if (sizes.length && !selSize) { toast('Selecione um tamanho', 'e'); return }
    if (colors.length && !selColor) { toast('Selecione uma cor', 'e'); return }
    let est = currentEst || estoque[0]
    if (!est) { toast('Produto sem estoque', 'e'); return }
    if (est.quantidade <= 0) { toast('Produto fora de estoque', 'e'); return }
    addItem({
      estoqueId: est.id, estoqueDisp: est.quantidade,
      produtoId: product.id, nome: product.nome,
      preco: product.preco_promocional || product.preco,
      tamanho: selSize, cor: selColor, quantidade: qty,
      imagem: images?.[0]?.url || null
    })
    toast(`${product.nome} adicionado ao carrinho!`, 's')
  }

  if (loading) return <div className="spin-wrap"><div className="spinner" /></div>
  if (!product) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--mid)' }}>Produto não encontrado.</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)' }}>
      {/* Gallery */}
      <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'sticky', top: 68, height: 'calc(100vh - 68px)' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
          {mainImg
            ? <img src={mainImg} alt={product.nome} style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain' }} />
            : <ShoeIcon size="lg" />}
        </div>
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {images.map((img, i) => (
              <div key={i} onClick={() => setMainImg(img.url)}
                style={{ width: 56, height: 40, background: 'rgba(255,255,255,.6)', border: `1px solid ${mainImg === img.url ? 'var(--char)' : 'var(--border)'}`, cursor: 'pointer', overflow: 'hidden' }}>
                <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '60px 64px', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}>
        <span onClick={() => navigate(-1)} style={{ fontSize: 12, color: 'var(--mid)', letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 28, display: 'inline-block' }}>← Voltar</span>
        <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 10 }}>{product.categoria_nome || 'Calçado'}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300, lineHeight: 1.08, marginBottom: 28 }}>{product.nome}</h1>

        <div style={{ marginBottom: 32 }}>
          {product.preco_promocional ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 300, color: 'var(--accent)' }}>{fmt(product.preco_promocional)}</div>
              <div style={{ fontSize: 16, color: 'var(--mid)', textDecoration: 'line-through', marginTop: 4 }}>{fmt(product.preco)}</div>
            </>
          ) : (
            <div style={{ fontSize: 28, fontWeight: 300 }}>{fmt(product.preco)}</div>
          )}
        </div>

        <div style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.85, paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--border)' }}>
          {product.descricao || 'Calçado de alta qualidade, perfeito para qualquer ocasião.'}
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: 10 }}>Tamanho{selSize && ` — ${selSize}`}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sizes.map(s => {
                const hasStock = estoque.filter(e => e.tamanho === s).some(e => e.quantidade > 0)
                return (
                  <button key={s} disabled={!hasStock} onClick={() => setSelSize(s === selSize ? null : s)}
                    style={{ width: 50, height: 50, border: `1px solid ${selSize === s ? 'var(--black)' : 'var(--border)'}`, background: selSize === s ? 'var(--black)' : 'none', color: !hasStock ? 'var(--border)' : selSize === s ? '#fff' : 'var(--char)', fontSize: 13, cursor: hasStock ? 'pointer' : 'not-allowed', textDecoration: !hasStock ? 'line-through' : 'none', transition: 'all .2s' }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: 10 }}>Cor{selColor && ` — ${selColor}`}</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map(c => (
                <button key={c} onClick={() => setSelColor(c === selColor ? null : c)}
                  style={{ padding: '8px 18px', border: `1px solid ${selColor === c ? 'var(--black)' : 'var(--border)'}`, background: selColor === c ? 'var(--black)' : 'none', color: selColor === c ? '#fff' : 'var(--char)', fontSize: 12, cursor: 'pointer', transition: 'all .2s' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock info */}
        <div style={{ fontSize: 12, marginBottom: 22, color: totalQty <= 0 ? 'var(--danger)' : totalQty <= 5 ? 'var(--gold)' : 'var(--ok)' }}>
          {totalQty <= 0 ? 'Sem estoque' : totalQty <= 5 ? `Últimas unidades (${totalQty} disponíveis)` : 'Em estoque ✓'}
        </div>

        {/* Quantity */}
        <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 10 }}>Quantidade</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, width: 'fit-content' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 42, height: 42, border: '1px solid var(--border)', background: 'none', fontSize: 20, cursor: 'pointer', transition: 'background .2s' }} onMouseEnter={e=>e.target.style.background='var(--cream)'} onMouseLeave={e=>e.target.style.background='none'}>−</button>
          <div style={{ width: 58, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{qty}</div>
          <button onClick={() => setQty(q => q + 1)} style={{ width: 42, height: 42, border: '1px solid var(--border)', background: 'none', fontSize: 20, cursor: 'pointer', transition: 'background .2s' }} onMouseEnter={e=>e.target.style.background='var(--cream)'} onMouseLeave={e=>e.target.style.background='none'}>+</button>
        </div>

        <button className="btn-p" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAdd} disabled={totalQty <= 0}>
          {totalQty <= 0 ? 'Sem estoque' : 'Adicionar ao Carrinho'}
        </button>
        <button className="btn-s" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => navigate('/carrinho')}>
          Ver Carrinho
        </button>
      </div>
    </div>
  )
}
