import { CargoService } from "../services/CargoService.js";

class CargoController {
  static async findAll(req, res, next) {
    try {
      const cargos = await CargoService.findAll();
      res.json(cargos);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const cargo = await CargoService.findByPk(req);
      if (!cargo) {
        return res.status(404).json({ message: 'Cargo não encontrado' });
      }
      res.json(cargo);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const cargo = await CargoService.create(req);
      res.status(201).json(cargo);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const cargo = await CargoService.update(req);
      res.json(cargo);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const cargo = await CargoService.delete(req);
      res.json({ message: 'Cargo removido com sucesso', cargo });
    } catch (error) {
      next(error);
    }
  }
}

export { CargoController }; 