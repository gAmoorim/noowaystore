const bcrypt = require('bcrypt')
const { validarEmail } = require("../utils/validations")
const { queryCadastrarNovoUsuario, queryBuscarUsuarioPeloEmail } = require('../database/querys/queryUsuarios')


// CONFIGURAR DE ACORDO COM O NOVO DB 


const controllerCadastrarUsuario = async (req,res) => {
    const { nome, email, senha, telefone, tipo } = req.body

    if (!nome || !email || !senha || !tipo || !telefone) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    if (senha.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres'})
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Formato do email inválido' })
    }

    try {
        const verificarEmailExistente = await queryBuscarUsuarioPeloEmail(email)

        if (verificarEmailExistente) {
            return res.status(400).json({ error: 'Já existe um usuário cadastrado com esse email'})
        }

        const senha_hash = await bcrypt.hash(senha, 10)

        await queryCadastrarNovoUsuario(nome, email, senha_hash, telefone, tipo)

        return res.status(201).json({ mensagem: 'Usuário criado',
            usuario: {nome, email, tipo}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar o usuário:", error)
        return res.status(500).json({ error: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

module.exports = {
    controllerCadastrarUsuario
}