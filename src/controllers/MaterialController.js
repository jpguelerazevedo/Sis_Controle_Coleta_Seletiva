import { MaterialService } from "../services/MaterialService.js";

class MaterialController {
  static async findAll(req, res, next) {
    try {
      const materiais = await MaterialService.findAll();
      res.json(materiais);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const material = await MaterialService.findByPk(req);
      if (!material) {
        return res.status(404).json({ message: 'Material não encontrado' });
      }
      res.json(material);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const material = await MaterialService.create(req);
      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const material = await MaterialService.update(req);
      res.json(material);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const material = await MaterialService.delete(req);
      res.json({ message: 'Material removido com sucesso', material });
    } catch (error) {
      next(error);
    }
  }
}

export { MaterialController }; 