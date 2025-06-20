import { ColaboradorService } from "../services/ColaboradorService.js";

class ColaboradorController {
    constructor() {
        this.colaboradorService = new ColaboradorService();
    }

    async findAll(req, res) {
        try {
            const colaboradores = await this.colaboradorService.findAll();
            res.json(colaboradores);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const colaborador = await this.colaboradorService.findByPk(req);
            if (!colaborador) {
                return res.status(404).json({ message: 'Colaborador não encontrado' });
            }
            res.json(colaborador);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            // Validar campos vazios
            const { cpf, dataAdmissao, carga_horaria, nacionalidade, id_cargo } = req.body;

            if (!cpf || cpf.trim() === "") {
                return res.status(400).json({ error: 'CPF não pode estar vazio' });
            }
            if (!dataAdmissao || dataAdmissao.trim() === "") {
                return res.status(400).json({ error: 'Data de admissão não pode estar vazia' });
            }
            if (!carga_horaria || carga_horaria <= 0) {
                return res.status(400).json({ error: 'Carga horária deve ser maior que zero' });
            }
            if (!nacionalidade || nacionalidade.trim() === "") {
                return res.status(400).json({ error: 'Nacionalidade não pode estar vazia' });
            }
            if (!id_cargo || id_cargo <= 0) {
                return res.status(400).json({ error: 'ID do cargo não pode estar vazio' });
            }

            const colaborador = await this.colaboradorService.create(req);
            res.status(201).json(colaborador);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('CPF já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('CPF inválido')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Data de admissão inválida')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Cargo não encontrado')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Validar campos vazios
            const { dataAdmissao, carga_horaria, nacionalidade, id_cargo, estado } = req.body;

            if (dataAdmissao && dataAdmissao.trim() === "") {
                return res.status(400).json({ error: 'Data de admissão não pode estar vazia' });
            }
            if (carga_horaria !== undefined && carga_horaria <= 0) {
                return res.status(400).json({ error: 'Carga horária deve ser maior que zero' });
            }
            if (nacionalidade && nacionalidade.trim() === "") {
                return res.status(400).json({ error: 'Nacionalidade não pode estar vazia' });
            }
            if (id_cargo !== undefined && id_cargo <= 0) {
                return res.status(400).json({ error: 'ID do cargo não pode estar vazio' });
            }

            const colaborador = await this.colaboradorService.update(req);
            res.json(colaborador);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Colaborador não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Data de admissão inválida')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Cargo não encontrado')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const colaborador = await this.colaboradorService.delete(req);
            res.json({ message: 'Colaborador removido com sucesso', colaborador });
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Colaborador não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Colaborador em uso')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }
}

export { ColaboradorController };