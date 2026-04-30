const knex = require('../connection');

const queryInserirPedido = async (usuario_id) => {
  const [pedido] = await knex('pedidos')
    .insert({
      usuario_id,
      status: 'pendente'
    })
    .returning('*')

  return pedido
}

const queryInserirItensPedido = async (itens) => {
  return await knex('itens_pedido').insert(itens)
}

const queryAtualizarEstoquePeloid = async (estoque_id, quantidade) => {
  return await knex('estoque')
  .where({ id: estoque_id })
  .decrement('quantidade', quantidade)
}

const queryListarPedidosUsuario = async (usuarioId) => {
  return await knex('pedidos as p')
    .select(
      'p.id',
      'p.status',
      'p.criado_em',
      knex.raw('COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0) as total'),
      knex.raw('COUNT(ip.id) as quantidade_itens')
    )
    .leftJoin('itens_pedido as ip', 'ip.pedido_id', 'p.id')
    .where('p.usuario_id', usuarioId)
    .groupBy('p.id')
    .orderBy('p.id', 'desc')
}

const queryBuscarProdutoPorEstoqueId = async (estoque_id) => {
  const item = await knex('estoque as e')
    .select(
      'e.id as estoque_id',
      'e.quantidade as estoque',
      'p.id as produto_id',
      'p.nome',
      'p.preco'
    )
    .join('produtos as p', 'p.id', 'e.produto_id')
    .where('e.id', estoque_id)
    .first()

  return item || null;
}

const queryListarTodosPedidos = async () => {
  return await knex('pedidos as p')
    .select(
      'p.id',
      'p.usuario_id',
      'p.status',
      'p.criado_em',
      knex.raw('COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0) as total'),
      knex.raw('COUNT(ip.id) as quantidade_itens')
    )
    .leftJoin('itens_pedido as ip', 'ip.pedido_id', 'p.id')
    .groupBy('p.id')
    .orderBy('p.id', 'desc')
}

const queryBuscarPedidoPorId = async (pedidoId) => {
  return await knex('pedidos')
  .where({id: pedidoId})
  .first()
}

const queryAtualizarStatusPedido = async (pedidoId, status) => {
  return await knex('pedidos')
  .where({ id: pedidoId})
  .update({ status })
  .returning('*')
}

const queryListarItensPedido = async (pedidoId) => {
  return await knex('itens_pedido as ip')
    .select(
      'ip.id',
      'ip.quantidade',
      'ip.preco_unitario',
      'p.nome as produto_nome'
    )
    .join('estoque as e', 'e.id', 'ip.estoque_id')
    .join('produtos as p', 'p.id', 'e.produto_id')
    .where('ip.pedido_id', pedidoId);
}

module.exports = {
  queryInserirPedido,
  queryInserirItensPedido,
  queryListarPedidosUsuario,
  queryBuscarProdutoPorEstoqueId,
  queryAtualizarEstoquePeloid,
  queryListarTodosPedidos,
  queryBuscarPedidoPorId,
  queryAtualizarStatusPedido,
  queryListarItensPedido
}