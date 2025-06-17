import { EnvioMaterialService } from '../services/EnvioMaterialService.js';

const envioMaterialService = new EnvioMaterialService();

class EnvioMaterialController {
    async create(req, res) {
        try {
            const { idMaterial, cnpj, pesoEnviado, volumeEnviado } = req.body;

            if (volumeEnviado === undefined || volumeEnviado === null) {
                return res.status(400).json({ error: 'O campo volumeEnviado é obrigatório.' });
            }

            const envioMaterial = await envioMaterialService.createEnvioMaterial({ idMaterial, cnpj, pesoEnviado, volumeEnviado });
            res.status(201).json(envioMaterial);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (
                error.message.includes('Material não encontrado') ||
                error.message.includes('Estoque insuficiente') || // Updated to catch both peso and volume insufficient stock
                error.message.includes('Terceirizada não encontrada') ||
                error.message.includes('Terceirizada já recebeu') ||
                error.message.includes('Peso deve ser maior que zero') ||
                error.message.includes('Volume deve ser maior que zero') // Added volume validation error
            ) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async findAll(req, res) {
        try {
            const envios = await envioMaterialService.findAll();
            res.status(200).json(envios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const { idEnvio } = req.params;
            const envioMaterial = await envioMaterialService.findEnvioMaterialByPk(idEnvio);

            if (!envioMaterial) {
                return res.status(404).json({ error: 'Envio de material não encontrado.' });
            }

            res.status(200).json(envioMaterial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { idEnvio } = req.params;
            const result = await envioMaterialService.delete(idEnvio);
            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes('não encontrado')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}

export { EnvioMaterialController };