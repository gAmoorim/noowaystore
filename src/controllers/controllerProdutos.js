const { queryBuscarCategoriaPorId } = require("../database/querys/queryCategorias")
const { queryCadastrarProduto, queryListarProdutos } = require("../database/querys/queryProdutos")

const controllerCadastrarProduto = async (req, res) => {
    const { nome, descricao, preco, categoria_id } = req.body

    if (!nome || !preco) {
        return res.status(400),json({ error: 'Nome e preço são obrigatórios'})
    }

    try {
        const usuarioLogado = req.usuario

        if (usuarioLogado.tipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.'})
        }

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
      const produtos = await queryListarProdutos(req.query) // RETORNAR APENAS IMG PRINCIPAL
      
      return res.status(200).json(produtos)
    } catch (error) {
        console.error("Erro ao listar produtos:", error)
        return res.status(500).json({ error: `Erro ao listar produtos: ${error.message}`})
    }
}

const controllerBuscarProduto = async (req, res) => {
    const { produtoId} = req.query

    // RETORNAR TODAS AS IMGS


}

module.exports = {
    controllerCadastrarProduto,
    controllerListarProdutos
}