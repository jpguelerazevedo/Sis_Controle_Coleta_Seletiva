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
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
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
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            // Validar campos vazios
            const { nome, cnpj, telefone, email } = req.body;

            if (!nome || nome.trim() === "") {
                return res.status(400).json({ error: 'Nome não pode estar vazio' });
            }
            if (!cnpj || cnpj.trim() === "") {
                return res.status(400).json({ error: 'CNPJ não pode estar vazio' });
            }
            if (!telefone || telefone.trim() === "") {
                return res.status(400).json({ error: 'Telefone não pode estar vazio' });
            }
            if (!email || email.trim() === "") {
                return res.status(400).json({ error: 'Email não pode estar vazio' });
            }

            const terceirizada = await this.terceirizadaService.create(req);
            res.status(201).json(terceirizada);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('CNPJ já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Email já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('CNPJ inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Email inválido')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Validar campos vazios
            const { nome, telefone, email } = req.body;

            if (nome && nome.trim() === "") {
                return res.status(400).json({ error: 'Nome não pode estar vazio' });
            }
            if (telefone && telefone.trim() === "") {
                return res.status(400).json({ error: 'Telefone não pode estar vazio' });
            }
            if (email && email.trim() === "") {
                return res.status(400).json({ error: 'Email não pode estar vazio' });
            }

            const terceirizada = await this.terceirizadaService.update(req);
            res.json(terceirizada);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Terceirizada não encontrada')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Email já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Email inválido')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const terceirizada = await this.terceirizadaService.delete(req);
            res.json({ message: 'Terceirizada removida com sucesso', terceirizada });
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Terceirizada em uso')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: error.message });
        }
    }
}

export { TerceirizadaController };