import { EnderecoService } from '../services/EnderecoService.js';

class EnderecoController {
    async findAll(req, res) {
        try {
            const enderecos = await EnderecoService.findAll();
            res.json(enderecos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const endereco = await EnderecoService.findByPk(req);
            if (!endereco) {
                return res.status(404).json({ message: 'Endereço não encontrado' });
            }
            res.json(endereco);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const endereco = await EnderecoService.create(req);
            res.status(201).json(endereco);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const endereco = await EnderecoService.update(req);
            res.json(endereco);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const endereco = await EnderecoService.delete(req);
            res.json({ message: 'Endereço removido com sucesso', endereco });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export { EnderecoController };