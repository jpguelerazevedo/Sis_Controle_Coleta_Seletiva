import { RecebimentoMaterial } from '../models/RecebimentoMaterial.js';
import { Material } from '../models/Material.js';
import { Colaborador } from '../models/Colaborador.js';
import { Cliente } from '../models/Cliente.js';
import { Op } from 'sequelize';

class RecebimentoMaterialService {
    async createRecebimentoMaterial(data) {
        // Se receber um array, usa o método de criação em lote
        if (Array.isArray(data)) {
            return this.createMultipleRecebimentosMaterial(data);
        }

        console.log('📦 Iniciando criação de recebimento:', data);
        const { peso, volume, idMaterial, cpfCliente, cpfColaborador } = data;

        // Validation 1: Check if material exists
        const material = await Material.findByPk(idMaterial);
        if (!material) {
            throw new Error('Material não encontrado.');
        }
        console.log('✅ Material encontrado:', material.nome);

        // Validation 2: Check if cliente exists
        const cliente = await Cliente.findByPk(cpfCliente);
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }
        console.log('✅ Cliente encontrado:', cliente.nome);

        // Validation 3: Check if colaborador exists
        const colaborador = await Colaborador.findByPk(cpfColaborador);
        if (!colaborador) {
            throw new Error('Colaborador não encontrado.');
        }
        console.log('✅ Colaborador encontrado:', colaborador.nome);

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
                cpfCliente: cpfCliente,
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lte]: endOfMonth
                }
            }
        });

        // Soma o peso total recebido pelo cliente no mês
        const totalMonthlyPeso = monthlyRecebimentos.reduce((sum, recebimento) => sum + recebimento.peso, 0);
        const newTotalMonthlyPeso = totalMonthlyPeso + peso;

        console.log('📊 Estatísticas mensais:', {
            totalMonthlyPeso,
            newTotalMonthlyPeso,
            peso
        });

        if (peso > 100) {
            throw new Error(`Limite de envio 100kg`);
        } else if (newTotalMonthlyPeso > 100) {
            throw new Error(`Limite mensal de recebimento para este cliente excedido. Total recebido este mês: ${totalMonthlyPeso} kg. Limite: 100 kg.`);
        }

        // Validation 5: Check daily total limit (2000 kg = 2 toneladas)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Busca todos os recebimentos do dia
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

        console.log('📊 Estatísticas diárias:', {
            totalDailyPeso,
            newTotalDailyPeso,
            peso
        });

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
            console.log('🔄 Iniciando transação...');

            // Lock the material row to prevent concurrent updates
            const materialLocked = await Material.findByPk(idMaterial, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            const recebimentoMaterial = await RecebimentoMaterial.create({
                peso,
                volume,
                idMaterial,
                cpfCliente,
                cpfColaborador
            }, { transaction: t });

            console.log('✅ Recebimento criado:', recebimentoMaterial.idRecebimento);

            // Update material's weight and volume
            const newPeso = materialLocked.peso + peso;
            const newVolume = materialLocked.volume + volume;

            await Material.update({
                peso: newPeso,
                volume: newVolume
            }, {
                where: { idMaterial },
                transaction: t
            });

            console.log('✅ Material atualizado:', {
                id: idMaterial,
                nome: materialLocked.nome,
                pesoAntigo: materialLocked.peso,
                pesoNovo: newPeso,
                volumeAntigo: materialLocked.volume,
                volumeNovo: newVolume
            });

            await t.commit();
            console.log('✅ Transação commitada com sucesso');

            return recebimentoMaterial;
        } catch (error) {
            console.error('❌ Erro na transação:', error);
            await t.rollback();
            throw new Error('Erro ao criar recebimento de material: ' + error.message);
        }
    }

    async createMultipleRecebimentosMaterial(dataArray) {
        console.log('📦 Iniciando criação de múltiplos recebimentos:', dataArray.length);

        // Primeiro, vamos validar todos os recebimentos antes de criar qualquer um
        const validationResults = await this.validateMultipleRecebimentos(dataArray);
        if (!validationResults.isValid) {
            throw new Error(validationResults.error);
        }

        // Inicia uma transação para todos os recebimentos
        const t = await Material.sequelize.transaction();

        try {
            const results = [];

            for (const data of dataArray) {
                const { peso, volume, idMaterial, cpfCliente, cpfColaborador } = data;

                // Create recebimento
                const recebimentoMaterial = await RecebimentoMaterial.create({
                    peso,
                    volume,
                    idMaterial,
                    cpfCliente,
                    cpfColaborador
                }, { transaction: t });

                // Update material's weight and volume
                const material = await Material.findByPk(idMaterial);
                await Material.update({
                    peso: material.peso + peso,
                    volume: material.volume + volume
                }, {
                    where: { idMaterial },
                    transaction: t
                });

                results.push(recebimentoMaterial);
            }

            await t.commit();
            console.log(`✅ ${results.length} recebimentos criados com sucesso`);
            return results;

        } catch (error) {
            await t.rollback();
            console.error('❌ Erro ao criar múltiplos recebimentos:', error);
            throw new Error('Erro ao criar recebimentos de material: ' + error.message);
        }
    }

    async validateMultipleRecebimentos(dataArray) {
        // Agrupa recebimentos por cliente para validar limite mensal
        const recebimentosPorCliente = {};
        let totalPesoDiario = 0;

        // Validation 1: Check if all materials, clients and collaborators exist
        for (const data of dataArray) {
            const { peso, volume, idMaterial, cpfCliente, cpfColaborador } = data;

            // Check material
            const material = await Material.findByPk(idMaterial);
            if (!material) {
                return {
                    isValid: false,
                    error: `Material não encontrado para o recebimento: ${JSON.stringify(data)}`
                };
            }

            // Check cliente
            const cliente = await Cliente.findByPk(cpfCliente);
            if (!cliente) {
                return {
                    isValid: false,
                    error: `Cliente não encontrado para o recebimento: ${JSON.stringify(data)}`
                };
            }

            // Check colaborador
            const colaborador = await Colaborador.findByPk(cpfColaborador);
            if (!colaborador) {
                return {
                    isValid: false,
                    error: `Colaborador não encontrado para o recebimento: ${JSON.stringify(data)}`
                };
            }

            // Validation 2: Check if peso and volume are valid
            if (peso <= 0) {
                return {
                    isValid: false,
                    error: `Peso deve ser maior que zero para o cliente ${cpfCliente}`
                };
            }
            if (volume <= 0) {
                return {
                    isValid: false,
                    error: `Volume deve ser maior que zero para o cliente ${cpfCliente}`
                };
            }

            // Validation 3: Check individual peso limit
            if (peso > 100) {
                return {
                    isValid: false,
                    error: `Limite de envio 100kg para o cliente ${cpfCliente}`
                };
            }

            // Agrupa por cliente para validação mensal
            if (!recebimentosPorCliente[cpfCliente]) {
                recebimentosPorCliente[cpfCliente] = 0;
            }
            recebimentosPorCliente[cpfCliente] += peso;

            // Soma para validação diária
            totalPesoDiario += peso;
        }

        // Validation 4: Check monthly limit per client
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        for (const [cpfCliente, pesoTotal] of Object.entries(recebimentosPorCliente)) {
            const monthlyRecebimentos = await RecebimentoMaterial.findAll({
                where: {
                    cpfCliente: cpfCliente,
                    createdAt: {
                        [Op.gte]: startOfMonth,
                        [Op.lte]: endOfMonth
                    }
                }
            });

            const totalMonthlyPeso = monthlyRecebimentos.reduce((sum, recebimento) => sum + recebimento.peso, 0);
            const newTotalMonthlyPeso = totalMonthlyPeso + pesoTotal;

            if (newTotalMonthlyPeso > 100) {
                return {
                    isValid: false,
                    error: `Limite mensal de recebimento para o cliente ${cpfCliente} excedido. Total recebido este mês: ${totalMonthlyPeso} kg. Limite: 100 kg.`
                };
            }
        }

        // Validation 5: Check daily total limit
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
        const newTotalDailyPeso = totalDailyPeso + totalPesoDiario;

        if (newTotalDailyPeso > 2000) {
            return {
                isValid: false,
                error: `Limite diário total de recebimento excedido. Total recebido hoje: ${totalDailyPeso} kg. Limite: 2000 kg (2 toneladas).`
            };
        }

        return { isValid: true };
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
        console.log('Iniciando deleção do recebimento:', idRecebimento);

        // Inicia uma transação
        const t = await Material.sequelize.transaction();

        try {
            // Busca o recebimento com o material associado
            const recebimento = await RecebimentoMaterial.findByPk(idRecebimento, {
                include: [{ association: 'material' }]
            });

            if (!recebimento) {
                throw new Error('Recebimento de material não encontrado.');
            }

            console.log('Recebimento encontrado:', {
                id: recebimento.idRecebimento,
                peso: recebimento.peso,
                material: recebimento.material.nome
            });

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

                console.log('Material atualizado:', {
                    id: material.idMaterial,
                    novoPeso: material.peso - recebimento.peso,
                    novoVolume: material.volume - recebimento.volume
                });
            }

            // Remove o recebimento
            await recebimento.destroy({ transaction: t });
            console.log('Recebimento deletado com sucesso');

            await t.commit();
            console.log('Transação commitada com sucesso');

            return {
                message: 'Recebimento de material deletado com sucesso.',
                recebimento: {
                    id: recebimento.idRecebimento,
                    peso: recebimento.peso,
                    volume: recebimento.volume,
                    material: recebimento.material.nome
                }
            };
        } catch (error) {
            await t.rollback();
            console.error('Erro ao deletar recebimento:', error);
            throw new Error('Erro ao deletar recebimento de material: ' + error.message);
        }
    }

    // Add other service methods (update, delete) as needed
}

export { RecebimentoMaterialService };