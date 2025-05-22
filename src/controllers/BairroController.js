import { BairroService } from "../services/BairroService.js";

class BairroController {
    constructor() {
        this.bairroService = new BairroService();
    }

    async findAll(req, res) {
        try {
            const bairros = await this.bairroService.findAll();
            res.json(bairros);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const bairro = await this.bairroService.findByPk(req);
            if (!bairro) {
                return res.status(404).json({ message: 'Bairro não encontrado' });
            }
            res.json(bairro);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const bairro = await this.bairroService.create(req);
            res.status(201).json(bairro);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const bairro = await this.bairroService.update(req);
            res.json(bairro);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const bairro = await this.bairroService.delete(req);
            res.json({ message: 'Bairro removido com sucesso', bairro });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export { BairroController };