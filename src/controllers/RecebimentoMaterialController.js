import { RecebimentoMaterialService } from '../services/RecebimentoMaterialService.js';

const recebimentoMaterialService = new RecebimentoMaterialService();

class RecebimentoMaterialController {
    async create(req, res) {
        try {
            const recebimentoMaterial = await recebimentoMaterialService.createRecebimentoMaterial(req.body);
            res.status(201).json(recebimentoMaterial);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (
                error.message.includes('Material não encontrado') ||
                error.message.includes('Terceirizada não encontrada') ||
                error.message.includes('Limite mensal de recebimento') ||
                error.message.includes('Limite diário total de recebimento') ||
                error.message.includes('Peso deve ser maior que zero') ||
                error.message.includes('Volume deve ser maior que zero')
            ) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const recebimentosMaterial = await recebimentoMaterialService.findAllRecebimentosMaterial();
            res.status(200).json(recebimentosMaterial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const { idRecebimento } = req.params;
            const recebimentoMaterial = await recebimentoMaterialService.findRecebimentoMaterialByPk(idRecebimento);

            if (!recebimentoMaterial) {
                return res.status(404).json({ error: 'Recebimento de material não encontrado.' });
            }

            res.status(200).json(recebimentoMaterial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const recebimento = await recebimentoMaterialService.updateRecebimentoMaterial(req.body);
            res.json(recebimento);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { idRecebimento } = req.params;
            const result = await recebimentoMaterialService.delete(idRecebimento);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

export { RecebimentoMaterialController };