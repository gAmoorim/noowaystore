const aplicarFiltrosProdutos = (query, filtros) => {
  if (!filtros) return

  const {
    nome,
    preco_min,
    preco_max,
    categoria_id,
    disponivel
  } = filtros

  if (nome) query.whereILike('nome', `%${nome}%`)
  if (preco_min) query.where('preco', '>=', Number(preco_min))
  if (preco_max) query.where('preco', '<=', Number(preco_max))
  if (categoria_id) query.where('categoria_id', Number(categoria_id))
  if (disponivel !== undefined)
    query.where('disponivel', disponivel === 'true')
}

module.exports = {
  aplicarFiltrosProdutos
}