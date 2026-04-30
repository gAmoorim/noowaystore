const { queryBuscarCategoriaPorId } = require("../database/querys/queryCategorias")
const { queryCadastrarProduto, queryListarProdutos, queryBuscarProdutoPorId, queryBuscaFacilDoProduto, queryAtualizarProduto, queryDeletarProduto } = require("../database/querys/queryProdutos")

const controllerCadastrarProduto = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.'})
    }

    const { nome, descricao, preco, categoria_id } = req.body

    if (!nome || !preco || !categoria_id) {
        return res.status(400),json({ error: 'Nome, preço e categoria_id são obrigatórios'})
    }

    try {
        if (categoria_id) {
            const categoriaExistente = await queryBuscarCategoriaPorId(categoria_id)

            if (!categoriaExistente) {
                return res.status(400).json({ error: 'Categoria não existe.'})
            }
        }

        const produtoCadastrado = await queryCadastrarProduto(
            nome.toLowerCase(), 
            descricao.toLowerCase(), 
            preco, 
            categoria_id
        )

        return res.status(201).json({ mensagem: 'Produto cadastrado', produto: produtoCadastrado})
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar o usuário:", error)
        return res.status(500).json({ error: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

const controllerListarProdutos = async (req, res) => {
    try {
        const produtos = await queryListarProdutos(req.query)

        if (!produtos) {
            return res.status(404).json({ error: 'Nenhum produto encontrado'})
        }

        return res.status(200).json(produtos)
    } catch (error) {
        console.error("Ocorreu um erro ao listar :", error)
        return res.status(500).json({ error: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

const controllerObterProduto = async (req, res) => {
    const { produtoId} = req.params

    try {
        const produto = await queryBuscarProdutoPorId(produtoId)

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado'})
        }

        return res.status(200).json(produto)
    } catch (error) {
        console.error("Erro ao buscar produto:", error)
        return res.status(500).json({ error: `Erro ao buscar produto: ${error.message}`})
    }

}

const controllerAtualizarProduto = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.'})
    }

    const { produtoId } = req.params

    if (!produtoId) {
        return res.status(404).json({ error: 'Produto não encontrado'})
    }

    const { nome, descricao, preco, categoria_id } = req.body
    
    if (!nome && !descricao && !preco && categoria_id) {
        return res.status(400).json({ error: 'Passe algum campo para atualizar.'})
    }

    try {
        const produto = await queryBuscaFacilDoProduto(produtoId)

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.'})
        }

        const produtoAtualizado = await queryAtualizarProduto(nome, descricao, preco, categoria_id, produtoId)

        return res.status(200).json({ mensagem: 'Produto atualizado', produto: produtoAtualizado})        
    } catch (error) {
        console.error("Erro ao atualizar produto:", error)
        return res.status(500).json({ error: `Erro ao atualizar produto: ${error.message}`})
    }
}

const controllerDeletarProduto = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.'})
    }

    const { produtoId } = req.params

    if (!produtoId) {
        return res.status(404).json({ error: 'Produto não encontrado'})
    }

    try {
        const produto = await queryBuscaFacilDoProduto(produtoId)

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado'})
        }

        await queryDeletarProduto(produtoId)

        return res.status(200).json({ mensagem: 'Produto deletado.'})
    } catch (error) {
        console.error("Erro ao deletar o produto:", error)
        return res.status(500).json({ error: `Erro ao deletar o produto: ${error.message}`})
    }
}

module.exports = {
    controllerCadastrarProduto,
    controllerListarProdutos,
    controllerObterProduto,
    controllerAtualizarProduto,
    controllerDeletarProduto
}