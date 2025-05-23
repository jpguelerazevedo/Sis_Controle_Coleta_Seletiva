import { Bairro } from "../models/Bairro.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';

class BairroService {

    async findAll() {
        const objs = await Bairro.findAll({
            include: [
                { association: 'enderecos' }
            ]
        });
        return objs;
    }

    async findByPk(req) {
        const { id_bairro } = req.params;
        const obj = await Bairro.findByPk(id_bairro, {
            include: [
                { association: 'enderecos' }
            ]
        });
        return obj;
    }

    async create(req) {
        const { nome, distancia_sede, estado_de_acesso } = req.body;
        const existing = await Bairro.findOne({ where: { nome } });
        if (existing) {
            throw new Error("Já existe um bairro com esse nome!");
        }
    
        const t = await sequelize.transaction();
        try {
            const obj = await Bairro.create({
                nome,
                distancia_sede,
                estado_de_acesso,
                qnt_pessoas_cadastradas: 0
            }, { transaction: t });
    
            await t.commit();
    
            return await Bairro.findByPk(obj.id_bairro, {
                include: [
                    { association: 'enderecos' }
                ]
            });
        } catch (error) {
            await t.rollback();
            throw new Error("Erro ao criar bairro: " + error.message);
        }
    }
    

    async update(req) {
        const { id_bairro } = req.params;
        const { nome, distancia_sede, estado_de_acesso } = req.body;

        const obj = await Bairro.findByPk(id_bairro, {
            include: [
                { association: 'enderecos' }
            ]
        });

        if (!obj) throw new Error('Bairro não encontrado!');

        const t = await sequelize.transaction();
        try {
            Object.assign(obj, {
                nome,
                distancia_sede,
                estado_de_acesso
            });

            await obj.save({ transaction: t });
            await t.commit();
            return await Bairro.findByPk(obj.id_bairro, {
                include: [
                    { association: 'enderecos' }
                ]
            });
        } catch (error) {
            await t.rollback();
            throw new Error("Erro ao atualizar bairro: " + error.message);
        }
    }

    async delete(req) {
        const { id_bairro } = req.params;
        const obj = await Bairro.findByPk(id_bairro);
        if (!obj) throw new Error('Bairro não encontrado!');

        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw new Error("Não é possível remover este bairro: " + error.message);
        }
    }

}

export { BairroService };