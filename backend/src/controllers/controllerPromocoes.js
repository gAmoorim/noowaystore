const { queryBuscarProdutoPorId } = require("../database/querys/queryProdutos")
const { queryCriarPromocao, queryListarPromocoesAtivas } = require("../database/querys/queryPromocoes")

const controllerCriarPromocao = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    const { produto_id, preco_promocional, começa_em, termina_em, ativa } = req.body

    if (!produto_id || !preco_promocional || !começa_em) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios'})
    }

    try {
        const produtoId = produto_id
        const produto = await queryBuscarProdutoPorId(produtoId)

        if (!produto) {
            return res.status(404).json({ error: 'Produto não existe'})
        }

        const promocaoCriada = await queryCriarPromocao(produto_id, preco_promocional, começa_em, termina_em, ativa)

        return res.status(201).json({ 
            mensagem: 'Promoção criada', 
            promocao: promocaoCriada
        })
    } catch (error) {
        console.error('Erro ao atualizar criar a promoção', error)
        return res.status(500).json({ error: `ocorreu um erro ao criar a promoção ${error.message}`})
    }
}

const controllerListarPromocoes = async (req, res) => {
    try {
        const promocoes = await queryListarPromocoesAtivas()

        return res.status(200).json({ promocoes })
    } catch (error) {
        console.error('Erro ao listar promoções:', error)
        return res.status(500).json({ error: `Erro ao listar promoções: ${error.message}`})
    }
}

module.exports = {
    controllerCriarPromocao,
    controllerListarPromocoes
}