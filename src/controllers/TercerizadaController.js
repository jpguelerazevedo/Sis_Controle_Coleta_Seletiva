import { TercerizadaService } from "../services/TercerizadaService.js";

class TercerizadaController {
  static async findAll(req, res, next) {
    try {
      const terceirizadas = await TercerizadaService.findAll();
      res.json(terceirizadas);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const terceirizada = await TercerizadaService.findByPk(req);
      if (!terceirizada) {
        return res.status(404).json({ message: 'Terceirizada não encontrada' });
      }
      res.json(terceirizada);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const terceirizada = await TercerizadaService.create(req);
      res.status(201).json(terceirizada);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const terceirizada = await TercerizadaService.update(req);
      res.json(terceirizada);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const terceirizada = await TercerizadaService.delete(req);
      res.json({ message: 'Terceirizada removida com sucesso', terceirizada });
    } catch (error) {
      next(error);
    }
  }
}

export { TercerizadaController };
