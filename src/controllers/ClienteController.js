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
            const { cpf, turno_preferido_de_coleta, status_cliente, frequencia_de_pedidos, id_endereco } = req.body;

            if (!cpf || cpf.trim() === "") {
                return res.status(400).json({ error: 'CPF não pode estar vazio' });
            }
            if (!turno_preferido_de_coleta || turno_preferido_de_coleta.trim() === "") {
                return res.status(400).json({ error: 'Turno preferido de coleta não pode estar vazio' });
            }
            if (!status_cliente || status_cliente.trim() === "") {
                return res.status(400).json({ error: 'Status do cliente não pode estar vazio' });
            }
            if (!frequencia_de_pedidos || frequencia_de_pedidos.trim() === "") {
                return res.status(400).json({ error: 'Frequência de pedidos não pode estar vazia' });
            }
            if (!id_endereco) {
                return res.status(400).json({ error: 'ID do endereço não pode estar vazio' });
            }

            const cliente = await clienteService.create(req);
            return res.status(201).json(cliente);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('CPF já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('CPF inválido')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Validar campos vazios
            const { turno_preferido_de_coleta, status_cliente, frequencia_de_pedidos, id_endereco } = req.body;

            if (turno_preferido_de_coleta !== undefined && turno_preferido_de_coleta.trim() === "") {
                return res.status(400).json({ error: 'Turno preferido de coleta não pode estar vazio' });
            }
            if (status_cliente !== undefined && status_cliente.trim() === "") {
                return res.status(400).json({ error: 'Status do cliente não pode estar vazio' });
            }
            if (frequencia_de_pedidos !== undefined && frequencia_de_pedidos.trim() === "") {
                return res.status(400).json({ error: 'Frequência de pedidos não pode estar vazia' });
            }
            if (id_endereco !== undefined && !id_endereco) {
                return res.status(400).json({ error: 'ID do endereço não pode estar vazio' });
            }

            const cliente = await clienteService.update(req);
            return res.status(200).json(cliente);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Cliente não encontrado')) {
                return res.status(404).json({ error: error.message });
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

//sassssssssssssssssssssssssssssssssssssssssss