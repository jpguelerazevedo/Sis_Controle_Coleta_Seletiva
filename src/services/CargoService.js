import { Cargo } from "../models/Cargo.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';

class CargoService {
    async findAll() {
        try {
            const cargos = await Cargo.findAll();
            return cargos;
        } catch (error) {
            throw new new Error('Erro ao buscar cargos: ' + error.message);
        }
    }

    async findByPk(req) {
        const { id_cargo } = req.params;
        const obj = await Cargo.findByPk(id_cargo);
        return obj;
    }

    async create(req) {
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
            throw new Error("Erro ao criar cargo: " + error.message);
        }
    }

    async update(req) {
        const { id_cargo } = req.params;
        const { nomeCargo, descricao, hierarquia, salario } = req.body;

        const obj = await Cargo.findByPk(id_cargo);
        if (!obj) throw new 'Cargo não encontrado!';

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
            throw new new Error("Erro ao atualizar cargo: " + error.message);
        }
    }

    async delete(req) {
        try {
            const { id_cargo } = req.params;
            const cargo = await Cargo.findByPk(id_cargo);
            if (!cargo) {
                throw new new Error('Cargo não encontrado.');
            }
            await cargo.destroy();
            return { message: 'Cargo deletado com sucesso.' };
        } catch (error) {
            throw new new Error('Erro ao deletar cargo: ' + error.message);
        }
    }
}

export { CargoService };