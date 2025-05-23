import { ClienteService } from "../services/ClienteService.js";

const clienteService = new ClienteService();

class ClienteController {
    async findAll(req, res) {
        try {
            const clientes = await clienteService.findAll();
            return res.status(200).json(clientes);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            return res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const cliente = await clienteService.findByPk(req);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            return res.status(200).json(cliente);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            // Validar campos vazios
            const { cpf, telefone, email } = req.body;

            if (!cpf || cpf.trim() === "") {
                return res.status(400).json({ error: 'CPF não pode estar vazio' });
            }
            if (!telefone || telefone.trim() === "") {
                return res.status(400).json({ error: 'Telefone não pode estar vazio' });
            }
            if (!email || email.trim() === "") {
                return res.status(400).json({ error: 'Email não pode estar vazio' });
            }

            const cliente = await clienteService.create(req);
            return res.status(201).json(cliente);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('CPF já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Email já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('CPF inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Email inválido')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: error.message });
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

            const cliente = await clienteService.update(req);
            return res.status(200).json(cliente);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Cliente não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Email já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Email inválido')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { cpf } = req.params;
            const result = await clienteService.delete(cpf);
            return res.status(200).json(result);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('CPF inválido')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: error.message });
        }
    }
}

export { ClienteController };