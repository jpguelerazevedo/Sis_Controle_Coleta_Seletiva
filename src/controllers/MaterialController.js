import { MaterialService } from "../services/MaterialService.js";

class MaterialController {
    constructor() {
        this.materialService = new MaterialService();
    }

    async findAll(req, res) {
        try {
            const materiais = await this.materialService.findAll();
            res.json(materiais);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const material = await this.materialService.findByPk(req);
            if (!material) {
                return res.status(404).json({ message: 'Material não encontrado' });
            }
            res.json(material);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const material = await this.materialService.create(req);
            res.status(201).json(material);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const material = await this.materialService.update(req);
            res.json(material);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const material = await this.materialService.delete(req);
            res.json({ message: 'Material removido com sucesso', material });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export { MaterialController };