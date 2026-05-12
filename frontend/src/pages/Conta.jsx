import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, useToast } from '../context/AppContext'
import { updateUser, getMeusPedidos, getItensPedido, getEnderecos, createEndereco, updateEndereco, deleteEndereco } from '../services/api'
import { Modal } from '../components/Shared'

export default function Conta() {
  const { user, setAuth, token, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'perfil')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  if (!user) return null

  return (
    <div className="account-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 68px)' }}>
      {/* Sidebar */}
      <div className="account-sidebar" style={{ borderRight: '1px solid var(--border)', padding: '48px 32px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>{user.nome}</div>
        <div style={{ fontSize: 12, color: 'var(--mid)', marginBottom: 40 }}>{user.email}</div>
        <ul style={{ listStyle: 'none' }}>
          {[['perfil', 'Meu Perfil'], ['pedidos', 'Meus Pedidos'], ['enderecos', 'Endereços']].map(([key, label]) => (
            <li key={key} style={{ borderBottom: '1px solid var(--border)' }}>
              <div onClick={() => setTab(key)} style={{ display: 'block', padding: '12px 0', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: tab === key ? 'var(--black)' : 'var(--mid)', cursor: 'pointer', transition: 'color .2s' }}>{label}</div>
            </li>
          ))}
          <li style={{ borderBottom: '1px solid var(--border)' }}>
            <div onClick={() => { logout(); navigate('/') }} style={{ display: 'block', padding: '12px 0', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--danger)', cursor: 'pointer' }}>Sair</div>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="account-content" style={{ padding: '48px 60px' }}>
        {tab === 'perfil' && <Perfil user={user} setAuth={setAuth} token={token} toast={toast} />}
        {tab === 'pedidos' && <Pedidos toast={toast} />}
        {tab === 'enderecos' && <Enderecos toast={toast} />}
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300, marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>{children}</h2>
}

function Perfil({ user, setAuth, token, toast }) {
  const [form, setForm] = useState({ nome: user?.nome || '', email: user?.email || '', telefone: user?.telefone || '', senha: '' })
  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const save = async () => {
    const body = { nome: form.nome, email: form.email, telefone: form.telefone }
    if (form.senha) body.senha = form.senha
    try {
      await updateUser(body)
      setAuth(token, { ...user, ...body })
      toast('Perfil atualizado!', 's')
    } catch(e) { toast(e.message, 'e') }
  }

  return (
    <div>
      <SectionTitle>Meu Perfil</SectionTitle>
      <div style={{ maxWidth: 420 }}>
        <div className="fg"><label className="fl">Nome</label><input className="fi" value={form.nome} onChange={set('nome')} /></div>
        <div className="fg"><label className="fl">E-mail</label><input className="fi" type="email" value={form.email} onChange={set('email')} /></div>
        <div className="fg"><label className="fl">Telefone</label><input className="fi" value={form.telefone} onChange={set('telefone')} /></div>
        <div className="fg"><label className="fl">Nova Senha (deixe em branco para não alterar)</label><input className="fi" type="password" placeholder="••••••••" value={form.senha} onChange={set('senha')} /></div>
        <button className="btn-p" onClick={save}>Salvar Alterações</button>
      </div>
    </div>
  )
}

function Pedidos({ toast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selOrder, setSelOrder] = useState(null)
  const [items, setItems] = useState([])
  const [orderDetail, setOrderDetail] = useState(null)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
  const formatEndereco = o => {
    if (!o?.logradouro) return 'Endereço não informado'
    return `${o.logradouro}, ${o.numero || 's/n'}${o.complemento ? ` - ${o.complemento}` : ''} · ${o.cidade || ''}${o.estado ? `/${o.estado}` : ''}${o.cep ? ` · CEP ${o.cep}` : ''}`
  }

  useEffect(() => {
    getMeusPedidos().then(data => {
      setOrders(Array.isArray(data) ? data : (data.pedidos || []))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const openOrder = async (id) => {
    setSelOrder(id)
    setItems([])
    setOrderDetail(null)
    setItemsLoading(true)
    setModalOpen(true)
    try {
      const data = await getItensPedido(id)
      setItems(Array.isArray(data) ? data : (data.itens || []))
      setOrderDetail(Array.isArray(data) ? orders.find(o => o.id === id) : (data.pedido || orders.find(o => o.id === id)))
    } catch(e) { toast('Erro ao carregar itens', 'e') }
    finally { setItemsLoading(false) }
  }

  const statusColor = s => ({ pendente: 'var(--gold)', aprovado: 'var(--ok)', enviado: 'var(--info)', entregue: 'var(--ok)', cancelado: 'var(--danger)' }[s] || 'var(--mid)')

  if (loading) return <div className="spin-wrap"><div className="spinner" /></div>

  return (
    <div>
      <SectionTitle>Meus Pedidos</SectionTitle>
      {!orders.length ? (
        <p style={{ color: 'var(--mid)' }}>Você ainda não fez nenhum pedido.</p>
      ) : orders.slice().reverse().map(o => (
        <div key={o.id} style={{ border: '1px solid var(--border)', padding: 24, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 500 }}>Pedido #{o.id}</div>
              <div style={{ fontSize: 12, color: 'var(--mid)' }}>{new Date(o.criado_em).toLocaleDateString('pt-BR')}</div>
              <div style={{ fontSize: 12, color: 'var(--mid)' }}>{fmt(o.total || 0)} · {o.quantidade_itens || 0} item(ns)</div>
            </div>
            <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 12px', border: `1px solid ${statusColor(o.status)}`, color: statusColor(o.status) }}>{o.status}</span>
          </div>
          <button onClick={() => openOrder(o.id)} style={{ background: 'none', border: '1px solid var(--border)', padding: '7px 16px', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--mid)', transition: 'all .2s' }} onMouseEnter={e => { e.target.style.borderColor = 'var(--char)'; e.target.style.color = 'var(--char)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--mid)' }}>Ver Itens</button>
        </div>
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Pedido #${selOrder}`}>
        {itemsLoading ? <div className="spin-wrap"><div className="spinner" /></div> : (
          <>
            {orderDetail && (
              <div style={{ paddingBottom: 16, marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 6 }}>Endereço de entrega</div>
                <div style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.6 }}>{formatEndereco(orderDetail)}</div>
              </div>
            )}
            {items.map(i => (
              <div key={i.id} style={{ display: 'grid', gridTemplateColumns: '58px 1fr auto', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                {i.imagem ? <img src={i.imagem} alt={i.produto_nome} style={{ width: 58, height: 58, objectFit: 'cover', background: 'var(--soft)' }} /> : <div style={{ width: 58, height: 58, background: 'var(--soft)', border: '1px solid var(--border)' }} />}
                <span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, display: 'block' }}>{i.produto_nome || `Item #${i.id}`}</span>
                  <span style={{ color: 'var(--mid)', fontSize: 12 }}>Qtd. {i.quantidade}{i.tamanho ? ` · Tam. ${i.tamanho}` : ''}{i.cor ? ` · ${i.cor}` : ''}</span>
                </span>
                <span>{fmt(i.preco_unitario * i.quantidade)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontWeight: 500 }}>
              <span>Total</span>
              <span>{fmt(orderDetail?.total || items.reduce((s, i) => s + i.preco_unitario * i.quantidade, 0))}</span>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

function Enderecos({ toast }) {
  const [addrs, setAddrs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ logradouro: '', numero: '', complemento: '', cidade: '', estado: '', cep: '' })
  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const load = () => getEnderecos().then(d => { setAddrs(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { load() }, [])

  const emptyForm = { logradouro: '', numero: '', complemento: '', cidade: '', estado: '', cep: '' }

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = endereco => {
    setEditing(endereco)
    setForm({
      logradouro: endereco.logradouro || '',
      numero: endereco.numero || '',
      complemento: endereco.complemento || '',
      cidade: endereco.cidade || '',
      estado: endereco.estado || '',
      cep: endereco.cep || ''
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const save = async () => {
    try {
      if (editing) await updateEndereco(editing.id, form)
      else await createEndereco(form)
      toast(editing ? 'Endereço atualizado!' : 'Endereço salvo!', 's')
      closeModal()
      load()
    } catch(e) { toast(e.message, 'e') }
  }

  const del = async id => {
    if (!confirm('Excluir este endereço?')) return
    try { await deleteEndereco(id); toast('Excluído.', 'i'); load() }
    catch(e) { toast(e.message, 'e') }
  }

  if (loading) return <div className="spin-wrap"><div className="spinner" /></div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300 }}>Endereços</h2>
        <button className="btn-p" onClick={openNew}>+ Novo</button>
      </div>
      {!addrs.length ? <p style={{ color: 'var(--mid)' }}>Nenhum endereço cadastrado.</p> : (
        <div className="address-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {addrs.map(a => (
            <div key={a.id} style={{ border: '1px solid var(--border)', padding: 24 }}>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>{a.logradouro}, {a.numero}</div>
              <div style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.7 }}>
                {a.complemento && <>{a.complemento}<br /></>}
                {a.cidade} - {a.estado}<br />CEP: {a.cep}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => openEdit(a)} style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 14px', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--mid)', transition: 'all .2s' }} onMouseEnter={e => { e.target.style.borderColor = 'var(--char)'; e.target.style.color = 'var(--char)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--mid)' }}>Editar</button>
                <button onClick={() => del(a.id)} style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 14px', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--mid)', transition: 'all .2s' }} onMouseEnter={e => { e.target.style.borderColor = 'var(--danger)'; e.target.style.color = 'var(--danger)' }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--mid)' }}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar Endereço' : 'Novo Endereço'}>
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { k: 'logradouro', l: 'Logradouro', p: 'Rua, Av...', col: 2 },
            { k: 'numero', l: 'Número', p: '123', col: 1 },
            { k: 'complemento', l: 'Complemento', p: 'Apto... (opcional)', col: 2 },
            { k: 'cidade', l: 'Cidade', p: 'Fortaleza', col: 1 },
            { k: 'estado', l: 'Estado', p: 'CE', col: 1 },
            { k: 'cep', l: 'CEP', p: '00000-000', col: 1 },
          ].map(f => (
            <div key={f.k} style={{ gridColumn: f.col === 2 ? '1 / -1' : 'auto' }}>
              <label className="fl">{f.l}</label>
              <input className="fi" placeholder={f.p} value={form[f.k]} onChange={set(f.k)} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button className="btn-s" onClick={closeModal}>Cancelar</button>
          <button className="btn-p" onClick={save}>{editing ? 'Atualizar' : 'Salvar'}</button>
        </div>
      </Modal>
    </div>
  )
}
