import { PedidoColeta } from '../models/PedidoColeta.js';
import { Cliente } from '../models/Cliente.js';
import { Colaborador } from '../models/Colaborador.js';
import { Material } from '../models/Material.js';
import { Op } from 'sequelize';

class PedidoColetaService {
    async createPedidoColeta(data) {
        const { tipo, peso, volume, idMaterial, cpfCliente, cpfColaborador } = data;

        // Validation 1: Check if cliente exists
        const cliente = await Cliente.findByPk(cpfCliente);
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        // Validation 2: Check if colaborador exists
        const colaborador = await Colaborador.findByPk(cpfColaborador);
        if (!colaborador) {
            throw new Error('Colaborador não encontrado.');
        }

        // Validation 3: Check if material exists
        const material = await Material.findByPk(idMaterial);
        if (!material) {
            throw new Error('Material não encontrado.');
        }

        // Validation 4: Check if colaborador already requested collection for this client today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingPedido = await PedidoColeta.findOne({
            where: {
                cpfCliente,
                cpfColaborador,
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        if (existingPedido) {
            throw new Error('Colaborador já solicitou uma coleta para este cliente hoje.');
        }

        // Validation 5: Check if peso and volume are valid
        if (peso <= 0) {
            throw new Error('Peso deve ser maior que zero.');
        }
        if (volume <= 0) {
            throw new Error('Volume deve ser maior que zero.');
        }

        const pedidoColeta = await PedidoColeta.create({
            tipo,
            peso,
            volume,
            idMaterial,
            cpfCliente,
            cpfColaborador
        });

        return pedidoColeta;
    }

    async findAllPedidosColeta() {
        const pedidosColeta = await PedidoColeta.findAll({
            include: [
                { association: 'material' },
                { association: 'cliente' },
                { association: 'colaborador' }
            ]
        });
        return pedidosColeta;
    }

    async findPedidoColetaByPk(idPedido) {
        const pedidoColeta = await PedidoColeta.findByPk(idPedido, {
            include: [
                { association: 'material' },
                { association: 'cliente' },
                { association: 'colaborador' }
            ]
        });
        return pedidoColeta;
    }

    async findAll() {
        try {
            const pedidos = await PedidoColeta.findAll({
                include: [
                    { association: 'cliente' },
                    { association: 'colaborador' }
                ]
            });
            return pedidos;
        } catch (error) {
            throw new Error('Erro ao buscar pedidos de coleta: ' + error.message);
        }
    }

    async delete(idPedido) {
        try {
            const pedido = await PedidoColeta.findByPk(idPedido);
            if (!pedido) {
                throw new Error('Pedido de coleta não encontrado.');
            }
            await pedido.destroy();
            return { message: 'Pedido de coleta deletado com sucesso.' };
        } catch (error) {
            throw new Error('Erro ao deletar pedido de coleta: ' + error.message);
        }
    }

    // Add other service methods (update, delete) as needed
}

export { PedidoColetaService };