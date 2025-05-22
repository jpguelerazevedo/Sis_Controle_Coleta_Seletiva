import { Colaborador } from "../models/Colaborador.js";
import sequelize from '../config/database-connection.js';

class ColaboradorService {
    async findAll() {
        const objs = await Colaborador.findAll({
            include: [
                { association: 'pessoa' },
                { association: 'cargos' }
            ]
        });
        return objs;
    }

    async findByPk(req) {
        const { cpf } = req.params;
        const obj = await Colaborador.findByPk(cpf, {
            include: [
                { association: 'pessoa' },
                { association: 'cargos' }
            ]
        });
        return obj;
    }

    async create(req) {
        const { cpf, dataAdmissao, carga_horaria, nacionalidade, id_cargo } = req.body;

        if (!id_cargo) throw 'O Cargo do Colaborador deve ser preenchido!';

        const t = await sequelize.transaction();
        try {
            const obj = await Colaborador.create({
                cpf,
                dataAdmissao,
                carga_horaria,
                nacionalidade,
                id_cargo
            }, { transaction: t });

            await t.commit();

            return await Colaborador.findByPk(obj.cpf, {
                include: [
                    { association: 'pessoa' },
                    { association: 'cargos' }
                ]
            });
        } catch (error) {
            await t.rollback();
            throw "Erro ao criar colaborador: " + error.message;
        }
    }

    async update(req) {
        const { cpf } = req.params;
        const { dataAdmissao, carga_horaria, nacionalidade, id_cargo } = req.body;

        const obj = await Colaborador.findByPk(cpf, {
            include: [
                { association: 'pessoa' },
                { association: 'cargos' }
            ]
        });

        if (!obj) throw 'Colaborador não encontrado!';

        const t = await sequelize.transaction();
        try {
            Object.assign(obj, {
                dataAdmissao,
                carga_horaria,
                nacionalidade,
                id_cargo
            });

            await obj.save({ transaction: t });
            await t.commit();

            return await Colaborador.findByPk(obj.cpf, {
                include: [
                    { association: 'pessoa' },
                    { association: 'cargos' }
                ]
            });
        } catch (error) {
            await t.rollback();
            throw "Erro ao atualizar colaborador: " + error.message;
        }
    }

    async delete(req) {
        const { cpf } = req.params;
        const obj = await Colaborador.findByPk(cpf);
        if (!obj) throw 'Colaborador não encontrado!';

        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover este colaborador: " + error.message;
        }
    }
}

export { ColaboradorService };