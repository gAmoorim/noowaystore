const knex = require('../connection')

const queryCadastrarCategoria = async (nome) => {
    return await knex('categorias')
    .insert({nome})
    .returning('*')
}

const queryListarCategorias = async () => {
    return await knex('categorias')
    .select('id', 'nome')
}

const queryBuscarCategoria = async(nome) => {
    return await knex('categorias')
    .where({nome})
}

const queryAlterarNomeCategoria = async(categoriaId, nome) => {
    return await knex('categorias')
    .where({ id: categoriaId})
    .update({nome})
    .returning('*')
}

module.exports = {
    queryCadastrarCategoria,
    queryListarCategorias,
    queryBuscarCategoria,
    queryAlterarNomeCategoria
}