const { aplicarFiltrosProdutos } = require('../../utils/filtroProdutos')
const knex = require('../connection')

const estoqueTotal = () => knex('estoque')
    .select('produto_id')
    .sum({ estoque: 'quantidade' })
    .groupBy('produto_id')
    .as('est')

const imagemPrincipalSql = knex.raw(`(
    SELECT ip.url
    FROM imagens_produtos ip
    WHERE ip.produto_id = p.id
    ORDER BY ip.img_principal DESC, ip.id ASC
    LIMIT 1
) as imagem`)

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
        'p.criado_em',
        'c.nome as categoria_nome',
        knex.raw('COALESCE(est.estoque, 0) as estoque'),
        imagemPrincipalSql
    )
    .leftJoin('categorias as c', 'c.id', 'p.categoria_id')
    .leftJoin(estoqueTotal(), 'est.produto_id', 'p.id')

    aplicarFiltrosProdutos(query, filtros)

    return query.orderBy('p.id', 'asc')
}

const queryBuscarProdutoPorId = async (produtoId) => {
    const produto = await knex('produtos as p')
    .select(
        'p.id',
        'p.nome',
        'p.descricao',
        'p.preco',
        'p.categoria_id',
        'p.criado_em',
        'c.nome as categoria_nome',
        knex.raw('COALESCE(est.estoque, 0) as estoque'),
        imagemPrincipalSql
    )
    .leftJoin('categorias as c', 'c.id', 'p.categoria_id')
    .leftJoin(estoqueTotal(), 'est.produto_id', 'p.id')
    .where('p.id', produtoId)
    .first()

    if (!produto) return null

    const imagens = await knex('imagens_produtos')
    .select('id', 'url', 'img_principal')
    .where('produto_id', produtoId)
    .orderBy('img_principal', 'desc')
    .orderBy('id', 'asc')

    return {...produto, imagens}
}

const queryBuscaFacilDoProduto = async (produtoId) => {
    return await knex('produtos')
    .where({id: produtoId})
    .first('*')
}

const queryAtualizarProduto = async (nome, descricao, preco, categoria_id, produtoId) => {
    const dados = {}
    if (nome !== undefined) dados.nome = nome
    if (descricao !== undefined) dados.descricao = descricao
    if (preco !== undefined) dados.preco = preco
    if (categoria_id !== undefined) dados.categoria_id = categoria_id

    return await knex('produtos')
    .where({id: produtoId})
    .update(dados)
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
