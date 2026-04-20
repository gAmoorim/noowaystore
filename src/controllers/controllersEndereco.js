const { queryCriarEndereco, queryListarEnderecosUsuarioLogado } = require("../database/querys/queryEnderecos")
const { buscarCEP } = require("../utils/services")
const { validarCEP } = require("../utils/validations")

const controllerCadastrarEndereco = async (req, res) => {
    const { endereco, cidade, estado, cep} = req.body

    //if (!endereco || !cidade || !estado || !cep) {
   //     return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.'})
   // }

    if (!validarCEP(cep)) {
        return res.status(400).json({ error: 'Formato do CEP inválido.'})
    }

    try {
        const dadosCEP = await buscarCEP(cep)

        if (!dadosCEP) {
            return res.status(400).json({ error: 'CEP não encontrado'})
        }

        const enderecoFinal = dadosCEP.logradouro || endereco
        const cidadeFinal = dadosCEP.localidade || cidade
        const estadoFinal = dadosCEP.uf || estado

        const usuarioId = req.usuario.id 

        const novoEndereco = await queryCriarEndereco(usuarioId, enderecoFinal, cidadeFinal, estadoFinal, cep)

        return res.status(201).json({
            mensagem: 'Endereço criado com sucesso',
            endereco: novoEndereco
        })
    } catch (error) {
        console.error('Erro ao criar o endereço', error)
        return res.status(500).json({ error: `ocorreu um erro ao criar o endereço ${error.message}`})
    }
}

const controllerListarEnderecos = async (req, res) => {
    try {
        const usuarioId = req.usuario.id

        if (!usuarioId) {
            return res.status(400).json({ error: 'Erro ao obter o usuario logado'})
        }

        const enderecos = await queryListarEnderecosUsuarioLogado(usuarioId)

        if (!enderecos) {
            return res.status(404).json({ error: 'Nenhum endereço encontrado'})
        }

        return res.status(200).json({ mensagem: 'Endereços encontrados', enderecos})
    } catch (error) {
        console.error('Erro ao listar endereços', error)
        return res.status(500).json({ error: `ocorreu um erro ao listar endereços ${error.message}`})
    }
}

module.exports = {
    controllerCadastrarEndereco,
    controllerListarEnderecos
}