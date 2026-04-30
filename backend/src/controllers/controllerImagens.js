const { queryAdicionarImagemProduto, queryListarImagensProduto, queryBuscarImagemPeloId, queryDeletarImagem } = require("../database/querys/queryImagens")
const { queryBuscaFacilDoProduto } = require("../database/querys/queryProdutos")
const { deletarArquivo, deletarArquivoPorUrl } = require("../utils/deletarImagem")

const controllerAdicionarImagemProduto = async (req, res) => {
    const { produtoId } = req.params

    try {
        const usuarioId = req.usuario?.id
        const tipoUsuario = req.usuario?.tipo

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuário não encontrado'})
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Imagem não enviada'})
        }

        if (tipoUsuario !== 'admin') {
            await deletarArquivo(req.file)
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const produto = await queryBuscaFacilDoProduto(produtoId)

        if (!produto) {
            await deletarArquivo(req.file)
            return res.status(404).json({ error: 'Produto não encontrado'})
        }

        const urlImagem = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

        const [imagemProduto] = await queryAdicionarImagemProduto(produtoId, urlImagem)

        return res.status(201).json({
            mensagem: 'Imagem adicionada com sucesso',
            imagem: imagemProduto
        })

    } catch (error) {
        await deletarArquivo(req.file)
        console.error('Erro ao adicionar a imagem', error)
        return res.status(500).json({error: `ocorreu um erro ao adicionar a imagem ${error.message}`})
    }
}

const controllerListarImagensProdutos = async (req, res) => {
    const { produtoId } = req.params

    try {
        const produto = await queryBuscaFacilDoProduto(produtoId)

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado'})
        }

        const imagens = await queryListarImagensProduto(produtoId)

        return res.status(200).json({ mensagem: 'Imagens do produto', imagens})
    } catch (error) {
        console.error('Erro ao listar as imagens', error)
        return res.status(500).json({error: `ocorreu um erro ao listar as imagens ${error.message}`})
    }
}

const controllerDeletarImagemProduto = async (req, res) => {
    const { imagemId } = req.params

    try {
        const usuarioId = req.usuario?.id
        const tipoUsuario = req.usuario?.tipo

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuário não encontrado'})
        }

        if (tipoUsuario !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const imagem = await queryBuscarImagemPeloId(imagemId)

        if (!imagem) {
            return res.status(404).json({ error: 'Imagem não encontrada'})
        }

        await queryDeletarImagem(imagemId)

        await deletarArquivoPorUrl(imagem.url)

        return res.status(200).json({ mensagem: 'Imagem deletada'})
    } catch (error) {
        console.error('Erro ao deletar a imagem', error)
        return res.status(500).json({error: `ocorreu um erro ao deletar a imagem ${error.message}`})
    }
}

module.exports = {
    controllerAdicionarImagemProduto,
    controllerListarImagensProdutos,
    controllerDeletarImagemProduto
}