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
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const cargo = await this.cargoService.create(req);
            res.status(201).json(cargo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const cargo = await this.cargoService.update(req);
            res.json(cargo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const cargo = await this.cargoService.delete(req);
            res.json({ message: 'Cargo removido com sucesso', cargo });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export { CargoController };