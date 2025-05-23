import { RecebimentoMaterialService } from '../services/RecebimentoMaterialService.js';

class RecebimentoMaterialController {
    constructor() {
        this.recebimentoMaterialService = new RecebimentoMaterialService();
    }

    async create(req, res) {
        try {
            console.log('📝 Recebendo requisição de criação:', req.body);

            const result = await this.recebimentoMaterialService.createRecebimentoMaterial(req.body);

            // Se o resultado for um array, significa que foram criados múltiplos recebimentos
            if (Array.isArray(result)) {
                console.log(` ${result.length} recebimentos criados com sucesso`);
                return res.status(201).json({
                    message: `${result.length} recebimentos criados com sucesso`,
                    recebimentos: result
                });
            }

            // Caso contrário, foi criado apenas um recebimento
            console.log('✅ Recebimento criado com sucesso:', result.idRecebimento);
            return res.status(201).json(result);
        } catch (error) {
            console.error(' Erro ao criar recebimento:', error.message);

            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }

            if (error.message.includes('Limite')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: 'Erro ao criar recebimento de material: ' + error.message });
        }
    }

    async findAll(req, res) {
        try {
            console.log(' Buscando todos os recebimentos');
            const recebimentosMaterial = await this.recebimentoMaterialService.findAllRecebimentosMaterial();
            console.log(` Encontrados ${recebimentosMaterial.length} recebimentos`);
            return res.json(recebimentosMaterial);
        } catch (error) {
            console.error(' Erro ao buscar recebimentos:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar recebimentos de material: ' + error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { idRecebimento } = req.params;
            console.log('Buscando recebimento:', idRecebimento);

            const recebimentoMaterial = await this.recebimentoMaterialService.findRecebimentoMaterialByPk(idRecebimento);

            if (!recebimentoMaterial) {
                console.log('Recebimento não encontrado:', idRecebimento);
                return res.status(404).json({ error: 'Recebimento de material não encontrado.' });
            }

            console.log('Recebimento encontrado:', idRecebimento);
            return res.json(recebimentoMaterial);
        } catch (error) {
            console.error('Erro ao buscar recebimento:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar recebimento de material: ' + error.message });
        }
    }

    async delete(req, res) {
        try {
            const { idRecebimento } = req.params;
            console.log('Deletando recebimento:', idRecebimento);

            if (!idRecebimento) {
                return res.status(400).json({ error: 'ID do recebimento não fornecido' });
            }

            const result = await this.recebimentoMaterialService.delete(idRecebimento);

            console.log('Recebimento deletado com sucesso:', idRecebimento);
            return res.json(result);
        } catch (error) {
            console.error('Erro ao deletar recebimento:', error.message);

            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }

            return res.status(500).json({ error: 'Erro ao deletar recebimento de material: ' + error.message });
        }
    }
}

export { RecebimentoMaterialController };