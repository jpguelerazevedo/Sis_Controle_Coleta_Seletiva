import { Cargo } from "../models/Cargo.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';

class CargoService {
    static async findAll() {
        const objs = await Cargo.findAll();
        return objs;
    }

    static async findByPk(req) {
        const { id_cargo } = req.params;
        const obj = await Cargo.findByPk(id_cargo);
        return obj;
    }

    static async create(req) {
        const { nomeCargo, descricao, hierarquia, salario } = req.body;

        const t = await sequelize.transaction();
        try {
            const obj = await Cargo.create({
                nomeCargo,
                descricao,
                hierarquia,
                salario

            }, { transaction: t });

            await t.commit();
            return obj
        } catch (error) {
            await t.rollback();
            throw "Erro ao criar cargo: " + error.message;
        }
    }




    static async update(req) {
        const { id_cargo } = req.params;
        const { nomeCargo, descricao, hierarquia, salario } = req.body;

        const obj = await Cargo.findByPk(id_cargo);
        if (!obj) throw 'Cargo não encontrado!';

        const t = await sequelize.transaction();
        try {
            Object.assign(obj, {
                nomeCargo,
                descricao,
                hierarquia,
                salario
            });

            await obj.save({ transaction: t });
            await t.commit();
            return obj
        } catch (error) {
            await t.rollback();
            throw "Erro ao atualizar cargo: " + error.message;
        }
    }

    static async delete(req) {
        const { id_cargo } = req.params;
        const obj = await Cargo.findByPk(id_cargo);
        if (!obj) throw 'Cargo não encontrado!';

        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover este cargo: " + error.message;
        }
    }
}

export { CargoService };