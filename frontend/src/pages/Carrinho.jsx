import { useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../context/AppContext'
import { ShoeIcon } from '../components/Shared'

export default function Carrinho() {
  const { cart, removeItem, updateQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  if (!cart.length) {
    return (
      <div className="page-pad" style={{ padding: '80px 52px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300, color: 'var(--mid)', marginBottom: 16 }}>Seu carrinho está vazio</h2>
        <p style={{ color: 'var(--mid)', marginBottom: 32 }}>Explore nossa coleção e encontre o par perfeito.</p>
        <button className="btn-p" onClick={() => navigate('/produtos')}>Ver Produtos</button>
      </div>
    )
  }

  return (
    <div className="page-pad" style={{ padding: '64px 52px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300, marginBottom: 36 }}>Carrinho</h1>
      <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 56 }}>

        {/* Items */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {cart.map(item => (
            <div className="cart-item" key={item.estoqueId} style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 24, padding: '24px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div style={{ width: 96, height: 68, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {item.imagem ? <img src={item.imagem} alt={item.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoeIcon />}
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, marginBottom: 4 }}>{item.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--mid)', marginBottom: 12 }}>
                  {[item.tamanho && `Tam: ${item.tamanho}`, item.cor && `Cor: ${item.cor}`].filter(Boolean).join(' · ') || 'Padrão'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => updateQty(item.estoqueId, item.quantidade - 1)} style={{ width: 32, height: 32, border: '1px solid var(--border)', background: 'none', fontSize: 16, cursor: 'pointer' }}>−</button>
                  <span style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.quantidade}</span>
                  <button onClick={() => updateQty(item.estoqueId, item.quantidade + 1)} style={{ width: 32, height: 32, border: '1px solid var(--border)', background: 'none', fontSize: 16, cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeItem(item.estoqueId)} style={{ background: 'none', border: 'none', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mid)', textDecoration: 'underline', cursor: 'pointer', marginLeft: 8 }}>Remover</button>
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{fmt(item.preco * item.quantidade)}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--cream)', padding: 36, height: 'fit-content', position: 'sticky', top: 100 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, marginBottom: 24 }}>Resumo</div>
          {[['Subtotal', fmt(total)], ['Frete', 'Grátis']].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span>{l}</span><span style={l === 'Frete' ? { color: 'var(--ok)' } : {}}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 0', fontSize: 18, fontWeight: 500, borderTop: '2px solid var(--border)', marginTop: 8 }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
          <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}
            onClick={() => { if (!user) { navigate('/login'); return } navigate('/checkout') }}>
            Finalizar Compra →
          </button>
          <button className="btn-s" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => navigate('/produtos')}>
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  )
}
