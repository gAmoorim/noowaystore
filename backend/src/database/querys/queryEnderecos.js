const knex = require('../connection')

const queryCriarEndereco = async (usuarioId, logradouroFinal, numero, complemento, cidadeFinal, estadoFinal, cep) => {
    return await knex('enderecos')
    .insert({
        usuario_id: usuarioId, logradouro: logradouroFinal, numero, complemento, cidade: cidadeFinal, estado: estadoFinal, cep
    })
    .returning('*')
}

const queryListarEnderecosUsuarioLogado = async (usuarioId) => {
    return await knex('enderecos')
    .select('id', 'logradouro', 'numero', 'complemento', 'cidade', 'estado', 'cep')
    .where({usuario_id: usuarioId})
}

const queryAtualizarEndereco = async (enderecoId, cep, numero, complemento, logradouro, cidade, estado) => {
    return await knex('enderecos')
    .where({ id: enderecoId})
    .update({ cep, numero, complemento, logradouro, cidade, estado})
    .returning(['cep', 'numero', 'complemento', 'logradouro', 'cidade', 'estado'])
}

const queryVerificarEnderecoPertencente = async (usuarioId, enderecoId) => {
    return await knex('enderecos')
    .where({id: enderecoId, usuario_id: usuarioId })
    .first()
}

const queryDeletarEndereco = async (enderecoId) => {
    return await knex('enderecos')
    .where({ id: enderecoId })
    .del()
}

module.exports = {
    queryCriarEndereco,
    queryListarEnderecosUsuarioLogado,
    queryAtualizarEndereco,
    queryVerificarEnderecoPertencente,
    queryDeletarEndereco
}