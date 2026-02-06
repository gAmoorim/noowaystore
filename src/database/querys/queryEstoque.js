const knex = require('../connection')

const queryCadastrarEstoque = async (produto_id, tamanho, cor, quantidade) => {
    return await knex('estoque')
    .insert({ produto_id, tamanho, cor, quantidade})
    .returning('*')
}

const queryListarEstoque = async () => {
    return await knex('estoque')
    .returning('*')
}

const queryBuscarEstoque = async (estoqueId) => {
    return await knex('estoque')
    .where({ id: estoqueId})
    .returning('*')
}

const queryAtualizarEstoque = async (tamanho, cor, quantidade, estoqueId) => {
    return await knex('estoque')
    .where({id: estoqueId})
    .update({ tamanho, cor, quantidade })
    .returning('*')
}

module.exports = {
    queryCadastrarEstoque,
    queryListarEstoque,
    queryBuscarEstoque,
    queryAtualizarEstoque
}