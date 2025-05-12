import { ClienteService } from "../services/ClienteService.js";

class ClienteController {
  
  static async findAll(req, res, next) {
    try {
      const clientes = await ClienteService.findAll();
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const cliente = await ClienteService.findByPk(req);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const cliente = await ClienteService.create(req);
      res.status(201).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const cliente = await ClienteService.update(req);
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const cliente = await ClienteService.delete(req);
      res.json({ message: 'Cliente removido com sucesso', cliente });
    } catch (error) {
      next(error);
    }
  }

}

export { ClienteController };