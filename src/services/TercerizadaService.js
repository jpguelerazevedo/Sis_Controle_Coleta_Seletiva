import { Terceirizada } from "../models/Terceirizada.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';

class TercerizadaService {
  static async findAll() {
    const objs = await Terceirizada.findAll({ 
      include: [
        { association: 'envios' }
      ]
    });
    return objs;
  }

  static async findByPk(req) {
    const { cnpj } = req.params;
    const obj = await Terceirizada.findByPk(cnpj, { 
      include: [
        { association: 'envios' }
      ]
    });
    return obj;
  }

  static async create(req) {
    const { cnpj, nome, telefone, email, horarioDeFuncionamento } = req.body;
    
    const t = await sequelize.transaction();
    try {
      const obj = await Terceirizada.create({ 
        cnpj,
        nome,
        telefone,
        email,
        horarioDeFuncionamento
      }, { transaction: t });
      
      await t.commit();
      return await Terceirizada.findByPk(obj.cnpj, { 
        include: [
          { association: 'envios' }
        ]
      });
    } catch (error) {
      await t.rollback();
      throw "Erro ao criar terceirizada: " + error.message;
    }
  }

  static async update(req) {
    const { cnpj } = req.params;
    const { nome, telefone, email, horarioDeFuncionamento } = req.body;
    
    const obj = await Terceirizada.findByPk(cnpj, { 
      include: [
        { association: 'envios' }
      ]
    });
    
    if (!obj) throw 'Terceirizada não encontrada!';
    
    const t = await sequelize.transaction();
    try {
      Object.assign(obj, { 
        nome,
        telefone,
        email,
        horarioDeFuncionamento
      });
      
      await obj.save({ transaction: t });
      await t.commit();
      return await Terceirizada.findByPk(obj.cnpj, { 
        include: [
          { association: 'envios' }
        ]
      });
    } catch (error) {
      await t.rollback();
      throw "Erro ao atualizar terceirizada: " + error.message;
    }
  }

  static async delete(req) {
    const { cnpj } = req.params;
    const obj = await Terceirizada.findByPk(cnpj);
    if (!obj) throw 'Terceirizada não encontrada!';
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta terceirizada: " + error.message;
    }
  }
}

export { TercerizadaService };
