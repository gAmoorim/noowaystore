const aplicarFiltrosProdutos = (query, filtros) => {
  if (!filtros) return

  const {
    nome,
    preco_min,
    preco_max,
    categoria_id,
    disponivel
  } = filtros

  if (nome) query.whereILike('p.nome', `%${nome}%`)
  if (preco_min) query.where('p.preco', '>=', Number(preco_min))
  if (preco_max) query.where('p.preco', '<=', Number(preco_max))
  if (categoria_id) query.where('p.categoria_id', Number(categoria_id))

  if (disponivel === 'true') {
    query.whereRaw('COALESCE(est.estoque, 0) > 0')
  }

  if (disponivel === 'false') {
    query.whereRaw('COALESCE(est.estoque, 0) = 0')
  }
}

module.exports = {
  aplicarFiltrosProdutos
}
