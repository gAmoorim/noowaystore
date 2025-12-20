const bcrypt = require('bcrypt')
const { validarEmail, validarTelefone } = require("../utils/validations")
const { queryCadastrarNovoUsuario, queryBuscarUsuarioPeloEmail, queryListarUsuarios, queryBuscarUsuarioPeloId, queryVerificarTelefoneCadastrado, queryAtualizarUsuario, queryDeletarUsuario } = require('../database/querys/queryUsuarios')

const controllerCadastrarUsuario = async (req,res) => {
    const { nome, email, senha, telefone, tipo } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    if (senha.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres'})
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Formato do email inválido' })
    }

    if (telefone) {
        if (!validarTelefone(telefone)) {
            return res.status(400).json({ error: 'Formato do telefone inválido' })
        }

        const telefoneInformado = await queryVerificarTelefoneCadastrado(telefone)

        if (telefoneInformado) {
            return res.status(400).json({ error: 'Telefone já cadastrado' })
        }
    }

    try {
        const verificarEmailExistente = await queryBuscarUsuarioPeloEmail(email)

        if (verificarEmailExistente) {
            return res.status(400).json({ error: 'Já existe um usuário cadastrado com esse email'})
        }

        const senha_hash = await bcrypt.hash(senha, 10)

        const usuario = await queryCadastrarNovoUsuario(nome, email, senha_hash, telefone, tipo)

        return res.status(201).json({ mensagem: 'Usuário criado',
            usuario: usuario
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar o usuário:", error)
        return res.status(500).json({ error: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

const controllerListarUsuarios = async (req, res) => {
    const { tipo } = req.usuario

    if (tipo !== 'admin') {
        return res.status(403).json({ error: 'acesso negado'})
    }

    try {
        const usuarios = await queryListarUsuarios()

        if (!usuarios) {
            return res.status(404).json({ error: 'Nenhum usuário encontrado'})
        }

        return res.status(200).json(usuarios)
    } catch (error) {
        console.error("Ocorreu um erro ao listar os usuários:", error)
        return res.status(500).json({ error: `Erro ao listar os usuários: ${error.message}`})
    }
}

const controllerObterUsuario = async (req, res) => {
    const {usuarioId} = req.params

    if (!usuarioId) {
        return res.status(400).json({ error: 'Não foi possível obter o id'})
    }

    try {
        const usuarioLogado = req.usuario

        if (String(usuarioLogado.id) !== String(usuarioId) && usuarioLogado.tipo !== 'admin') {
            return res.status(403).json({ error: 'Somente o próprio usuario ou admin pode obter acesso'})
        }
        
        const usuario = await queryBuscarUsuarioPeloId(usuarioId)

        if (!usuario) {
            return res.status(404).json({ error: 'Nenhum usuário encontrado'})
        }

        return res.status(200).json({ mensagem: 'Usuário encontrado', usuario})
    } catch (error) {
        console.error('Ocorreu um erro ao obter o usuario', error)
        return res.status(500).json({ error: `ocorreu um erro ao obter o usuário ${error.message}`})
    }
    
}

const controllerAtualizarUsuario = async (req, res) => {
    let { nome, email, senha, telefone } = req.body

    if (!nome && !email && !senha && !telefone) {
        return res.status(400).json({ error: 'Informe ao menos um campo para ser atualizado'})
    }

    if (email && !validarEmail(email)) {
        return res.status(400).json({ error: 'Formato de email inválido'})
    }

    const usuarioId = req.usuario.id

    if (!usuarioId) {
        return res.status(400).json({ error: 'Não foi possível obter o id do usuário'})
    }

    try {
        if (senha) {
            if (senha.length < 6) {
                return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres'})
            }
            senha = await bcrypt.hash(senha, 10)
        }

        if (email) {
            const emailExistente = await queryBuscarUsuarioPeloEmail(email)

            if (emailExistente) {
                return res.status(400).json({ error: 'O email já existe'})
            }
        }

        if (telefone) {
            if (!validarTelefone(telefone)) {
                return res.status(400).json({ error: 'Formato do telefone inválido' })
            }

            const telefoneInformado = await queryVerificarTelefoneCadastrado(telefone)

            if (telefoneInformado) {
                return res.status(400).json({ error: 'Telefone já cadastrado' })
            }
        }

        const usuarioAtualizado = await queryAtualizarUsuario(nome, email, senha, telefone, usuarioId)
        
        return res.status(200).json({ mensagem: 'Usuário atualizado', usuarioAtualizado})
    } catch (error) {
        console.error('Ocorreu um erro ao atualizar o usuario', error)
        return res.status(500).json({ error: `ocorreu um erro ao atualizar o usuário ${error.message}`})
    }

}

const controllerDeletarUsuario = async (req, res) => {
    const {usuarioId} = req.params

    if (!usuarioId) {
        return res.status(400).json({ error: 'informe o id do usuario para ser deletado'})
    }

    try {
        const usuarioLogado = req.usuario

        if (!usuarioLogado.id) {
            return res.status(400).json({ error: 'Não foi possível obter o id do usuario logado'})
        }

        if (String(usuarioLogado.id) !== String(usuarioId) && usuarioLogado.tipo !== 'admin') {
            return res.status(403).json({ error: 'Somente o próprio usuario ou admin pode obter acesso'})
        }
        
        await queryDeletarUsuario(usuarioId)

        return res.status(204).json({ mensagem: 'Usuário deletado'})
    } catch (error) {
        console.error('Ocorreu um erro ao deletar o usuario', error)
        return res.status(500).json({ error: `ocorreu um erro ao deletar o usuário ${error.message}`})
    }
} 

module.exports = {
    controllerCadastrarUsuario,
    controllerListarUsuarios,
    controllerObterUsuario,
    controllerAtualizarUsuario,
    controllerDeletarUsuario
}