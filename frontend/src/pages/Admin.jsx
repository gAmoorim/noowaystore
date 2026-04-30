import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '../context/AppContext'
import * as api from '../services/api'

// ===== ADMIN STYLES (dark theme) =====
const S = {
  layout: { display: 'flex', minHeight: '100vh', background: 'var(--a-bg)', color: 'var(--a-text)', fontFamily: "'DM Sans', sans-serif" },
  sidebar: { width: 220, background: 'var(--a-surface)', borderRight: '1px solid var(--a-border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 },
  main: { marginLeft: 220, flex: 1 },
  topbar: { height: 56, borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'var(--a-surface)', position: 'sticky', top: 0, zIndex: 50 },
  page: { padding: 32 },
  card: { background: 'var(--a-surface)', border: '1px solid var(--a-border)', marginBottom: 24 },
  cardHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--a-border)' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--a-muted)', borderBottom: '1px solid var(--a-border)', fontWeight: 400 },
  td: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--a-border)', verticalAlign: 'middle', color: 'var(--a-text)' },
  fi: { padding: '9px 13px', background: 'var(--a-surface2)', border: '1px solid var(--a-border)', color: 'var(--a-text)', fontFamily: "'DM Sans',sans-serif", fontSize: 13, width: '100%' },
  fl: { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--a-muted)', display: 'block', marginBottom: 6 },
}

function ABtnP({ onClick, children, style = {} }) {
  return <button onClick={onClick} style={{ background: '#C4633E', color: '#fff', border: 'none', padding: '8px 18px', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", ...style }}>{children}</button>
}
function ABtnO({ onClick, children, style = {}, danger = false }) {
  return <button onClick={onClick} style={{ background: 'none', color: danger ? '#C0392B' : 'var(--a-muted)', border: `1px solid ${danger ? '#C0392B' : 'var(--a-border)'}`, padding: '6px 14px', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s', ...style }}>{children}</button>
}

function StatusBadge({ status }) {
  const colors = { pendente: '#D4A940', aprovado: '#3A9D6E', enviado: '#3498DB', entregue: '#3A9D6E', cancelado: '#C0392B' }
  const c = colors[status] || '#888'
  return <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 10px', border: `1px solid ${c}`, color: c }}>{status || '—'}</span>
}

function AModal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', padding: '36px 40px', width, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--a-muted)' }}>×</button>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, marginBottom: 24, color: 'var(--a-text)' }}>{title}</div>
        {children}
      </div>
    </div>
  )
}

function ASpinner() {
  return <div style={{ textAlign: 'center', padding: 60 }}><div style={{ width: 20, height: 20, border: '2px solid var(--a-border)', borderTopColor: '#C4633E', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} /></div>
}

// ===== MAIN ADMIN =====
export default function Admin() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')

  useEffect(() => {
    if (!user || user.tipo !== 'admin') navigate('/login')
  }, [user])

  if (!user || user.tipo !== 'admin') return null

  const tabs = [
    { key: 'dashboard', icon: '◈', label: 'Dashboard', section: 'Principal' },
    { key: 'pedidos', icon: '◎', label: 'Pedidos', section: 'Principal' },
    { key: 'produtos', icon: '▣', label: 'Produtos', section: 'Catálogo' },
    { key: 'categorias', icon: '⊞', label: 'Categorias', section: 'Catálogo' },
    { key: 'estoque', icon: '⊟', label: 'Estoque', section: 'Catálogo' },
    { key: 'usuarios', icon: '◉', label: 'Usuários', section: 'Clientes' },
  ]

  const sections = [...new Set(tabs.map(t => t.section))]

  return (
    <div style={S.layout}>
      <style>{'body{background:var(--a-bg)!important}'}</style>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--a-border)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--a-text)', marginBottom: 6 }}>Noo Way Store</div>
          <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4633E', background: 'rgba(196,99,62,.12)', padding: '2px 8px' }}>Admin</span>
        </div>
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--a-muted)', padding: '12px 24px 6px' }}>{sec}</div>
              {tabs.filter(t => t.section === sec).map(t => (
                <div key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', fontSize: 13, color: tab === t.key ? 'var(--a-text)' : 'var(--a-muted)', cursor: 'pointer', transition: 'all .2s', background: tab === t.key ? 'rgba(255,255,255,.06)' : 'none', borderLeft: `2px solid ${tab === t.key ? '#C4633E' : 'transparent'}` }}>
                  <span>{t.icon}</span>{t.label}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--a-border)' }}>
          <div style={{ fontSize: 13, color: 'var(--a-text)', fontWeight: 500, marginBottom: 6 }}>{user.nome}</div>
          <button onClick={() => { logout(); navigate('/') }} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--a-muted)', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans',sans-serif" }}>Sair →</button>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>
        <div style={S.topbar}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: 'var(--a-text)' }}>
            {tabs.find(t => t.key === tab)?.label || 'Admin'}
          </div>
          <a href="/" target="_blank" style={{ background: 'none', border: '1px solid var(--a-border)', padding: '6px 14px', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--a-muted)', textDecoration: 'none', transition: 'all .2s' }}>Ver Loja →</a>
        </div>
        <div style={S.page}>
          {tab === 'dashboard' && <Dashboard toast={toast} />}
          {tab === 'produtos' && <Produtos toast={toast} />}
          {tab === 'categorias' && <Categorias toast={toast} />}
          {tab === 'estoque' && <Estoque toast={toast} />}
          {tab === 'pedidos' && <Pedidos toast={toast} />}
          {tab === 'usuarios' && <Usuarios toast={toast} />}
        </div>
      </main>
    </div>
  )
}

// ===== DASHBOARD =====
function Dashboard({ toast }) {
  const [stats, setStats] = useState({ pedidos: 0, entregues: 0, produtos: 0, usuarios: 0 })
  const [orders, setOrders] = useState([])
  const [statusCounts, setStatusCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  useEffect(() => {
    Promise.all([api.getPedidos(), api.getProdutos(), api.getUsers().catch(() => [])]).then(([ords, prods, users]) => {
      const ol = Array.isArray(ords) ? ords : (ords.pedidos || [])
      const pl = Array.isArray(prods) ? prods : (prods.produtos || [])
      const ul = Array.isArray(users) ? users : []
      setOrders(ol.slice().reverse().slice(0, 8))
      setStats({ pedidos: ol.length, entregues: ol.filter(o => o.status === 'entregue').length, produtos: pl.length, usuarios: ul.length })
      const sc = {}
      ol.forEach(o => { sc[o.status] = (sc[o.status] || 0) + 1 })
      setStatusCounts(sc)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <ASpinner />

  const statCards = [
    { label: 'Total de Pedidos', val: stats.pedidos, color: '#C4633E' },
    { label: 'Entregues', val: stats.entregues, color: '#3A9D6E' },
    { label: 'Produtos', val: stats.produtos, color: '#D4A940' },
    { label: 'Clientes', val: stats.usuarios, color: '#3498DB' },
  ]

  const statuses = ['pendente', 'aprovado', 'enviado', 'entregue', 'cancelado']
  const maxCount = Math.max(...Object.values(statusCounts), 1)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderLeft: `3px solid ${s.color}`, padding: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--a-muted)', marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: 'var(--a-text)' }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={S.card}>
          <div style={S.cardHead}><span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Pedidos por Status</span></div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {statuses.map(s => {
                const count = statusCounts[s] || 0
                const colors = { pendente: '#D4A940', aprovado: '#3A9D6E', enviado: '#3498DB', entregue: '#3A9D6E', cancelado: '#C0392B' }
                return (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--a-muted)' }}>{count}</div>
                    <div style={{ width: '100%', height: Math.max((count / maxCount) * 90, 4), background: colors[s], borderRadius: '2px 2px 0 0', transition: 'height .4s' }} />
                    <div style={{ fontSize: 9, color: 'var(--a-muted)', letterSpacing: '.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardHead}><span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Ações Rápidas</span></div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Novo Produto', 'Nova Categoria', 'Gerenciar Estoque', 'Ver Pedidos'].map(l => (
              <ABtnO key={l} style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}>{l}</ABtnO>
            ))}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHead}><span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Últimos Pedidos</span></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={S.th}>Pedido</th><th style={S.th}>Data</th><th style={S.th}>Status</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--a-border)' }}>
                <td style={S.td}>#{o.id}</td>
                <td style={{ ...S.td, color: 'var(--a-muted)' }}>{new Date(o.criado_em).toLocaleDateString('pt-BR')}</td>
                <td style={S.td}><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ===== PRODUTOS ADMIN =====
function Produtos({ toast }) {
  const [prods, setProds] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [imgModal, setImgModal] = useState(null)
  const [form, setForm] = useState({ nome: '', preco: '', descricao: '', categoria_id: '' })
  const [search, setSearch] = useState('')
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  const load = () => Promise.all([api.getProdutos(), api.getCategorias()]).then(([p, c]) => {
    setProds(Array.isArray(p) ? p : (p.produtos || []))
    setCats(Array.isArray(c) ? c : [])
    setLoading(false)
  }).catch(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm({ nome: '', preco: '', descricao: '', categoria_id: '' }); setModal(true) }
  const openEdit = p => { setEditing(p); setForm({ nome: p.nome, preco: p.preco, descricao: p.descricao || '', categoria_id: p.categoria_id || '' }); setModal(true) }

  const save = async () => {
    if (!form.nome || !form.preco) { toast('Nome e preço obrigatórios', 'e'); return }
    try {
      const body = { ...form, preco: parseFloat(form.preco), categoria_id: form.categoria_id || null }
      if (editing) await api.updateProduto(editing.id, body)
      else await api.createProduto(body)
      setModal(false); toast('Produto salvo!', 's'); load()
    } catch(e) { toast(e.message, 'e') }
  }

  const del = async id => {
    if (!confirm('Excluir produto?')) return
    try { await api.deleteProduto(id); toast('Excluído.', 'i'); load() } catch(e) { toast(e.message, 'e') }
  }

  const filtered = prods.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Produtos</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ ...S.fi, width: 200 }} />
            <ABtnP onClick={openNew}>+ Novo</ABtnP>
          </div>
        </div>
        {loading ? <ASpinner /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={S.th}>Nome</th><th style={S.th}>Categoria</th><th style={S.th}>Preço</th><th style={S.th}>Promoção</th><th style={S.th}>Ações</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ ...S.td, fontWeight: 500 }}>{p.nome}</td>
                  <td style={{ ...S.td, color: 'var(--a-muted)' }}>{p.categoria_nome || '—'}</td>
                  <td style={S.td}>{fmt(p.preco)}</td>
                  <td style={S.td}>{p.preco_promocional ? <span style={{ color: '#C4633E' }}>{fmt(p.preco_promocional)}</span> : <span style={{ color: 'var(--a-muted)' }}>—</span>}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ABtnO onClick={() => openEdit(p)}>Editar</ABtnO>
                      <ABtnO onClick={() => setImgModal(p)}>Imagens</ABtnO>
                      <ABtnO onClick={() => del(p.id)} danger>✕</ABtnO>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AModal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Produto' : 'Novo Produto'}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><label style={S.fl}>Nome *</label><input style={S.fi} value={form.nome} onChange={set('nome')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={S.fl}>Preço *</label><input style={S.fi} type="number" step="0.01" value={form.preco} onChange={set('preco')} /></div>
            <div><label style={S.fl}>Categoria</label>
              <select style={S.fi} value={form.categoria_id} onChange={set('categoria_id')}>
                <option value="">Sem categoria</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          <div><label style={S.fl}>Descrição</label><textarea style={{ ...S.fi, minHeight: 80, resize: 'vertical' }} value={form.descricao} onChange={set('descricao')} /></div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--a-border)' }}>
          <ABtnO onClick={() => setModal(false)}>Cancelar</ABtnO>
          <ABtnP onClick={save}>Salvar Produto</ABtnP>
        </div>
      </AModal>

      {imgModal && <ImagensModal prod={imgModal} onClose={() => setImgModal(null)} toast={toast} />}
    </div>
  )
}

function ImagensModal({ prod, onClose, toast }) {
  const [imgs, setImgs] = useState([])
  const [url, setUrl] = useState('')
  const [principal, setPrincipal] = useState(false)
  const load = () => api.getImagensProduto(prod.id).then(d => setImgs(Array.isArray(d) ? d : [])).catch(() => {})
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!url) { toast('URL obrigatória', 'e'); return }
    try { await api.addImagemProduto(prod.id, { url, img_principal: principal }); setUrl(''); setPrincipal(false); toast('Imagem adicionada!', 's'); load() }
    catch(e) { toast(e.message, 'e') }
  }
  const del = async id => {
    try { await api.deleteImagemProduto(id); toast('Excluída.', 'i'); load() } catch(e) { toast(e.message, 'e') }
  }

  return (
    <AModal open onClose={onClose} title={`Imagens — ${prod.nome}`} width={500}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {imgs.map(img => (
          <div key={img.id} style={{ background: 'var(--a-surface2)', border: '1px solid var(--a-border)', padding: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 64, height: 46, overflow: 'hidden', flexShrink: 0 }}><img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div style={{ flex: 1 }}>
              {img.img_principal && <div style={{ fontSize: 10, color: '#D4A940', marginBottom: 4 }}>⭐ Principal</div>}
              <div style={{ fontSize: 10, color: 'var(--a-muted)', wordBreak: 'break-all' }}>{img.url.substring(0, 30)}...</div>
            </div>
            <ABtnO onClick={() => del(img.id)} danger style={{ padding: '4px 8px' }}>✕</ABtnO>
          </div>
        ))}
        {!imgs.length && <div style={{ gridColumn: '1/-1', color: 'var(--a-muted)', fontSize: 13 }}>Nenhuma imagem cadastrada.</div>}
      </div>
      <div style={{ borderTop: '1px solid var(--a-border)', paddingTop: 16 }}>
        <label style={S.fl}>URL da Imagem</label>
        <input style={{ ...S.fi, marginBottom: 10 }} placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--a-muted)', marginBottom: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={principal} onChange={e => setPrincipal(e.target.checked)} /> Imagem principal
        </label>
        <ABtnP onClick={add}>Adicionar Imagem</ABtnP>
      </div>
    </AModal>
  )
}

// ===== CATEGORIAS ADMIN =====
function Categorias({ toast }) {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [nome, setNome] = useState('')
  const load = () => api.getCategorias().then(d => { setCats(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setNome(''); setModal(true) }
  const openEdit = c => { setEditing(c); setNome(c.nome); setModal(true) }
  const save = async () => {
    if (!nome.trim()) { toast('Nome obrigatório', 'e'); return }
    try {
      if (editing) await api.updateCategoria(editing.id, { nome })
      else await api.createCategoria({ nome })
      setModal(false); toast('Categoria salva!', 's'); load()
    } catch(e) { toast(e.message, 'e') }
  }
  const del = async id => {
    if (!confirm('Excluir?')) return
    try { await api.deleteCategoria(id); toast('Excluída.', 'i'); load() } catch(e) { toast(e.message, 'e') }
  }

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Categorias</span>
          <ABtnP onClick={openNew}>+ Nova</ABtnP>
        </div>
        {loading ? <ASpinner /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={S.th}>ID</th><th style={S.th}>Nome</th><th style={S.th}>Ações</th></tr></thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td style={{ ...S.td, color: 'var(--a-muted)' }}>#{c.id}</td>
                  <td style={{ ...S.td, fontWeight: 500 }}>{c.nome}</td>
                  <td style={S.td}><div style={{ display: 'flex', gap: 6 }}><ABtnO onClick={() => openEdit(c)}>Editar</ABtnO><ABtnO onClick={() => del(c.id)} danger>✕</ABtnO></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AModal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Categoria' : 'Nova Categoria'} width={400}>
        <div><label style={S.fl}>Nome *</label><input style={S.fi} value={nome} onChange={e => setNome(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <ABtnO onClick={() => setModal(false)}>Cancelar</ABtnO>
          <ABtnP onClick={save}>Salvar</ABtnP>
        </div>
      </AModal>
    </div>
  )
}

// ===== ESTOQUE ADMIN =====
function Estoque({ toast }) {
  const [est, setEst] = useState([])
  const [prods, setProds] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ produto_id: '', tamanho: '', cor: '', quantidade: 0 })
  const [search, setSearch] = useState('')
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const fmt = v => Number(v)

  const load = () => Promise.all([api.getEstoque(), api.getProdutos()]).then(([e, p]) => {
    setEst(Array.isArray(e) ? e : [])
    setProds(Array.isArray(p) ? p : (p.produtos || []))
    setLoading(false)
  }).catch(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm({ produto_id: '', tamanho: '', cor: '', quantidade: 0 }); setModal(true) }
  const openEdit = e => { setEditing(e); setForm({ produto_id: e.produto_id, tamanho: e.tamanho || '', cor: e.cor || '', quantidade: e.quantidade }); setModal(true) }

  const save = async () => {
    try {
      const body = { ...form, quantidade: parseInt(form.quantidade) }
      if (editing) await api.updateEstoque(editing.id, body)
      else await api.createEstoque({ ...body, produto_id: parseInt(body.produto_id) })
      setModal(false); toast('Estoque salvo!', 's'); load()
    } catch(e) { toast(e.message, 'e') }
  }

  const filtered = est.filter(e => {
    const p = prods.find(p => p.id === e.produto_id)
    return (p?.nome || '').toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Estoque</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..." style={{ ...S.fi, width: 200 }} />
            <ABtnP onClick={openNew}>+ Adicionar</ABtnP>
          </div>
        </div>
        {loading ? <ASpinner /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={S.th}>Produto</th><th style={S.th}>Tamanho</th><th style={S.th}>Cor</th><th style={S.th}>Qtd</th><th style={S.th}>Nível</th><th style={S.th}>Ações</th></tr></thead>
            <tbody>
              {filtered.map(e => {
                const prod = prods.find(p => p.id === e.produto_id)
                const pct = Math.min((e.quantidade / 50) * 100, 100)
                const clr = e.quantidade <= 0 ? '#C0392B' : e.quantidade <= 5 ? '#D4A940' : '#3A9D6E'
                return (
                  <tr key={e.id}>
                    <td style={{ ...S.td, fontWeight: 500 }}>{prod?.nome || `#${e.produto_id}`}</td>
                    <td style={{ ...S.td, color: 'var(--a-muted)' }}>{e.tamanho || '—'}</td>
                    <td style={{ ...S.td, color: 'var(--a-muted)' }}>{e.cor || '—'}</td>
                    <td style={S.td}><strong style={{ color: clr }}>{e.quantidade}</strong></td>
                    <td style={S.td}><div style={{ width: 80, height: 6, background: 'var(--a-border)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: clr, borderRadius: 3 }} /></div></td>
                    <td style={S.td}><ABtnO onClick={() => openEdit(e)}>Editar</ABtnO></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      <AModal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Estoque' : 'Novo Estoque'}>
        <div style={{ display: 'grid', gap: 14 }}>
          {!editing && <div><label style={S.fl}>Produto *</label>
            <select style={S.fi} value={form.produto_id} onChange={set('produto_id')}>
              <option value="">Selecione...</option>
              {prods.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={S.fl}>Tamanho</label><input style={S.fi} placeholder="36, 37..." value={form.tamanho} onChange={set('tamanho')} /></div>
            <div><label style={S.fl}>Cor</label><input style={S.fi} placeholder="Preto, Branco..." value={form.cor} onChange={set('cor')} /></div>
          </div>
          <div><label style={S.fl}>Quantidade *</label><input style={S.fi} type="number" min="0" value={form.quantidade} onChange={set('quantidade')} /></div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <ABtnO onClick={() => setModal(false)}>Cancelar</ABtnO>
          <ABtnP onClick={save}>Salvar</ABtnP>
        </div>
      </AModal>
    </div>
  )
}

// ===== PEDIDOS ADMIN =====
function Pedidos({ toast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [itemsModal, setItemsModal] = useState(null)
  const [items, setItems] = useState([])
  const fmt = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

  const load = () => api.getPedidos().then(d => { setOrders((Array.isArray(d) ? d : (d.pedidos || [])).reverse()); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { load() }, [])

  const updStatus = async (id, status) => {
    try { await api.updatePedidoStatus(id, status); toast(`Status: ${status}`, 's'); setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)) }
    catch(e) { toast(e.message, 'e') }
  }

  const openItems = async (id) => {
    setItemsModal(id); setItems([])
    try { const d = await api.getItensPedido(id); setItems(Array.isArray(d) ? d : (d.itens || [])) }
    catch(e) { toast('Erro ao carregar itens', 'e') }
  }

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Pedidos</span>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...S.fi, width: 'auto', padding: '6px 12px' }}>
            <option value="">Todos</option>
            {['pendente','aprovado','enviado','entregue','cancelado'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
        {loading ? <ASpinner /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={S.th}>Pedido</th><th style={S.th}>Data</th><th style={S.th}>Status</th><th style={S.th}>Ações</th></tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ ...S.td, fontWeight: 500 }}>#{o.id}</td>
                  <td style={{ ...S.td, color: 'var(--a-muted)' }}>{new Date(o.criado_em).toLocaleDateString('pt-BR')}</td>
                  <td style={S.td}><StatusBadge status={o.status} /></td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select value={o.status} onChange={e => updStatus(o.id, e.target.value)} style={{ ...S.fi, width: 'auto', padding: '4px 10px', fontSize: 12 }}>
                        {['pendente','aprovado','enviado','entregue','cancelado'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                      <ABtnO onClick={() => openItems(o.id)}>Itens</ABtnO>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AModal open={!!itemsModal} onClose={() => setItemsModal(null)} title={`Pedido #${itemsModal}`} width={460}>
        {!items.length ? <ASpinner /> : (
          <>
            {items.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--a-border)', fontSize: 13, color: 'var(--a-text)' }}>
                <span>{i.produto_nome || `Item #${i.id}`} × {i.quantidade}</span>
                <span>{fmt(i.preco_unitario * i.quantidade)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontWeight: 500, color: 'var(--a-text)' }}>
              <span>Total</span><span>{fmt(items.reduce((s,i) => s + i.preco_unitario * i.quantidade, 0))}</span>
            </div>
          </>
        )}
      </AModal>
    </div>
  )
}

// ===== USUÁRIOS ADMIN =====
function Usuarios({ toast }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const load = () => api.getUsers().then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { load() }, [])
  const del = async id => {
    if (!confirm('Excluir usuário?')) return
    try { await api.deleteUser(id); toast('Excluído.', 'i'); load() } catch(e) { toast(e.message, 'e') }
  }
  const filtered = users.filter(u => u.nome?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--a-text)' }}>Usuários</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ ...S.fi, width: 220 }} />
        </div>
        {loading ? <ASpinner /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={S.th}>Nome</th><th style={S.th}>E-mail</th><th style={S.th}>Tipo</th><th style={S.th}>Cadastro</th><th style={S.th}>Ação</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ ...S.td, fontWeight: 500 }}>{u.nome}</td>
                  <td style={{ ...S.td, color: 'var(--a-muted)' }}>{u.email}</td>
                  <td style={S.td}><span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 10px', border: `1px solid ${u.tipo === 'admin' ? '#D4A940' : '#888'}`, color: u.tipo === 'admin' ? '#D4A940' : '#888' }}>{u.tipo}</span></td>
                  <td style={{ ...S.td, color: 'var(--a-muted)' }}>{new Date(u.criado_em).toLocaleDateString('pt-BR')}</td>
                  <td style={S.td}><ABtnO onClick={() => del(u.id)} danger>Excluir</ABtnO></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
