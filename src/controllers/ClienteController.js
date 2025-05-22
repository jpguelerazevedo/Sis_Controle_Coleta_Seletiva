import { ClienteService } from "../services/ClienteService.js";

const clienteService = new ClienteService();

class ClienteController {
    async findAll(req, res) {
        try {
            const clientes = await clienteService.findAll();
            return res.status(200).json(clientes);
        } catch (error) {
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
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const cliente = await clienteService.create(req);
            return res.status(201).json(cliente);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const cliente = await clienteService.update(req);
            return res.status(200).json(cliente);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { cpf } = req.params;
            const result = await clienteService.delete(cpf);
            return res.status(200).json(result);
        } catch (error) {
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

export { ClienteController };