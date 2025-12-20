const { queryCadastrarCategoria, queryListarCategorias, queryBuscarCategoria, queryAlterarNomeCategoria } = require("../database/querys/queryCategorias")

const controllerCriarCategoria = async (req, res) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    try {
        const usuarioLogado = req.usuario

        if (usuarioLogado.tipo !== "admin") {
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const categoriaExistente = await queryBuscarCategoria(nome)

        if (categoriaExistente) {
            return res.status(400).json({ error: 'Categoria já existe'})
        }

        const categoria = await queryCadastrarCategoria(nome)

        return res.status(200).json({ mensagem: 'categoria criada', categoria})
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar a categoria:", error)
        return res.status(500).json({ error: `Erro ao cadastrar a categoria: ${error.message}`})
    }
}

const controllerListarCategorias = async (req, res) => {
    try {
        const categorias = await queryListarCategorias()

        return res.status(200).json({ mensagem: 'categorias', categorias})
    } catch (error) {
        console.error("Ocorreu um erro ao listar as categorias:", error)
        return res.status(500).json({ error: `Erro ao listar as categorias: ${error.message}`})
    }
}

const controllerAtualizarNomeCategoria = async (req, res) => {
    const {nome} = req.body
    const {categoriaId} = req.params

    if (!categoriaId) {
        return res.status(400).json({ error: 'Informe o id da categoria'})
    }

    if (!nome) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    try {
        const usuarioLogado = req.usuario

        if (usuarioLogado.tipo !== "admin") {
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const nomeAtualizado = await queryAlterarNomeCategoria(categoriaId, nome)

        return res.status(200).json({ mensagem: 'Nome atualizado', nomeAtualizado})
    } catch (error) {
        console.error("Ocorreu um erro ao alterar o nome:", error)
        return res.status(500).json({ error: `Erro ao alterar o nome: ${error.message}`})
    }
}

module.exports = {
    controllerCriarCategoria,
    controllerListarCategorias,
    controllerAtualizarNomeCategoria
}