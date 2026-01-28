const express = require('express')
const { controllerCadastrarUsuario, controllerListarUsuarios, controllerObterUsuario, controllerAtualizarUsuario, controllerDeletarUsuario } = require('../controllers/controllerUsuarios')
const { controllerLoginUsuario } = require('../controllers/controllerLogin')
const { controllerCriarCategoria, controllerListarCategorias, controllerAtualizarCategoria, controllerDeletarCategoria } = require('../controllers/controllerCategorias')
const { controllerCadastrarProduto, controllerListarProdutos } = require('../controllers/controllerProdutos')

const auth = require('../middlewares/auth')

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

module.exports = routers