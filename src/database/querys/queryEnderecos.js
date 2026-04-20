const knex = require('../connection')

const queryCriarEndereco = async (usuarioId, enderecoFinal, cidadeFinal, estadoFinal, cep) => {
    return await knex('enderecos')
    .insert({ usuario_id: usuarioId, endereco: enderecoFinal, cidade: cidadeFinal, estado: estadoFinal, cep })
    .returning('*')
}

const queryListarEnderecosUsuarioLogado = async (usuarioId) => {
    return await knex("enderecos")
    .where({usuario_id: usuarioId})
    .select('id', 'endereco', 'cidade', 'estado', 'cep')
}

module.exports = {
    queryCriarEndereco,
    queryListarEnderecosUsuarioLogado
}