import { ColaboradorService } from "../services/ColaboradorService.js";

class ColaboradorController {
    constructor() {
        this.colaboradorService = new ColaboradorService();
    }

    async findAll(req, res) {
        try {
            const colaboradores = await this.colaboradorService.findAll();
            res.json(colaboradores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const colaborador = await this.colaboradorService.findByPk(req);
            if (!colaborador) {
                return res.status(404).json({ message: 'Colaborador não encontrado' });
            }
            res.json(colaborador);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const colaborador = await this.colaboradorService.create(req);
            res.status(201).json(colaborador);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const colaborador = await this.colaboradorService.update(req);
            res.json(colaborador);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const colaborador = await this.colaboradorService.delete(req);
            res.json({ message: 'Colaborador removido com sucesso', colaborador });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export { ColaboradorController };