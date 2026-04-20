const knex = require('../connection')

const queryCriarEndereco = async (usuarioId, logradouroFinal, numero, complemento, cidadeFinal, estadoFinal, cep) => {
    return await knex('enderecos')
    .insert({
        usuario_id: usuarioId, logradouro: logradouroFinal, numero, complemento, cidade: cidadeFinal, estado: estadoFinal, cep
    })
    .returning('*')
}

const queryListarEnderecosUsuarioLogado = async (usuarioId) => {
    return await knex("enderecos")
    .where({usuario_id: usuarioId})
    .select('id', 'logradouro', 'numero', 'complemento', 'cidade', 'estado', 'cep')
}

module.exports = {
    queryCriarEndereco,
    queryListarEnderecosUsuarioLogado
}

