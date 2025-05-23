import { CargoService } from "../services/CargoService.js";

class CargoController {
    constructor() {
        this.cargoService = new CargoService();
    }

    async findAll(req, res) {
        try {
            const cargos = await this.cargoService.findAll();
            res.json(cargos);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async findByPk(req, res) {
        try {
            const cargo = await this.cargoService.findByPk(req);
            if (!cargo) {
                return res.status(404).json({ message: 'Cargo não encontrado' });
            }
            res.json(cargo);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            // Validar campos vazios
            const { nomeCargo, descricao, salario, hierarquia } = req.body;

            if (!nomeCargo || nomeCargo.trim() === "") {
                return res.status(400).json({ error: ' Nome do Cargo não pode estar vazio' });
            }
            if (!descricao || descricao.trim() === "") {
                return res.status(400).json({ error: 'Descrição não pode estar vazia' });
            }
            if (!salario || salario <= 0) {
                return res.status(400).json({ error: 'Salário deve ser maior que zero' });
            }
            if (!hierarquia || hierarquia < 0) {
                return res.status(400).json({ error: 'Hierarquia não pode estar vazia' });
            }

            const cargo = await this.cargoService.create(req);
            res.status(201).json(cargo);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Cargo já cadastrado')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message.includes('Salário inválido')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Validar campos vazios
            const { nomeCargo, descricao, salario } = req.body;

            if (nomeCargo && nomeCargo.trim() === "") {
                return res.status(400).json({ error: ' nomeCargo não pode estar vazio' });
            }
            if (descricao && descricao.trim() === "") {
                return res.status(400).json({ error: 'Descrição não pode estar vazia' });
            }
            if (salario !== undefined && salario <= 0) {
                return res.status(400).json({ error: 'Salário deve ser maior que zero' });
            }

            const cargo = await this.cargoService.update(req);
            res.json(cargo);
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Cargo não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Salário inválido')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const cargo = await this.cargoService.delete(req);
            res.json({ message: 'Cargo removido com sucesso', cargo });
        } catch (error) {
            console.error('🔥 ERRO DETALHADO:', error.message, error.stack);

            if (error.message.includes('Cargo não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Cargo em uso')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }
}

export { CargoController };