import { PedidoColetaService } from '../services/PedidoColetaService.js';

const pedidoColetaService = new PedidoColetaService();

class PedidoColetaController {
    async create(req, res) {
        try {
            const { tipo, peso, volume, idMaterial, cpfCliente, cpfColaborador } = req.body;

            // Validação dos campos obrigatórios
            if (!tipo || tipo.trim() === "") {
                return res.status(400).json({ error: 'Tipo do pedido não pode estar vazio' });
            }
            if (!peso || peso <= 0) {
                return res.status(400).json({ error: 'Peso deve ser maior que zero' });
            }
            if (!volume || volume <= 0) {
                return res.status(400).json({ error: 'Volume deve ser maior que zero' });
            }
            if (!idMaterial) {
                return res.status(400).json({ error: 'Material deve ser especificado' });
            }
            if (!cpfCliente || cpfCliente.trim() === "") {
                return res.status(400).json({ error: 'CPF do cliente não pode estar vazio' });
            }
            if (!cpfColaborador || cpfColaborador.trim() === "") {
                return res.status(400).json({ error: 'CPF do colaborador não pode estar vazio' });
            }

            const pedidoColeta = await pedidoColetaService.createPedidoColeta(req.body);
            res.status(201).json(pedidoColeta);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Cliente não cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Colaborador não cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Material não encontrado')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const pedidos = await pedidoColetaService.findAll();
            res.status(200).json(pedidos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const { idPedido } = req.params;
            const pedidoColeta = await pedidoColetaService.findPedidoColetaByPk(idPedido);

            if (!pedidoColeta) {
                return res.status(404).json({ error: 'Pedido de coleta não encontrado.' });
            }

            res.status(200).json(pedidoColeta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { idPedido } = req.params;
            const result = await pedidoColetaService.delete(idPedido);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

export { PedidoColetaController };