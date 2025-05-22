import { TerceirizadaService } from '../services/TerceirizadaService.js';

class TerceirizadaController {
    constructor() {
        this.terceirizadaService = new TerceirizadaService();
    }

    async findAll(req, res) {
        try {
            const terceirizadas = await this.terceirizadaService.findAll();
            return res.status(200).json(terceirizadas);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const terceirizada = await this.terceirizadaService.findByPk(req);
            if (!terceirizada) {
                return res.status(404).json({ message: 'Terceirizada não encontrada' });
            }
            res.json(terceirizada);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const terceirizada = await this.terceirizadaService.create(req);
            res.status(201).json(terceirizada);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const terceirizada = await this.terceirizadaService.update(req);
            res.json(terceirizada);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const terceirizada = await this.terceirizadaService.delete(req);
            res.json({ message: 'Terceirizada removida com sucesso', terceirizada });
        } catch (error) {
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

export { TerceirizadaController };