import { BairroService } from "../services/BairroService.js";

class BairroController {
  
  static async findAll(req, res, next) {
    try {
      const bairros = await BairroService.findAll();
      res.json(bairros);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const bairro = await BairroService.findByPk(req);
      if (!bairro) {
        return res.status(404).json({ message: 'Bairro não encontrado' });
      }
      res.json(bairro);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const bairro = await BairroService.create(req);
      res.status(201).json(bairro);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const bairro = await BairroService.update(req);
      res.json(bairro);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const bairro = await BairroService.delete(req);
      res.json({ message: 'Bairro removido com sucesso', bairro });
    } catch (error) {
      next(error);
    }
  }

}

export { BairroController };