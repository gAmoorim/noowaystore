const fs = require('fs/promises')
const path = require('path')

const deletarArquivo = async (file) => {
    if (!file) return

    try {
        await fs.unlink(file.path)
    } catch (err) {
        console.error('Erro ao deletar arquivo:', err.message)
    }
}

const deletarArquivoPorUrl = async (url) => {
    if (!url) return

    try {
        const nomeArquivo = url.split('/uploads/')[1]

        if (!nomeArquivo) return

        const caminhoArquivo = path.resolve(__dirname, '..', 'uploads', nomeArquivo)

        await fs.unlink(caminhoArquivo)
    } catch (error) {
        console.error('Erro ao deletar arquivo:', error.message)
    }
}

module.exports = {
    deletarArquivo,
    deletarArquivoPorUrl
}