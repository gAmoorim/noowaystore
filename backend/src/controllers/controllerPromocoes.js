const { queryBuscarProdutoPorId } = require("../database/querys/queryProdutos")
const { queryCriarPromocao, queryListarPromocoesAtivas, queryAtualizarPromocao, queryBuscarPromocaoPorId, queryAtualizarStatusPromocao, queryDeletarPromocao } = require("../database/querys/queryPromocoes")

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

const controllerAtualizarPromocao = async (req, res) => {
    const { preco_promocional, começa_em, termina_em } = req.body

    const {promocaoId} = req.params

    if (!promocaoId) {
        return res.status(400).json({ error: 'infome o id da promoção'})
    }
    try {
        const usuarioLogado = req.usuario

        if (usuarioLogado.tipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const promocaoAtualizada = await queryAtualizarPromocao(promocaoId, preco_promocional, começa_em, termina_em)

        return res.status(200).json({ mensagem: 'Promoção atualizada', promocao: promocaoAtualizada})
    } catch (error) {
        console.error('Erro ao atualizar promoção:', error)
        return res.status(500).json({ error: `Erro ao listar promoção: ${error.message}`})
    }
}

const controllerAtualizarStatusPromocao = async (req, res) => {
    const usuarioLogado = req.usuario
    const { promocaoId } = req.params
    const { ativa } = req.body

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    if (!promocaoId) {
        return res.status(400).json({ error: 'informe o id da promoção'})
    }

    if (typeof ativa !== 'boolean') {
        return res.status(400).json({ error: 'o campo ativa deve ser true ou false'})
    }

    try {
        const promocao = await queryBuscarPromocaoPorId(promocaoId)

        if (!promocao) {
            return res.status(404).json({ error: 'Promoção não existe'})
        }

        const promocaoAtualizada = await queryAtualizarStatusPromocao(promocaoId, ativa)

        return res.status(200).json({ mensagem: 'Status da promoção atualizado', promocao: promocaoAtualizada})
    } catch (error) {
        console.error('Erro ao atualizar o status da promoção:', error)
        return res.status(500).json({ error: `Erro ao atualizar o status da promoção: ${error.message}`})
    }
}

const controllerDeletarPromocao = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !==  'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    const {promocaoId} = req.params

    if (!promocaoId) {
        return res.status(400).json({ error: 'Informe o id da promoção'})
    }

    try {
        const promocao = await queryBuscarPromocaoPorId(promocaoId)

        if (!promocao) {
            return res.status(404).json({ error: 'Promoção não existe'})
        }

        await queryDeletarPromocao(promocaoId)

        return res.status(200).json({ mensagem: 'Promoção deletada com sucesso'})
    } catch (error) {
        console.log('Erro ao deletar a promoção:', error)
        return res.status(500).json({ error: `Ocorreu um erro ao deletar a promoção: ${error.message}`})
    }
}

module.exports = {
    controllerCriarPromocao,
    controllerListarPromocoes,
    controllerAtualizarPromocao,
    controllerAtualizarStatusPromocao,
    controllerDeletarPromocao
}