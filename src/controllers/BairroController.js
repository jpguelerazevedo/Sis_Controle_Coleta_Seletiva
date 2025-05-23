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
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
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
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res, estado_de_acesso) {
        try {
            // Validar campos vazios
            const { nome, distancia_sede, estado_de_acesso } = req.body;

            if (!nome || nome.trim() === "") {
                return res.status(400).json({ error: 'Nome não pode estar vazio' });
            }
            if (!distancia_sede || distancia_sede < 0) {
                return res.status(400).json({ error: 'Distância da sede não pode ser negativa' });
            }
            if (!estado_de_acesso || estado_de_acesso.trim() === "") {
                return res.status(400).json({ error: 'Estado de acesso não pode estar vazio' });
            }

            // Incluir estado_de_acesso no body da requisição
            req.body.estado_de_acesso = estado_de_acesso;

            const bairro = await this.bairroService.create(req);
            res.status(201).json(bairro);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Bairro já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Validar campos vazios
            const { nome } = req.body;

            if (nome && nome.trim() === "") {
                return res.status(400).json({ error: 'Nome não pode estar vazio' });
            }

            const bairro = await this.bairroService.update(req);
            res.json(bairro);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Bairro não encontrado')) {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const bairro = await this.bairroService.delete(req);
            res.json({ message: 'Bairro removido com sucesso', bairro });
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Bairro não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Bairro em uso')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }
}

export { BairroController };