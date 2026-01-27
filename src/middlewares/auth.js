require('dotenv').config()
const jwt = require('jsonwebtoken')
const { queryBuscarUsuarioPeloId } = require('../database/querys/queryUsuarios')
const senhaJWT = process.env.JWt_PWD

const auth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Não autorizado'})
    }

    try {
        const token = authorization.replace('Bearer ', '').trim()

        if (!token) {
            return res.status(401).json({ error: 'Token ausente'})
        }

        const {id} = jwt.verify(token, senhaJWT)

        const usuarioExistente = await queryBuscarUsuarioPeloId(id)

        if (!usuarioExistente) {
            return res.status(401).json({ error: 'Usuário não encontrado'})
        }

        req.usuario = {
            id: usuarioExistente.id,
            tipo: usuarioExistente.tipo
        }

        next()
    } catch (error) {
        console.error("Erro na autenticação:", error)
        return res.status(401).json('Token inválido ou expirado')
    }
}

module.exports = auth