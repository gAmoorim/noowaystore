const express = require('express')
const { controllerCadastrarUsuario, controllerListarUsuarios, controllerObterUsuario, controllerAtualizarUsuario } = require('../controllers/controllerUsuarios')
const { controllerLoginUsuario } = require('../controllers/controllerLogin')
const auth = require('../middlewares/auth')

const routers = express()

routers.post('/login', controllerLoginUsuario)

routers.post('/usuarios', controllerCadastrarUsuario)
routers.get('/usuarios', auth, controllerListarUsuarios)
routers.get('/usuarios/:id', auth, controllerObterUsuario)
routers.put('/usuarios', auth, controllerAtualizarUsuario)

module.exports = routers