import { EnderecoService } from '../services/EnderecoService.js';
const enderecoService = new EnderecoService();

class EnderecoController {
    async findAll(req, res) {
        try {
            const enderecos = await enderecoService.findAll();
            res.json(enderecos);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const endereco = await enderecoService.findByPk(req);
            if (!endereco) {
                return res.status(404).json({ message: 'Endereço não encontrado' });
            }
            res.json(endereco);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            console.log('Dados recebidos no controller:', req.body);

            const rua = typeof req.body.rua === 'string' ? req.body.rua.trim() : req.body.rua;
            const numero = parseInt(req.body.numero, 10);
            const referencia = typeof req.body.referencia === 'string' ? req.body.referencia.trim() : req.body.referencia;
            const cep = typeof req.body.cep === 'string' ? req.body.cep.trim() : req.body.cep;
            const id_bairro = parseInt(req.body.id_bairro, 10);

            // Validações
            if (!rua) {
                return res.status(400).json({ error: 'Rua não pode estar vazia' });
            }
            if (isNaN(numero) || numero <= 0) {
                return res.status(400).json({ error: 'Número inválido' });
            }
            if (!cep) {
                return res.status(400).json({ error: 'CEP não pode estar vazio' });
            }
            if (isNaN(id_bairro) || id_bairro <= 0) {
                return res.status(400).json({ error: 'Bairro inválido' });
            }

            const enderecoData = {
                rua,
                numero,
                referencia,
                cep,
                id_bairro
            };

            console.log('Dados formatados para criação:', enderecoData);
            const endereco = await enderecoService.create(enderecoData);
            res.status(201).json(endereco);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('CEP inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Bairro não encontrado')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { rua, numero, referencia, cep } = req.body;

            if (rua && rua.trim() === "") {
                return res.status(400).json({ error: 'Rua não pode estar vazia' });
            }
            if (numero && numero.trim() === "") {
                return res.status(400).json({ error: 'Número não pode estar vazio' });
            }
            if (cep && cep.trim() === "") {
                return res.status(400).json({ error: 'CEP não pode estar vazio' });
            }


            const endereco = await enderecoService.update(req);
            res.json(endereco);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Endereço não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('CEP inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Bairro não encontrado')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const endereco = await enderecoService.delete(req);
            res.json({ message: 'Endereço removido com sucesso', endereco });
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Endereço não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Endereço em uso')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }
}

export { EnderecoController };