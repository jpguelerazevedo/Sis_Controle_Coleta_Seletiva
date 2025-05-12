import { Material } from "../models/Material.js";
import sequelize from '../config/database-connection.js';

class MaterialService {
  static async findAll() {
    return await Material.findAll();
  }

  static async findByPk(req) {
    const { id_material } = req.params;
    return await Material.findByPk(id_material);
  }

  static async create(req) {
    const { nome, peso, volume, nivelDeRisco } = req.body;

    const t = await sequelize.transaction();
    try {
      const obj = await Material.create({
        nome,
        peso,
        volume,
        nivelDeRisco
      }, { transaction: t });

      await t.commit();
      return await Material.findByPk(obj.idMaterial);
    } catch (error) {
      await t.rollback();
      throw "Erro ao criar material: " + error.message;
    }
  }

  static async update(req) {
    const { id_material } = req.params;
    const { nome, peso, volume, nivelDeRisco } = req.body;

    const obj = await Material.findByPk(id_material);
    if (!obj) throw 'Material não encontrado!';

    const t = await sequelize.transaction();
    try {
      Object.assign(obj, {
        nome,
        peso,
        volume,
        nivelDeRisco
      });

      await obj.save({ transaction: t });
      await t.commit();
      return await Material.findByPk(obj.idMaterial);
    } catch (error) {
      await t.rollback();
      throw "Erro ao atualizar material: " + error.message;
    }
  }

  static async delete(req) {
    const { id_material } = req.params;
    const obj = await Material.findByPk(id_material);
    if (!obj) throw 'Material não encontrado!';

    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este material: " + error.message;
    }
  }
}

export { MaterialService };
