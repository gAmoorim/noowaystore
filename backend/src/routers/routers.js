const express = require('express')
const { controllerCadastrarUsuario, controllerListarUsuarios, controllerObterUsuario, controllerAtualizarUsuario, controllerDeletarUsuario } = require('../controllers/controllerUsuarios')
const { controllerLoginUsuario } = require('../controllers/controllerLogin')
const { controllerCriarCategoria, controllerListarCategorias, controllerAtualizarCategoria, controllerDeletarCategoria } = require('../controllers/controllerCategorias')
const { controllerCadastrarProduto, controllerListarProdutos, controllerObterProduto, controllerAtualizarProduto, controllerDeletarProduto } = require('../controllers/controllerProdutos')
const { controllerCriarEstoque, controllerListarEstoque, controllerAtualizarEstoque } = require('../controllers/controllerEstoque')
const { controllerCriarPedido, controllerListarPedidosUsuario, controllerListarTodosPedidos, controllerAtualizarStatusPedido, controllerListarItensPedido } = require('../controllers/controllerPedidos')
const { controllerCadastrarEndereco, controllerListarEnderecos, controllerAtualizarEndereco, controllerDeletarEndereco } = require('../controllers/controllersEndereco')
const { controllerAdicionarImagemProduto, controllerListarImagensProdutos, controllerDeletarImagemProduto } = require('../controllers/controllerImagens')

const auth = require('../middlewares/auth')
const upload = require('../config/upload')
const { controllerCriarPromocao, controllerListarPromocoes, controllerAtualizarPromocao, controllerAtualizarStatusPromocao, controllerDeletarPromocao } = require('../controllers/controllerPromocoes')

const routers = express()

routers.post('/login', controllerLoginUsuario)

routers.post('/usuarios', controllerCadastrarUsuario)
routers.get('/usuarios', auth, controllerListarUsuarios)
routers.get('/usuarios/:usuarioId', auth, controllerObterUsuario)
routers.put('/usuarios', auth, controllerAtualizarUsuario)
routers.delete('/usuarios/:usuarioId', auth, controllerDeletarUsuario)

routers.post('/categorias', auth, controllerCriarCategoria)
routers.get('/categorias', controllerListarCategorias)
routers.put('/categorias/:categoriaId', auth, controllerAtualizarCategoria)
routers.delete('/categorias/:categoriaId', auth, controllerDeletarCategoria)

routers.post('/produtos', auth, controllerCadastrarProduto)
routers.get('/produtos', controllerListarProdutos)
routers.get('/produtos/:produtoId', controllerObterProduto)
routers.put('/produtos/:produtoId', auth, controllerAtualizarProduto)
routers.delete('/produtos/:produtoId', auth, controllerDeletarProduto)

routers.post('/estoque', auth, controllerCriarEstoque)
routers.get('/estoque', controllerListarEstoque)
routers.put('/estoque/:estoqueId', auth, controllerAtualizarEstoque)

routers.post('/pedidos', auth, controllerCriarPedido)
routers.get('/pedidos/minha-conta', auth, controllerListarPedidosUsuario)
routers.get('/pedidos', auth, controllerListarTodosPedidos)
routers.patch('/pedidos/:pedidoId/status', auth, controllerAtualizarStatusPedido)
routers.get('/pedidos/:pedidoId/itens', auth, controllerListarItensPedido)

routers.post('/enderecos', auth, controllerCadastrarEndereco)
routers.get('/enderecos', auth, controllerListarEnderecos)
routers.put('/enderecos/:enderecoId', auth, controllerAtualizarEndereco)
routers.delete('/endereco/:enderecoId', auth, controllerDeletarEndereco)

routers.post('/produtos/:produtoId/imagens', auth, upload.single('imagem'), controllerAdicionarImagemProduto)
routers.get('/produtos/:produtoId/imagens', controllerListarImagensProdutos)
routers.delete('/produtos/imagens/:imagemId', auth, controllerDeletarImagemProduto)

routers.post('/promocoes', auth, controllerCriarPromocao)
routers.get('/promocoes', controllerListarPromocoes)
routers.put('/promocoes/:promocaoId', auth, controllerAtualizarPromocao)
routers.patch('/promocoes/:promocaoId/status', auth, controllerAtualizarStatusPromocao)
routers.delete('/promocoes/:promocaoId', auth, controllerDeletarPromocao)

module.exports = routers