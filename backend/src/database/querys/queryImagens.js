const knex = require('../connection')

const queryAdicionarImagemProduto = async(produtoId, urlImagem) => {
    return await knex('imagens_produtos')
    .insert({ produto_id: produtoId, url: urlImagem })
    .returning('*')
}

const queryListarImagensProduto = async(produtoId) => {
    return await knex('imagens_produtos')
    .where({produto_id: produtoId})
    .returning('*')
}

const queryBuscarImagemPeloId = async(imagemId) => {
    return await knex('imagens_produtos')
    .where({ id: imagemId})
    .first()
}

const queryDeletarImagem = async(imagemId) => {
    return await knex('imagens_produtos')
    .where({ id: imagemId})
    .del()
}

module.exports = {
    queryAdicionarImagemProduto,
    queryListarImagensProduto,
    queryBuscarImagemPeloId,
    queryDeletarImagem
}