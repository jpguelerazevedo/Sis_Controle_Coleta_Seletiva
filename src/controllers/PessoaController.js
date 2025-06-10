import { PessoaService } from '../services/PessoaService.js';

class PessoaController {
    constructor() {
        this.pessoaService = new PessoaService();
    }

    async findAll(req, res) {
        try {
            const pessoas = await this.pessoaService.findAll();
            return res.json(pessoas);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const { cpf } = req.params;
            const pessoa = await this.pessoaService.findByPk(cpf);
            return res.json(pessoa);
        } catch (error) {
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const pessoaData = req.body;

            // Validação básica dos campos obrigatórios
            const camposObrigatorios = ['cpf', 'nome', 'email', 'telefone', 'sexo'];
            for (const campo of camposObrigatorios) {
                if (!pessoaData[campo]) {
                    return res.status(400).json({ error: `O campo ${campo} é obrigatório.` });
                }
            }

            // Validação do formato do CPF (apenas números)
            if (!/^\d{11}$/.test(pessoaData.cpf)) {
                return res.status(400).json({ error: 'CPF deve conter 11 dígitos numéricos.' });
            }

            // Validação do formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(pessoaData.email)) {
                return res.status(400).json({ error: 'Email inválido.' });
            }

            const pessoa = await this.pessoaService.create(pessoaData);
            return res.status(201).json(pessoa);
        } catch (error) {
            if (error.message.includes('já existe')) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { cpf } = req.params;
            const pessoaData = req.body;

            // Validação do formato do email se estiver sendo atualizado
            if (pessoaData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(pessoaData.email)) {
                    return res.status(400).json({ error: 'Email inválido.' });
                }
            }

            const pessoa = await this.pessoaService.update(cpf, pessoaData);
            return res.json(pessoa);
        } catch (error) {
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('já existe')) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { cpf } = req.params;
            const result = await this.pessoaService.delete(cpf);
            return res.json(result);
        } catch (error) {
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('associada')) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

export { PessoaController };