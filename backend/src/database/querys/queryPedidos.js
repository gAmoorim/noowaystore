const knex = require('../connection')

const promocaoAtiva = () =>
  knex('promocoes as pr')
    .distinctOn('pr.produto_id')
    .select('pr.produto_id', 'pr.id as promocao_id', 'pr.preco_promocional')
    .where('pr.ativa', true)
    .where('pr.começa_em', '<=', knex.fn.now())
    .where(function () {
      this.whereNull('pr.termina_em').orWhere('pr.termina_em', '>=', knex.fn.now())
    })
    .orderBy([
      { column: 'pr.produto_id', order: 'asc' },
      { column: 'pr.começa_em', order: 'desc' },
      { column: 'pr.id',        order: 'desc' },
    ])
    .as('promo')

const imagemPrincipalSql = knex.raw(`(
  SELECT img.url FROM imagens_produtos img
  WHERE img.produto_id = p.id
  ORDER BY img.img_principal DESC, img.id ASC
  LIMIT 1
) as imagem`)

const CAMPOS_PEDIDO = [
  'p.id', 'p.usuario_id', 'p.endereco_id', 'p.status', 'p.criado_em',
  'u.nome as usuario_nome', 'u.email as usuario_email', 'u.telefone as usuario_telefone',
  'en.logradouro', 'en.numero', 'en.complemento', 'en.cidade', 'en.estado', 'en.cep',
]

const GROUP_PEDIDO = [
  'p.id', 'p.usuario_id', 'p.endereco_id', 'p.status', 'p.criado_em',
  'u.nome', 'u.email', 'u.telefone',
  'en.logradouro', 'en.numero', 'en.complemento', 'en.cidade', 'en.estado', 'en.cep',
]

const pedidoBase = () =>
  knex('pedidos as p')
    .select(
      ...CAMPOS_PEDIDO,
      knex.raw('COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0) as total'),
      knex.raw('COUNT(ip.id) as quantidade_itens')
    )
    .join('usuarios as u', 'u.id', 'p.usuario_id')
    .leftJoin('enderecos as en', 'en.id', 'p.endereco_id')
    .leftJoin('itens_pedido as ip', 'ip.pedido_id', 'p.id')
    .groupBy(...GROUP_PEDIDO)
    .orderBy('p.id', 'desc')

const queryInserirPedido = async (usuario_id, endereco_id = null) => {
  const [pedido] = await knex('pedidos')
    .insert({ usuario_id, endereco_id, status: 'pendente' })
    .returning('*')
  return pedido
}

const queryInserirItensPedido = async (itens) =>
  knex('itens_pedido').insert(itens)

const queryAtualizarEstoquePeloid = async (estoque_id, quantidade) =>
  knex('estoque').where({ id: estoque_id }).decrement('quantidade', quantidade)

const queryListarPedidosUsuario = async (usuarioId) =>
  pedidoBase().where('p.usuario_id', usuarioId)

const queryListarTodosPedidos = async () =>
  pedidoBase()

const queryBuscarPedidoPorId = async (pedidoId) =>
  knex('pedidos').where({ id: pedidoId }).first()

const queryAtualizarStatusPedido = async (pedidoId, status) =>
  knex('pedidos').where({ id: pedidoId }).update({ status }).returning('*')

const queryBuscarPedidoDetalhadoPorId = async (pedidoId) =>
  knex('pedidos as p')
    .select(...CAMPOS_PEDIDO)
    .join('usuarios as u', 'u.id', 'p.usuario_id')
    .leftJoin('enderecos as en', 'en.id', 'p.endereco_id')
    .where('p.id', pedidoId)
    .first()

const queryBuscarProdutoPorEstoqueId = async (estoque_id) =>
  knex('estoque as e')
    .select(
      'e.id as estoque_id', 'e.quantidade as estoque',
      'p.id as produto_id', 'p.nome', 'p.preco',
      'promo.promocao_id', 'promo.preco_promocional'
    )
    .join('produtos as p', 'p.id', 'e.produto_id')
    .leftJoin(promocaoAtiva(), 'promo.produto_id', 'p.id')
    .where('e.id', estoque_id)
    .first()
    .then(item => item || null)

const queryListarItensPedido = async (pedidoId) =>
  knex('itens_pedido as ip')
    .select(
      'ip.id', 'ip.estoque_id', 'ip.quantidade', 'ip.preco_unitario',
      'p.id as produto_id', 'p.nome as produto_nome',
      'e.tamanho', 'e.cor',
      imagemPrincipalSql
    )
    .join('estoque as e', 'e.id', 'ip.estoque_id')
    .join('produtos as p', 'p.id', 'e.produto_id')
    .where('ip.pedido_id', pedidoId)

module.exports = {
  queryInserirPedido,
  queryInserirItensPedido,
  queryListarPedidosUsuario,
  queryBuscarProdutoPorEstoqueId,
  queryAtualizarEstoquePeloid,
  queryListarTodosPedidos,
  queryBuscarPedidoPorId,
  queryAtualizarStatusPedido,
  queryBuscarPedidoDetalhadoPorId,
  queryListarItensPedido,
}