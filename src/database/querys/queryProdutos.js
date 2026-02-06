const { aplicarFiltrosProdutos } = require('../../utils/filtroProdutos')
const knex = require('../connection')

const queryCadastrarProduto = async (nome, descricao, preco, categoria_id) => {
    return await knex('produtos')
    .insert({nome, descricao, preco, categoria_id})
    .returning('*')
}

const queryListarProdutos = async (filtros) => {
    const query = knex('produtos as p')
    .select(
        'p.id',
        'p.nome',
        'p.descricao',
        'p.preco',
        'p.categoria_id',
        knex.raw('COALESCE(e.quantidade, 0) as estoque'),
        'ip.url as imagem'
    )
    .leftJoin('estoque as e', 'e.produto_id', 'p.id')
    .leftJoin('imagens_produtos as ip', function() {
        this.on('ip.produto_id', '=', 'p.id')
        .andOn('ip.img_principal', '=', knex.raw('true'))
    })

    aplicarFiltrosProdutos(query, filtros)

    return query
}

const queryBuscarProdutoPorId = async (produtoId) => {
    const produto = await knex('produtos as p')
    .select(
        'p.id',
        'p.nome',
        'p.descricao',
        'p.preco',
        'p.categoria_id' ,
        knex.raw('COALESCE(e.quantidade, 0) as estoque'),
    )
    .leftJoin('estoque as e', 'e.produto_id', 'p.id')
    .where('p.id', produtoId)
    .first()

    if (!produto) return null

    const imagens = await knex('imagens_produtos')
    .select('id', 'url', 'img_principal')
    .where('produto_id', produtoId)

    return {...produto, imagens}
}

const queryBuscaFacilDoProduto = async (produtoId) => {
    return await knex('produtos')
    .where({id: produtoId})
    .select('*')
}

const queryAtualizarProduto = async (nome, descricao, preco, categoria_id, produtoId) => {
    return await knex('produtos')
    .where({id: produtoId})
    .update({nome, descricao, preco, categoria_id})
    .returning('*')
}

const queryDeletarProduto = async (produtoId) => {
    return await knex('produtos')
    .where({id: produtoId})
    .del()
}

module.exports = {
    queryCadastrarProduto,
    queryListarProdutos,
    queryBuscarProdutoPorId,
    queryBuscaFacilDoProduto,
    queryAtualizarProduto,
    queryDeletarProduto
}