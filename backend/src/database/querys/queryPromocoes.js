const knex = require('../connection')

const queryCriarPromocao = async (produto_id, preco_promocional, começa_em, termina_em, ativa) => {
    return await knex('promocoes')
    .insert({produto_id, preco_promocional, começa_em, termina_em, ativa})
    .returning('*')
}

const queryListarPromocoesAtivas = async () => {
  return await knex('promocoes as pr')
    .select(
      'pr.id',
      'pr.produto_id',
      'p.nome as produto_nome',
      'p.preco',
      'pr.preco_promocional',
      'pr.começa_em',
      'pr.termina_em',
      'pr.ativa',
      knex.raw(`(
        SELECT ip.url
        FROM imagens_produtos ip
        WHERE ip.produto_id = p.id
        ORDER BY ip.img_principal DESC, ip.id ASC
        LIMIT 1
      ) as imagem`)
    )
    .join('produtos as p', 'p.id', 'pr.produto_id')
    .where('pr.ativa', true)
    .where('pr.começa_em', '<=', knex.fn.now())
    .where(function () {
      this.whereNull('pr.termina_em')
        .orWhere('pr.termina_em', '>=', knex.fn.now())
    })
    .orderBy('pr.id', 'desc')
}

const queryAtualizarPromocao = async (promocaoId, preco_promocional, começa_em, termina_em) => {
  return await knex('promocoes')
  .where({id: promocaoId})
  .update({preco_promocional, começa_em, termina_em})
  .returning('*')
}

const queryBuscarPromocaoPorId = async (promocaoId) => {
  return await knex('promocoes')
  .where({id: promocaoId})
  .first()
}

const queryAtualizarStatusPromocao = async (promocaoId, ativa) => {
  return await knex('promocoes')
  .where({ id: promocaoId})
  .update({ativa})
  .returning('*')
}

const queryDeletarPromocao = async (promocaoId) => {
  return await knex('promocoes')
  .where({ id: promocaoId})
  .del()
}

module.exports = {
    queryCriarPromocao,
    queryListarPromocoesAtivas,
    queryAtualizarPromocao,
    queryBuscarPromocaoPorId,
    queryAtualizarStatusPromocao,
    queryDeletarPromocao
}