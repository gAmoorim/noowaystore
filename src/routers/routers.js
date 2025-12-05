const express = require('express')
const { controllerCadastrarUsuario } = require('../controllers/controllerUsuarios')

const routers = express()

routers.post('/usuarios', controllerCadastrarUsuario)

module.exports = routers