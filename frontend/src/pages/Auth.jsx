import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'
import { useAuth, useToast } from '../context/AppContext'

function AuthLayout({ visual, children }) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ flex: 1, background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 60, fontWeight: 300, color: 'rgba(255,255,255,.12)', letterSpacing: '.05em', lineHeight: 1.1, fontStyle: 'italic', textAlign: 'center' }}>{visual}</div>
      </div>
      <div style={{ width: 480, display: 'flex', alignItems: 'center', padding: '60px 56px', borderLeft: '1px solid var(--border)' }}>
        <div style={{ width: '100%' }}>{children}</div>
      </div>
    </div>
  )
}

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !senha) { toast('Preencha e-mail e senha', 'e'); return }
    setLoading(true)
    try {
      const r = await login({ email, senha })
      setAuth(r.token, r.usuario || { email })
      toast('Bem-vindo(a)!', 's')
      navigate(r.usuario?.tipo === 'admin' ? '/admin' : '/')
    } catch(e) { toast(e.message, 'e') }
    finally { setLoading(false) }
  }

  return (
    <AuthLayout visual={<>Bem-vindo<br />de volta,<br />fashionista.</>}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 300, marginBottom: 8 }}>Entrar</h1>
      <p style={{ fontSize: 14, color: 'var(--mid)', marginBottom: 40 }}>Acesse sua conta Noo Way Store</p>
      <div className="fg">
        <label className="fl">E-mail</label>
        <input className="fi" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
      </div>
      <div className="fg">
        <label className="fl">Senha</label>
        <input className="fi" type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
      </div>
      <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading} onClick={handleSubmit}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--mid)' }}>
        Não tem conta?{' '}
        <span style={{ color: 'var(--char)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/cadastro')}>Cadastre-se</span>
      </div>
    </AuthLayout>
  )
}

export function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.senha) { toast('Preencha todos os campos obrigatórios', 'e'); return }
    setLoading(true)
    try {
      await register(form)
      toast('Conta criada! Faça login.', 's')
      navigate('/login')
    } catch(e) { toast(e.message, 'e') }
    finally { setLoading(false) }
  }

  return (
    <AuthLayout visual={<>Sua jornada<br />começa<br />agora.</>}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 300, marginBottom: 8 }}>Criar Conta</h1>
      <p style={{ fontSize: 14, color: 'var(--mid)', marginBottom: 40 }}>Junte-se à comunidade Noo Way Store</p>
      <div className="fg">
        <label className="fl">Nome completo *</label>
        <input className="fi" placeholder="Seu nome" value={form.nome} onChange={set('nome')} />
      </div>
      <div className="fg">
        <label className="fl">E-mail *</label>
        <input className="fi" type="email" placeholder="seu@email.com" value={form.email} onChange={set('email')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="fg">
          <label className="fl">Telefone</label>
          <input className="fi" placeholder="(85) 9 0000-0000" value={form.telefone} onChange={set('telefone')} />
        </div>
        <div className="fg">
          <label className="fl">Senha *</label>
          <input className="fi" type="password" placeholder="••••••••" value={form.senha} onChange={set('senha')} />
        </div>
      </div>
      <button className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading} onClick={handleSubmit}>
        {loading ? 'Criando...' : 'Criar Conta'}
      </button>
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--mid)' }}>
        Já tem conta?{' '}
        <span style={{ color: 'var(--char)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>Entrar</span>
      </div>
    </AuthLayout>
  )
}
