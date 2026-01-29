const { aplicarFiltrosProdutos } = require('../../utils/filtroProdutos')
const knex = require('../connection')

const queryCadastrarProduto = async (nome, descricao, preco, categoria_id, disponivel) => {
    return await knex('produtos')
    .insert({nome, descricao, preco, categoria_id, disponivel})
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
        knex.raw('COALESCE(e.quantidade, 0) > 0 as disponivel'),
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

module.exports = {
    queryCadastrarProduto,
    queryListarProdutos
}