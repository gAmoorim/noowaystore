import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useToast } from '../context/AppContext'
import { getEnderecos, createEndereco, createPedido } from '../services/api'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [selAddr, setSelAddr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newAddr, setNewAddr] = useState({ logradouro: '', numero: '', complemento: '', cidade: '', estado: '', cep: '' })
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    getEnderecos().then(data => {
      const list = Array.isArray(data) ? data : []
      setAddresses(list)
      if (list.length) setSelAddr(list[0].id)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const normalizeAddress = data => {
    const address = data?.endereco || data
    return Array.isArray(address) ? address[0] : address
  }

  const handleSaveAddr = async () => {
    try {
      const r = await createEndereco(newAddr)
      const savedAddress = normalizeAddress(r)

      if (!savedAddress?.id) {
        toast('Endereço salvo, mas não foi possível selecioná-lo. Recarregue e tente novamente.', 'e')
        return
      }

      setSelAddr(savedAddress.id)
      setAddresses(prev => [...prev, savedAddress])
      setStep(2)
    } catch(e) { toast(e.message, 'e') }
  }

  const handleConfirm = async () => {
    try {
      if (!selAddr) {
        toast('Selecione um endereço de entrega', 'e')
        setStep(1)
        return
      }

      const itens = cart.map(i => ({ estoque_id: i.estoqueId, quantidade: i.quantidade, preco_unitario: i.preco }))
      const r = await createPedido({ endereco_id: selAddr, itens })
      const pedido = r?.pedido || r
      setOrderId(pedido?.id || r?.pedido_id)
      clearCart()
      setStep(3)
    } catch(e) { toast(e.message, 'e') }
  }

  const steps = ['1. Endereço', '2. Revisão', '3. Confirmação']

  return (
    <div>
      {/* Steps bar */}
      <div className="checkout-steps" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '18px 0', textAlign: 'center', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: step === i + 1 ? 'var(--black)' : step > i + 1 ? 'var(--ok)' : 'var(--mid)', borderBottom: `2px solid ${step === i + 1 ? 'var(--black)' : 'transparent'}`, transition: 'all .3s' }}>
            {step > i + 1 ? `✓ ${s}` : s}
          </div>
        ))}
      </div>

      <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 'calc(100vh - 68px - 57px)' }}>
        {/* Main */}
        <div className="checkout-main" style={{ padding: '48px 52px', borderRight: '1px solid var(--border)' }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, marginBottom: 28 }}>Endereço de Entrega</h2>
              {loading ? <div className="spin-wrap"><div className="spinner" /></div> : (
                <>
                  {addresses.length > 0 && (
                    <>
                      <div className="address-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                        {addresses.map(a => (
                          <div key={a.id} onClick={() => setSelAddr(a.id)} style={{ border: `1px solid ${selAddr === a.id ? 'var(--black)' : 'var(--border)'}`, padding: 22, cursor: 'pointer', transition: 'border-color .2s' }}>
                            <div style={{ fontWeight: 500, marginBottom: 6 }}>{a.logradouro}, {a.numero}</div>
                            <div style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.6 }}>
                              {a.complemento && <>{a.complemento}<br /></>}
                              {a.cidade} - {a.estado}<br />CEP: {a.cep}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn-p" onClick={() => { if (!selAddr) { toast('Selecione um endereço', 'e'); return } setStep(2) }}>Continuar →</button>
                    </>
                  )}

                  {!addresses.length && (
                    <>
                      <p style={{ color: 'var(--mid)', marginBottom: 24, fontSize: 14 }}>Nenhum endereço cadastrado. Adicione um abaixo:</p>
                      <AddrForm addr={newAddr} setAddr={setNewAddr} />
                      <button className="btn-p" onClick={handleSaveAddr} style={{ marginTop: 8 }}>Salvar e Continuar →</button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, marginBottom: 28 }}>Revisar Pedido</h2>
              {cart.map(item => (
                <div key={item.estoqueId} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17 }}>{item.nome}</div>
                    <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 2 }}>
                      {[item.tamanho && `Tam: ${item.tamanho}`, item.cor && `Cor: ${item.cor}`].filter(Boolean).join(' · ')} × {item.quantidade}
                    </div>
                  </div>
                  <div style={{ fontWeight: 500 }}>{fmt(item.preco * item.quantidade)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 500, fontSize: 16 }}>
                <span>Total</span><span>{fmt(total)}</span>
              </div>
              <div className="action-row" style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <button className="btn-s" onClick={() => setStep(1)}>← Voltar</button>
                <button className="btn-p" onClick={handleConfirm}>Confirmar Pedido →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 64, height: 64, border: '2px solid var(--ok)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28, color: 'var(--ok)' }}>✓</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300, marginBottom: 14 }}>Pedido Confirmado!</h2>
              <p style={{ color: 'var(--mid)', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
                Pedido #{orderId} recebido com sucesso.<br />Você receberá atualizações em breve.
              </p>
              <button className="btn-p" onClick={() => navigate('/conta')}>Ver Meus Pedidos</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="checkout-summary" style={{ padding: '48px 40px', background: 'var(--cream)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 300, marginBottom: 20 }}>Resumo</div>
          {cart.map(item => (
            <div key={item.estoqueId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15 }}>{item.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--mid)' }}>
                  {[item.tamanho && `Tam:${item.tamanho}`, item.cor && `Cor:${item.cor}`].filter(Boolean).join(' · ')} × {item.quantidade}
                </div>
              </div>
              <div style={{ fontWeight: 500 }}>{fmt(item.preco * item.quantidade)}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 0', fontSize: 18, fontWeight: 500, borderTop: '2px solid var(--border)', marginTop: 8 }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddrForm({ addr, setAddr }) {
  const fields = [
    { key: 'logradouro', label: 'Logradouro', placeholder: 'Rua, Av...', col: 2 },
    { key: 'numero', label: 'Número', placeholder: '123', col: 1 },
    { key: 'complemento', label: 'Complemento', placeholder: 'Apto, Bloco... (opcional)', col: 2 },
    { key: 'cidade', label: 'Cidade', placeholder: 'Fortaleza', col: 1 },
    { key: 'estado', label: 'Estado', placeholder: 'CE', col: 1 },
    { key: 'cep', label: 'CEP', placeholder: '00000-000', col: 1 },
  ]
  return (
    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {fields.map(f => (
        <div key={f.key} style={{ gridColumn: f.col === 2 ? '1 / -1' : 'auto' }}>
          <label className="fl">{f.label}</label>
          <input className="fi" placeholder={f.placeholder} value={addr[f.key]} onChange={e => setAddr(prev => ({ ...prev, [f.key]: e.target.value }))} />
        </div>
      ))}
    </div>
  )
}
