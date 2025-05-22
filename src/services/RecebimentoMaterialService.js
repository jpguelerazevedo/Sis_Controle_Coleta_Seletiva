import { RecebimentoMaterial } from '../models/RecebimentoMaterial.js';
import { Material } from '../models/Material.js';
import { Colaborador } from '../models/Colaborador.js';
import { Cliente } from '../models/Cliente.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

class RecebimentoMaterialService {
    async createRecebimentoMaterial(data) {
        const { peso, volume, idMaterial, cpfCliente, cpfColaborador } = data;

        // Validation 1: Check if material exists
        const material = await Material.findByPk(idMaterial);
        if (!material) {
            throw new Error('Material não encontrado.');
        }

        // Validation 2: Check if cliente exists
        const cliente = await Cliente.findByPk(cpfCliente);
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        // Validation 3: Check if colaborador exists
        const colaborador = await Colaborador.findByPk(cpfColaborador);
        if (!colaborador) {
            throw new Error('Colaborador não encontrado.');
        }

        // Validation 4: Check monthly limit per client (100 kg)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Busca todos os recebimentos do cliente no mês
        const monthlyRecebimentos = await RecebimentoMaterial.findAll({
            where: {
                cpfCliente: cpfCliente, // Agora verifica por cliente
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lte]: endOfMonth
                }
            },
            include: [
                { association: 'material' },
                { association: 'cliente' }
            ]
        });

        // Soma o peso total recebido pelo cliente no mês
        const totalMonthlyPeso = monthlyRecebimentos.reduce((sum, recebimento) => sum + recebimento.peso, 0);
        const newTotalMonthlyPeso = totalMonthlyPeso + peso;

        if (newTotalMonthlyPeso > 100) {
            throw new Error(`Limite mensal de recebimento para este cliente excedido. Total recebido este mês: ${totalMonthlyPeso} kg. Limite: 100 kg.`);
        }

        // Validation 5: Check daily total limit (2000 kg = 2 toneladas)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Busca todos os recebimentos do dia, independente do cliente ou material
        const dailyRecebimentos = await RecebimentoMaterial.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        // Soma o peso total de todos os materiais recebidos no dia
        const totalDailyPeso = dailyRecebimentos.reduce((sum, recebimento) => sum + recebimento.peso, 0);
        const newTotalDailyPeso = totalDailyPeso + peso;

        if (newTotalDailyPeso > 2000) {
            throw new Error(`Limite diário total de recebimento excedido. Total recebido hoje: ${totalDailyPeso} kg. Limite: 2000 kg (2 toneladas).`);
        }

        // Validation 6: Check if peso and volume are valid
        if (peso <= 0) {
            throw new Error('Peso deve ser maior que zero.');
        }
        if (volume <= 0) {
            throw new Error('Volume deve ser maior que zero.');
        }

        // Create recebimento and update material in a transaction
        const t = await Material.sequelize.transaction();
        try {
            const recebimentoMaterial = await RecebimentoMaterial.create({
                idRecebimento: uuidv4(),
                peso,
                volume,
                idMaterial,
                cpfCliente,
                cpfColaborador
            }, { transaction: t });

            // Update material's weight and volume
            await Material.update({
                peso: material.peso + peso,
                volume: material.volume + volume
            }, {
                where: { idMaterial },
                transaction: t
            });

            await t.commit();
            return recebimentoMaterial;
        } catch (error) {
            await t.rollback();
            throw new Error('Erro ao criar recebimento de material: ' + error.message);
        }
    }

    async findAllRecebimentosMaterial() {
        const recebimentosMaterial = await RecebimentoMaterial.findAll({
            include: [
                { association: 'material' },
                { association: 'colaborador' }
            ]
        });
        return recebimentosMaterial;
    }

    async findRecebimentoMaterialByPk(idRecebimento) {
        const recebimentoMaterial = await RecebimentoMaterial.findByPk(idRecebimento, {
            include: [
                { association: 'material' },
                { association: 'colaborador' }
            ]
        });
        return recebimentoMaterial;
    }

    async delete(idRecebimento) {
        try {
            const recebimento = await RecebimentoMaterial.findByPk(idRecebimento);
            if (!recebimento) {
                throw new Error('Recebimento de material não encontrado.');
            }

            // Inicia uma transação para garantir a consistência dos dados
            const t = await Material.sequelize.transaction();
            try {
                // Atualiza o estoque do material
                const material = await Material.findByPk(recebimento.idMaterial);
                if (material) {
                    await Material.update({
                        peso: material.peso - recebimento.peso,
                        volume: material.volume - recebimento.volume
                    }, {
                        where: { idMaterial: recebimento.idMaterial },
                        transaction: t
                    });
                }

                // Remove o recebimento
                await recebimento.destroy({ transaction: t });
                await t.commit();

                return { message: 'Recebimento de material deletado com sucesso.' };
            } catch (error) {
                await t.rollback();
                throw new Error('Erro ao deletar recebimento de material: ' + error.message);
            }
        } catch (error) {
            throw new Error('Erro ao deletar recebimento de material: ' + error.message);
        }
    }

    // Add other service methods (update, delete) as needed
}

export { RecebimentoMaterialService };