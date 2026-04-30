const { queryCriarEndereco, queryListarEnderecosUsuarioLogado, queryAtualizarEndereco, queryVerificarEnderecoPertencente, queryDeletarEndereco } = require("../database/querys/queryEnderecos")
const { buscarCEP } = require("../utils/services")
const { validarCEP } = require("../utils/validations")

const controllerCadastrarEndereco = async (req, res) => {
    const { cep, numero, complemento, logradouro, cidade, estado } = req.body

    if (!numero || !cep) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.'})
    }

    if (!validarCEP(cep)) {
        return res.status(400).json({ error: 'Formato do CEP inválido.'})
    }

    try {
        const dadosCEP = await buscarCEP(cep)

        if (!dadosCEP) {
            return res.status(400).json({ error: 'CEP não encontrado'})
        }

        const logradouroFinal = dadosCEP.logradouro || logradouro
        const cidadeFinal = dadosCEP.localidade || cidade
        const estadoFinal = dadosCEP.uf || estado

        if (!logradouroFinal || !cidadeFinal || !estadoFinal) {
            return res.status(400).json({
                error: 'Dados de endereço incompletos. Informe manualmente os campos faltantes.'
            })
        }

        const usuarioId = req.usuario?.id

        if (!usuarioId) {
            return res.status(400).json({ error: 'Usuário não autenticado'})
        }

        const novoEndereco = await queryCriarEndereco(
            usuarioId, logradouroFinal, numero, complemento || null,
            cidadeFinal, estadoFinal, cep
        )

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

const controllerAtualizarEndereco = async (req, res) => {
    const {cep, numero, complemento, logradouro, cidade, estado} = req.body

    if (!cep && !numero && !complemento && !logradouro && !cidade && !estado) {
        return res.status(400).json({ error: 'Informe ao menos um campo para atualizar' })
    }

    const { enderecoId } = req.params

    if (cep && !validarCEP(cep)) {
        return res.status(400).json({ error: 'Formato do CEP inválido.'})
    }

    try {
        const usuarioId = req.usuario?.id
        
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuário não autenticado'})
        }

        const verificarEndereco = await queryVerificarEnderecoPertencente(usuarioId, enderecoId)

        if (!verificarEndereco) {
            return res.status(404).json({ error: 'Endereço não existe ou não encontrado'})
        }

        const enderecoAtualizado = await queryAtualizarEndereco(enderecoId, cep, numero, complemento, logradouro, cidade, estado)

        return res.status(200).json({ mensagem: 'Endereço atualizado', endereco: enderecoAtualizado})
    } catch (error) {
        console.error('Erro ao atualizar o endereço', error)
        return res.status(500).json({ error: `ocorreu um erro ao atualizar o endereço ${error.message}`})
    }
}

const controllerDeletarEndereco = async (req, res) => {
    const { enderecoId } = req.params

    try {
        const usuarioId = req.usuario?.id

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuário não encontrado'})
        }
        
        const verificarEndereco = await queryVerificarEnderecoPertencente(usuarioId, enderecoId)

        if (!verificarEndereco) {
            return res.status(404).json({ error: 'Endereço não existe ou não encontrado'})
        }

        await queryDeletarEndereco(enderecoId)

        return res.status(200).json({ mensagem: 'Endereço deletado'})
    } catch (error) {
        console.error('Erro ao deletar o endereço', error)
        return res.status(500).json({ error: `ocorreu um erro ao deletar o endereço ${error.message}`})
    }
}

module.exports = {
    controllerCadastrarEndereco,
    controllerListarEnderecos,
    controllerAtualizarEndereco,
    controllerDeletarEndereco
}