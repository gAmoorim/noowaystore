const knex = require('../connection')

const queryBuscarUsuarioPeloId = async (id) => {
    return await knex('usuarios')
    .where({id})
    .first()
}

const queryBuscarUsuarioPeloEmail = async (email) => {
    return await knex('usuarios')
    .where({email})
    .first()
}

const queryCadastrarNovoUsuario = async (nome, email, senha_hash, telefone, tipo) => {
    return await knex('usuarios')
    .insert({ nome, email, senha_hash, telefone, tipo})
    .returning('*')
}


module.exports = {
    queryBuscarUsuarioPeloId,
    queryBuscarUsuarioPeloEmail,
    queryCadastrarNovoUsuario
}