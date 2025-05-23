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
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
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
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            // Validar campos vazios
            const { nome, peso, volume, nivelDeRisco } = req.body;

            if (!nome || nome.trim() === "") {
                return res.status(400).json({ error: 'Nome não pode estar vazio' });
            }
            if (!peso || peso <= 0) {
                return res.status(400).json({ error: 'Peso deve ser maior que zero' });
            }
            if (!volume || volume <= 0) {
                return res.status(400).json({ error: 'Volume deve ser maior que zero' });
            }
            if (!nivelDeRisco || nivelDeRisco.trim() === "") {
                return res.status(400).json({ error: 'Nivel de risco não pode estar vazio' });
            }


            const material = await this.materialService.create(req);
            res.status(201).json(material);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Material já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Peso inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Volume inválido')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Validar campos vazios
            const { nome, descricao, peso, volume, estoque } = req.body;

            if (nome && nome.trim() === "") {
                return res.status(400).json({ error: 'Nome não pode estar vazio' });
            }
            if (descricao && descricao.trim() === "") {
                return res.status(400).json({ error: 'Descrição não pode estar vazia' });
            }
            if (peso !== undefined && peso <= 0) {
                return res.status(400).json({ error: 'Peso deve ser maior que zero' });
            }
            if (volume !== undefined && volume <= 0) {
                return res.status(400).json({ error: 'Volume deve ser maior que zero' });
            }
            if (estoque !== undefined && estoque < 0) {
                return res.status(400).json({ error: 'Estoque não pode ser negativo' });
            }

            const material = await this.materialService.update(req);
            res.json(material);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Material não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Peso inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Volume inválido')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const material = await this.materialService.delete(req);
            res.json({ message: 'Material removido com sucesso', material });
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Material não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Material em uso')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }
}

export { MaterialController };