import { ColaboradorService } from "../services/ColaboradorService.js";

class ColaboradorController {
  static async findAll(req, res, next) {
    try {
      const colaboradores = await ColaboradorService.findAll();
      res.json(colaboradores);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const colaborador = await ColaboradorService.findByPk(req);
      if (!colaborador) {
        return res.status(404).json({ message: 'Colaborador não encontrado' });
      }
      res.json(colaborador);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const colaborador = await ColaboradorService.create(req);
      res.status(201).json(colaborador);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const colaborador = await ColaboradorService.update(req);
      res.json(colaborador);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const colaborador = await ColaboradorService.delete(req);
      res.json({ message: 'Colaborador removido com sucesso', colaborador });
    } catch (error) {
      next(error);
    }
  }
}

export { ColaboradorController }; 