import { RecebimentoMaterialService } from '../services/RecebimentoMaterialService.js';

const recebimentoMaterialService = new RecebimentoMaterialService();

class RecebimentoMaterialController {
    async create(req, res) {
        try {
            const recebimentoMaterial = await recebimentoMaterialService.createRecebimentoMaterial(req.body);
            return res.status(201).json(recebimentoMaterial);
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

            return res.status(500).json({ error: 'Erro ao criar recebimento de material.' });
        }
    }

    async findAll(req, res) {
        try {
            const recebimentosMaterial = await recebimentoMaterialService.findAllRecebimentosMaterial();
            return res.status(200).json(recebimentosMaterial);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar recebimentos de material.' });
        }
    }

    async findByPk(req, res) {
            try {
                const { idRecebimento } = req.params;
                const recebimentoMaterial = await recebimentoMaterialService.findRecebimentoMaterialByPk(idRecebimento);

                if (!recebimentoMaterial) {
                    return res.status(404).json({ error: 'Recebimento de material não encontrado.' });
                }

                return res.status(200).json(recebimentoMaterial);
            } catch (error) {
                return res.status(500).json({ error: 'Erro ao buscar recebimento de material por ID.' });
            }
        }
        // Add other controller methods (findByPk, update, delete) as needed
}

export { RecebimentoMaterialController };