import { Cliente } from "../models/Cliente.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';

class ClienteService {
    async findAll() {
        const objs = await Cliente.findAll({
            include: [
                { association: 'pessoa' },
                { association: 'endereco' }
            ]
        });
        return objs;
    }

    async findByPk(req) {
        const { cpf } = req.params;
        const obj = await Cliente.findByPk(cpf, {
            include: [
                { association: 'pessoa' },
                { association: 'endereco' }
            ]
        });
        return obj;
    }

    async create(req) {
        const { cpf, turno_preferido_de_coleta, status_cliente, frequencia_de_pedidos, id_endereco } = req.body;
        if (!id_endereco) throw 'O Endereço do Cliente deve ser preenchido!';

        const t = await sequelize.transaction();
        try {
            const obj = await Cliente.create({
                cpf,
                turno_preferido_de_coleta,
                status_cliente,
                frequencia_de_pedidos,
                id_endereco

            }, { transaction: t });

            await t.commit();
            return await Cliente.findByPk(obj.cpf, {
                include: [
                    { association: 'pessoa' },
                    { association: 'endereco' }
                ]
            });
        } catch (error) {
            await t.rollback();
            throw "Erro ao criar cliente: " + error.message;
        }
    }

    async update(req) {
        const { cpf } = req.params;
        const { turno_preferido_de_coleta, status_cliente, frequencia_de_pedidos, id_endereco } = req.body;

        const obj = await Cliente.findByPk(cpf, {
            include: [
                { association: 'pessoa' },
                { association: 'endereco' }
            ]
        });

        if (!obj) throw 'Cliente não encontrado!';

        const t = await sequelize.transaction();
        try {
            Object.assign(obj, {
                turno_preferido_de_coleta,
                status_cliente,
                frequencia_de_pedidos,
                id_endereco
            });

            await obj.save({ transaction: t });
            await t.commit();
            return await Cliente.findByPk(obj.cpf, {
                include: [
                    { association: 'pessoa' },
                    { association: 'endereco' }
                ]
            });
        } catch (error) {
            await t.rollback();
            throw "Erro ao atualizar cliente: " + error.message;
        }
    }

    async delete(req) {
        const { cpf } = req.params;
        const obj = await Cliente.findByPk(cpf);
        if (!obj) throw 'Cliente não encontrado!';

        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover este cliente: " + error.message;
        }
    }

    async findDevedores() {
        const objs = await sequelize.query("SELECT clientes.*  FROM emprestimos INNER JOIN clientes ON emprestimos.cliente_id = clientes.id INNER JOIN multas ON emprestimos.id = multas.emprestimo_id WHERE multas.pago = false", { type: QueryTypes.SELECT });
        return objs;
    }
}

export { ClienteService };