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
    .first('*')
}

const queryAlterarNomeCategoria = async(categoriaId, nome) => {
    return await knex('categorias')
    .where({ id: categoriaId})
    .update({nome})
    .returning('*')
}

const queryBuscarCategoriaPorId = async(categoriaId) => {
    return await knex('categorias')
    .where({id: categoriaId})
    .first('*')
}

const queryDeletarCategoria = async (categoriaId) => {
    return await knex('categorias')
    .where({ id: categoriaId})
    .del()
}

module.exports = {
    queryCadastrarCategoria,
    queryListarCategorias,
    queryBuscarCategoria,
    queryAlterarNomeCategoria,
    queryBuscarCategoriaPorId,
    queryDeletarCategoria
}