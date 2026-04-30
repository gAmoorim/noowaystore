import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const http = axios.create({ baseURL: BASE })

http.interceptors.request.use(cfg => {
  const token = localStorage.getItem('nws_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

http.interceptors.response.use(
  r => r.data,
  err => Promise.reject(new Error(err.response?.data?.error || err.response?.data?.message || 'Erro na requisição'))
)

// AUTH
export const login = body => http.post('/login', body)
export const register = body => http.post('/usuarios', body)

// USERS
export const getUsers = () => http.get('/usuarios')
export const getUser = id => http.get(`/usuarios/${id}`)
export const updateUser = body => http.put('/usuarios', body)
export const deleteUser = id => http.delete(`/usuarios/${id}`)

// CATEGORIES
export const getCategorias = () => http.get('/categorias')
export const createCategoria = body => http.post('/categorias', body)
export const updateCategoria = (id, body) => http.put(`/categorias/${id}`, body)
export const deleteCategoria = id => http.delete(`/categorias/${id}`)

// PRODUCTS
export const getProdutos = () => http.get('/produtos')
export const getProduto = id => http.get(`/produtos/${id}`)
export const createProduto = body => http.post('/produtos', body)
export const updateProduto = (id, body) => http.put(`/produtos/${id}`, body)
export const deleteProduto = id => http.delete(`/produtos/${id}`)

// STOCK
export const getEstoque = () => http.get('/estoque')
export const createEstoque = body => http.post('/estoque', body)
export const updateEstoque = (id, body) => http.put(`/estoque/${id}`, body)

// ORDERS
export const getPedidos = () => http.get('/pedidos')
export const getMeusPedidos = () => http.get('/pedidos/minha-conta')
export const createPedido = body => http.post('/pedidos', body)
export const updatePedidoStatus = (id, status) => http.patch(`/pedidos/${id}/status`, { status })
export const getItensPedido = id => http.get(`/pedidos/${id}/itens`)

// ADDRESSES
export const getEnderecos = () => http.get('/enderecos')
export const createEndereco = body => http.post('/enderecos', body)
export const updateEndereco = (id, body) => http.put(`/enderecos/${id}`, body)
export const deleteEndereco = id => http.delete(`/endereco/${id}`)

// IMAGES
export const getImagensProduto = id => http.get(`/produtos/${id}/imagens`)
export const addImagemProduto = (id, body) => http.post(`/produtos/${id}/imagens`, body)
export const deleteImagemProduto = id => http.delete(`/produtos/imagens/${id}`)
