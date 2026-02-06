const { queryCadastrarEstoque, queryListarEstoque, queryBuscarEstoque, queryAtualizarEstoque, } = require("../database/querys/queryEstoque")
const { queryBuscaFacilDoProduto } = require("../database/querys/queryProdutos")

const controllerCriarEstoque = async (req,res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    const { produto_id, tamanho, cor, quantidade } = req.body

    if (!produto_id || !tamanho || !quantidade) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios'})
    }

    try {
        const produto = await queryBuscaFacilDoProduto(produto_id)

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado'})
        }

        const estoqueCriado = await queryCadastrarEstoque(produto_id, tamanho, cor, quantidade)

        return res.status(201).json({ mensagem: 'Estoque criado', estoque: estoqueCriado})
    } catch (error) {
        console.error('Ocorreu um erro ao criar o estoque', error)
        return res.status(500).json({ error: `ocorreu um erro ao criar o estoque ${error.message}`})
    }
}

const controllerListarEstoque = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    try {
        const estoques = await queryListarEstoque()

        if (!estoques) {
            return res.status(400).json({ error: 'Nenhum estoque encontrado'})
        }

        return res.status(200).json(estoques)
    } catch (error) {
        console.error('Ocorreu um erro ao listar estoques', error)
        return res.status(500).json({ error: `ocorreu um erro ao listar estoques ${error.message}`})
    }
}

const controllerAtualizarEstoque = async (req,res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    const { estoqueId } = req.params

    if (!estoqueId) {
        return res.status(400).json({ error: 'Erro ao obter o id do estoque'})
    }

    const { tamanho, cor, quantidade } = req.body

    if (quantidade < 0) {
        return res.status(400).json({ error: 'quantidade tem que ser igual ou maior que 0'})
    }

    try {
        const estoque = await queryBuscarEstoque(estoqueId)

        if (!estoque) {
            return res.status(404).json({ error: 'Estoque não encontrado'})
        }

        const estoqueAtualizado = await queryAtualizarEstoque(tamanho, cor, quantidade, estoqueId)

        return res.status(200).json({ error: 'Estoque atulizado', estoque: estoqueAtualizado})
    } catch (error) {
        console.error('Ocorreu um erro ao atualizar o estoque', error)
        return res.status(500).json({ error: `ocorreu um erro ao tualizar o estoque ${error.message}`})
    }
}

module.exports = {
    controllerCriarEstoque,
    controllerListarEstoque,
    controllerAtualizarEstoque
}