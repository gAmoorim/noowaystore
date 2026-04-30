const axios = require('axios')

async function buscarCEP(cep) {
    try {
        const cepLimpo = cep.replace(/\D/g, '')

        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)

        if (response.data.erro) {
            return null
        }

        return response.data
    } catch (error) {
        console.error('Erro ao buscar CEP:', error.message)
        return null
    }
}

module.exports = {
    buscarCEP
}