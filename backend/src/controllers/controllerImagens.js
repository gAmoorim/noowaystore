const cloudinary = require('cloudinary').v2
const { queryAdicionarImagemProduto, queryDesmarcarImagemPrincipal, queryListarImagensProduto, queryBuscarImagemPeloId, queryDeletarImagem } = require("../database/querys/queryImagens")
const { queryBuscaFacilDoProduto } = require("../database/querys/queryProdutos")

const controllerAdicionarImagemProduto = async (req, res) => {
    const { produtoId } = req.params

    try {
        const usuarioId = req.usuario?.id
        const tipoUsuario = req.usuario?.tipo

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario nao encontrado'})
        }

        const { url, img_principal } = req.body
        const principal = img_principal === true || img_principal === 'true'

        if (tipoUsuario !== 'admin') {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename)
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const produto = await queryBuscaFacilDoProduto(produtoId)

        if (!produto) {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename)
            return res.status(404).json({ error: 'Produto nao encontrado'})
        }

        if (!req.file && !url) {
            return res.status(400).json({ error: 'Imagem nao enviada'})
        }

        const urlImagem = req.file ? req.file.path : url

        if (principal) {
            await queryDesmarcarImagemPrincipal(produtoId)
        }

        const [imagemProduto] = await queryAdicionarImagemProduto(produtoId, urlImagem, principal)

        return res.status(201).json({
            mensagem: 'Imagem adicionada com sucesso',
            imagem: imagemProduto
        })

    } catch (error) {
        if (req.file) await cloudinary.uploader.destroy(req.file.filename)
        console.error('Erro ao adicionar a imagem', error)
        return res.status(500).json({error: `ocorreu um erro ao adicionar a imagem ${error.message}`})
    }
}

const controllerListarImagensProdutos = async (req, res) => {
    const { produtoId } = req.params

    try {
        const produto = await queryBuscaFacilDoProduto(produtoId)

        if (!produto) {
            return res.status(404).json({ error: 'Produto nao encontrado'})
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
            return res.status(401).json({ error: 'Usuario nao encontrado'})
        }

        if (tipoUsuario !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado'})
        }

        const imagem = await queryBuscarImagemPeloId(imagemId)

        if (!imagem) {
            return res.status(404).json({ error: 'Imagem nao encontrada'})
        }

        const urlParts = imagem.url.split('/')
        const fileName = urlParts[urlParts.length - 1].split('.')[0]
        const publicId = `noowaystore/${fileName}`

        await cloudinary.uploader.destroy(publicId)
        await queryDeletarImagem(imagemId)

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