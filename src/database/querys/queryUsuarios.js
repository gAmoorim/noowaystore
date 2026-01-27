const knex = require('../connection')

const queryBuscarUsuarioLogin = async (email) => {
    return await knex('usuarios')
    .select('id', 'nome', 'email', 'senha_hash', 'tipo')
    .where({ email})
    .first()
}

const queryBuscarUsuarioPeloId = async (usuarioId) => {
    return await knex('usuarios')
    .select('id', 'nome', 'email', 'telefone', 'tipo', 'criado_em')
    .where({id: usuarioId})
    .first()
}

const queryBuscarUsuarioPeloEmail = async (email) => {
    return await knex('usuarios')
    .select('id', 'nome', 'email', 'telefone', 'tipo', 'criado_em')
    .where({email})
    .first()
}

const queryCadastrarNovoUsuario = async (nome, email, senha_hash, telefone) => {
    return await knex('usuarios')
    .insert({ nome, email, senha_hash, telefone})
    .select('nome', 'email')
}

const queryListarUsuarios = async () => {
    return await knex('usuarios')
    .select('id', 'nome', 'email', 'telefone', 'tipo', 'criado_em')
}

const queryVerificarTelefoneCadastrado = async (telefone) => {
    return await knex('usuarios')
    .where({telefone})
    .first()
}

const queryAtualizarUsuario = async (nome, email, senha, telefone, usuarioId) => {
    return await knex('usuarios')
    .where({id: usuarioId})
    .update({ nome, email, senha_hash: senha, telefone})
    .select('nome', 'email', 'telefone')
}

const queryDeletarUsuario = async (usuarioId) => {
    return await knex('usuarios')
    .where({ id: usuarioId})
    .del()
}

module.exports = {
    queryBuscarUsuarioLogin,
    queryBuscarUsuarioPeloId,
    queryBuscarUsuarioPeloEmail,
    queryCadastrarNovoUsuario,
    queryListarUsuarios,
    queryVerificarTelefoneCadastrado,
    queryAtualizarUsuario,
    queryDeletarUsuario
}