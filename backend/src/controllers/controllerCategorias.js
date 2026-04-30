const { queryCadastrarCategoria, queryListarCategorias, queryBuscarCategoria, queryAlterarNomeCategoria, queryBuscarCategoriaPorId, queryDeletarCategoria } = require("../database/querys/queryCategorias")

const controllerCriarCategoria = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== "admin") {
        return res.status(403).json({ error: 'Acesso negado'})
    }
    
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    try {
        const categoriaExistente = await queryBuscarCategoria(nome.toLowerCase())

        if (categoriaExistente) {
            return res.status(400).json({ error: 'Categoria já existe'})
        }

        const categoria = await queryCadastrarCategoria(nome.toLowerCase())

        return res.status(201).json({ mensagem: 'categoria criada', categoria})
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

const controllerAtualizarCategoria = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== "admin") {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    const {nome} = req.body

    if (!nome) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    const {categoriaId} = req.params

    if (!categoriaId) {
        return res.status(400).json({ error: 'Informe o id da categoria'})
    }

    try {
        const categoria = await queryBuscarCategoriaPorId(categoriaId)

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não existe'})
        }

        const nomeAtualizado = await queryAlterarNomeCategoria(categoriaId, nome.toLowerCase())

        return res.status(200).json({ mensagem: 'Nome atualizado', nomeAtualizado})
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar a categoria:", error)
        return res.status(500).json({ error: `Erro ao atualizar a categoria: ${error.message}`})
    }
}

const controllerDeletarCategoria = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.'})
    }

    const {categoriaId} = req.params

    if (!categoriaId) {
        return res.status(400).json({ error: 'Informe o id da categoria.'})
    }

    try {
        const categoria = await queryBuscarCategoriaPorId(categoriaId)

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não existe.'})
        }

        await queryDeletarCategoria(categoriaId)

        return res.status(200).json({mensagem: 'Categoria deletada.'})
    } catch (error) {
        console.error('Ocorreu um erro ao deletar a categoria', error)
        return res.status(500).json({ error: `Erro ao deletar a categoria ${error.message}`})
    }

}

module.exports = {
    controllerCriarCategoria,
    controllerListarCategorias,
    controllerAtualizarCategoria,
    controllerDeletarCategoria
}