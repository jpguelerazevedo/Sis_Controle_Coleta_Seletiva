import { Op, Sequelize } from 'sequelize';
import { Material } from '../models/Material.js';
import { PedidoColeta } from '../models/PedidoColeta.js';
import { RecebimentoMaterial } from '../models/RecebimentoMaterial.js';
import { EnvioMaterial } from '../models/EnvioMaterial.js';
import { Cliente } from '../models/Cliente.js';
import { Colaborador } from '../models/Colaborador.js';
import { Endereco } from '../models/Endereco.js';
import { Bairro } from '../models/Bairro.js';
import { Pessoa } from '../models/Pessoa.js';

class Reports {
    // 1. Listar materiais coletados por data
    async getCollectedMaterials(startDate, endDate) {
        return await RecebimentoMaterial.findAll({
            include: [{
                    model: Material,
                    as: 'material',
                    attributes: ['nome', 'nivelDeRisco']
                },
                {
                    model: Cliente,
                    as: 'cliente',
                    include: [{
                        model: Pessoa,
                        as: 'pessoa',
                        attributes: ['nome']
                    }]
                },
                {
                    model: Colaborador,
                    as: 'colaborador',
                    include: [{
                        model: Pessoa,
                        as: 'pessoa',
                        attributes: ['nome']
                    }]
                }
            ],
            attributes: [
                'idRecebimento',
                'peso',
                'volume',
                'createdAt'
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    // 2. Quantitativo de pedidos por bairro
    async getCollectionOrdersByNeighborhood(startDate, endDate) {
        return await PedidoColeta.findAll({
            include: [{
                model: Cliente,
                as: 'cliente',
                include: [{
                    model: Endereco,
                    as: 'endereco',
                    include: [{
                        model: Bairro,
                        as: 'bairro',
                        attributes: ['id_bairro', 'nome']
                    }]
                }]
            }],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('id_pedido')), 'total_pedidos']
            ],
            group: ['cliente.endereco.bairro.id_bairro'],
            order: [
                [Sequelize.literal('total_pedidos'), 'DESC']
            ]
        });
    }

    // 3. Listar todos os pedidos de coleta
    async getAllCollectionOrders(startDate, endDate) {
        return await PedidoColeta.findAll({
            include: [{
                    model: Material,
                    as: 'material',
                    attributes: ['nome']
                },
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['cpf']
                }
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    // 4. Listar materiais disponíveis no depósito
    async getAvailableMaterials(depositoId) {
        return await Material.findAll({
            where: {
                peso: {
                    [Op.gt]: 0
                }
            },
            order: [
                ['peso', 'DESC']
            ]
        });
    }

    // 5. Listar materiais enviados
    async getSentMaterials(startDate, endDate, materialType) {
        return await EnvioMaterial.findAll({
            include: [{
                model: Material,
                as: 'material',
                where: materialType ? { nome: materialType } : {}
            }],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                'idMaterial', [Sequelize.fn('SUM', Sequelize.col('peso_enviado')), 'total_peso'],
                [Sequelize.fn('COUNT', Sequelize.col('id_envio')), 'total_envios']
            ],
            group: ['idMaterial'],
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    // 6. Listar clientes cadastrados
    async getRegisteredClients(startDate, endDate) {
        return await Cliente.findAll({
            include: [{
                    model: Pessoa,
                    as: 'pessoa',
                    attributes: ['nome', 'email', 'telefone']
                },
                {
                    model: Endereco,
                    as: 'endereco',
                    include: [{
                        model: Bairro,
                        as: 'bairro'
                    }]
                }
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }
}

export default new Reports();