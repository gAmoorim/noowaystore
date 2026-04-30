const knex = require('../connection')

const queryAdicionarImagemProduto = async(produtoId, urlImagem, imgPrincipal = false) => {
    return await knex('imagens_produtos')
    .insert({ produto_id: produtoId, url: urlImagem, img_principal: imgPrincipal })
    .returning('*')
}

const queryDesmarcarImagemPrincipal = async(produtoId) => {
    return await knex('imagens_produtos')
    .where({ produto_id: produtoId })
    .update({ img_principal: false })
}

const queryListarImagensProduto = async(produtoId) => {
    return await knex('imagens_produtos')
    .select('id', 'url', 'img_principal', 'criado_em')
    .where({produto_id: produtoId})
    .orderBy('img_principal', 'desc')
    .orderBy('id', 'asc')
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
    queryDesmarcarImagemPrincipal,
    queryListarImagensProduto,
    queryBuscarImagemPeloId,
    queryDeletarImagem
}
