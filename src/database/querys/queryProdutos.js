const { aplicarFiltrosProdutos } = require('../../utils/filtroProdutos')
const knex = require('../connection')

const queryCadastrarProduto = async (nome, descricao, preco, categoria_id, disponivel) => {
    return await knex('produtos')
    .insert({nome, descricao, preco, categoria_id, disponivel})
    .returning('*')
}

const queryListarProdutos = async (filtros) => {
    const query = knex('produtos').select('*')

    aplicarFiltrosProdutos(query, filtros)

    return await query
}

module.exports = {
    queryCadastrarProduto,
    queryListarProdutos
}