import { RecebimentoMaterial } from '../models/RecebimentoMaterial.js';
import { Material } from '../models/Material.js';
import { Colaborador } from '../models/Colaborador.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

class RecebimentoMaterialService {
    async createRecebimentoMaterial(data) {
        const { peso, volume, idMaterial, cpfColaborador } = data;

        // Validation 1: Check if material exists
        const material = await Material.findByPk(idMaterial);
        if (!material) {
            throw new Error('Material não encontrado.');
        }

        // Validation 2: Check if colaborador exists
        const colaborador = await Colaborador.findByPk(cpfColaborador);
        if (!colaborador) {
            throw new Error('Colaborador não encontrado.');
        }

        // Validation 3: Check monthly limit per client (100 kg)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const monthlyRecebimentos = await RecebimentoMaterial.findAll({
            where: {
                cpfColaborador: cpfColaborador,
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lte]: endOfMonth
                }
            }
        });

        const totalMonthlyPeso = monthlyRecebimentos.reduce((sum, recebimento) => sum + recebimento.peso, 0);
        const newTotalMonthlyPeso = totalMonthlyPeso + peso;

        if (newTotalMonthlyPeso > 100) {
            throw new Error(`Limite mensal de recebimento para este colaborador excedido. Total recebido este mês: ${totalMonthlyPeso} kg.`);
        }

        // Validation 4: Check daily total limit (2000 kg)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dailyRecebimentos = await RecebimentoMaterial.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        const totalDailyPeso = dailyRecebimentos.reduce((sum, recebimento) => sum + recebimento.peso, 0);
        const newTotalDailyPeso = totalDailyPeso + peso;

        if (newTotalDailyPeso > 2000) {
            throw new Error(`Limite diário total de recebimento excedido. Total recebido hoje: ${totalDailyPeso} kg.`);
        }

        // Validation 5: Check if peso and volume are valid
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

    // Add other service methods (update, delete) as needed
}

export { RecebimentoMaterialService };