import { EnvioMaterialService } from '../services/EnvioMaterialService.js';

const envioMaterialService = new EnvioMaterialService();

class EnvioMaterialController {
    async create(req, res) {
        try {
            const envioMaterial = await envioMaterialService.createEnvioMaterial(req.body);
            return res.status(201).json(envioMaterial);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (
                error.message.includes('Material não encontrado') ||
                error.message.includes('Material com estoque insuficiente') ||
                error.message.includes('Terceirizada não encontrada') ||
                error.message.includes('Terceirizada já recebeu') ||
                error.message.includes('Peso deve ser maior que zero')
            ) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: 'Erro ao criar envio de material.' });
        }
    }

    async findAll(req, res) {
        try {
            const enviosMaterial = await envioMaterialService.findAllEnviosMaterial();
            return res.status(200).json(enviosMaterial);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar envios de material.' });
        }
    }

    async findByPk(req, res) {
        try {
            const { idEnvio } = req.params;
            const envioMaterial = await envioMaterialService.findEnvioMaterialByPk(idEnvio);

            if (!envioMaterial) {
                return res.status(404).json({ error: 'Envio de material não encontrado.' });
            }

            return res.status(200).json(envioMaterial);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar envio de material por ID.' });
        }
    }
}

export { EnvioMaterialController };