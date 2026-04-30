const { queryInserirPedido, queryInserirItensPedido, queryAtualizarEstoque, queryListarPedidosUsuario, queryBuscarProdutoPorEstoqueId, queryAtualizarEstoquePeloid, queryListarTodosPedidos, queryBuscarPedidoPorId, queryAtualizarStatusPedido, queryListarItensPedido } = require("../database/querys/queryPedidos")
const { queryBuscarProdutoPorId } = require("../database/querys/queryProdutos")

const controllerCriarPedido = async (req, res) => {
    const { itens } = req.body 

    const usuarioLogado = req.usuario

    if (!usuarioLogado) {
        return res.status(401).json({ mensagem: "Não autenticado" });
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ mensagem: "Itens inválidos" });
    }

    const itensValidados = []
    try {

        for (const item of itens) {
            const { estoque_id, quantidade } = item

            if (!estoque_id || !quantidade || quantidade < 0) {
                return res.status(400).json({ mensagem: 'Cada item deve ter estoque_id e quantidade válida'})
            }

            const produto = await queryBuscarProdutoPorEstoqueId(estoque_id)

            if (!produto) {
                return res.status(400).json({ mensagem: 'Produto ou estoque não encontrado'})
            }

            if (quantidade > produto.estoque) {
                return res.status(400).json({mensagem: 'Estoque insuficiente'})
            }

            itensValidados.push({
                estoque_id,
                quantidade,
                preco_unitario: produto.preco
            })
        }
        
        const pedido = await queryInserirPedido(usuarioLogado.id)

        const itensPedido = itensValidados.map(item => ({
            pedido_id: pedido.id,
            estoque_id: item.estoque_id,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario
        }))

        await queryInserirItensPedido(itensPedido)

        for (const item of itensValidados) {
            await queryAtualizarEstoquePeloid(item.estoque_id, item.quantidade)
        }

        return res.status(201).json({ mensagem: 'Pedido criado com sucesso', pedido})
    } catch (error) {
        console.error('Erro ao criar pedido ', error)
        return res.status(500).json({ error: `ocorreu um erro ao criar pedido ${error.message}`})
    }
}

const controllerListarPedidosUsuario = async (req, res) => {
    try {
        const usuarioId = req.usuario.id

        if (!usuarioId) {
            return res.status(401).json({ error: 'Não autenticado'})
        }

        const pedidosUsuario = await queryListarPedidosUsuario(usuarioId)

        return res.status(200).json({ mensagem: 'Pedidos do usuario', pedidos: pedidosUsuario})
    } catch (error) {
        console.error('Erro ao listar pedidos do usuário', error)
        return res.status(500).json({ error: `ocorreu um erro ao listar pedidos ${error.message}`})
    }
}

const controllerListarTodosPedidos = async (req, res) => {
    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso Negado'})
    }

    try {
        const pedidos = await queryListarTodosPedidos()

        if (!pedidos) {
            return res.status(404).json({ error: 'Nenhum pedido achado'})
        }

        return res.status(200).json({ mensagem: 'Todos os pedidos', pedidos })
    } catch (error) {
        console.error('Erro ao listar pedidos ', error)
        return res.status(500).json({ error: `ocorreu um erro ao listar pedidos ${error.message}`})
    }
    
}

const controllerAtualizarStatusPedido = async (req, res) => {
    const { pedidoId } = req.params
    const { status } = req.body

    const usuarioLogado = req.usuario

    if (usuarioLogado.tipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado'})
    }

    try {
        const pedido = await queryBuscarPedidoPorId(pedidoId)

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado'})
        }

        const statusAtual = pedido.status

        const transicoes = {
            pendente: ['enviado', 'cancelado'],
            enviado: ['concluido'],
            concluido: [],
            cancelado: []
        }

        if (!transicoes[statusAtual]) {
            return res.status(400).json({ mensagem: 'Status atual inválido'})
        }

        if (!transicoes[statusAtual].includes(status)) {
            return res.status(400).json({ error: `Não é possível mudar ${statusAtual} para ${status}`})
        }

        await queryAtualizarStatusPedido(pedidoId, status)
        
        return res.status(200).json({ mensagem: 'Status atualizado com sucesso'})
    } catch (error) {
        console.error('Erro ao atualizar o status', error)
        return res.status(500).json({ error: `ocorreu um erro ao atualizar o status ${error.message}`})
    }
}

const controllerListarItensPedido = async (req, res) => {
    const { pedidoId } = req.params
    const usuarioLogado = req.usuario

    try {
        const pedido = await queryBuscarPedidoPorId(pedidoId)

        if (!pedido) {
            return res.status(404).json({ mensagem: 'Pedido não encontrado'})
        }

        const eDono = pedido.usuario_id === usuarioLogado.id
        const eAdmin = usuarioLogado.tipo === 'admin'

        if (!eAdmin && !eDono) {
            return res.status(403).json({ mensagem: 'Acesso negado'})
        }

        const itens = await queryListarItensPedido(pedidoId)

        const total = itens.reduce(
            (acc, item) => acc + Number(item.quantidade) * Number(item.preco_unitario), 0
        ).toFixed(2)

        return res.status(200).json({
            total,
            quantidade_itens: itens.length,
            itens
        })
    } catch (error) {
        console.error('Erro ao listar os itens pedidos', error)
        return res.status(500).json({ error: `ocorreu um erro ao listar os itens pedidos ${error.message}`})
    }
}

module.exports = {
    controllerCriarPedido,
    controllerListarPedidosUsuario,
    controllerListarTodosPedidos,
    controllerAtualizarStatusPedido,
    controllerListarItensPedido
}