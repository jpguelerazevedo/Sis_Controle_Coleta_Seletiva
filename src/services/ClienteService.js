import { Cliente } from "../models/Cliente.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';

class ClienteService {
    async findAll() {
        return await Cliente.findAll({
            include: ['pessoa', 'endereco']
        });
    }

    async findByPk(cpf) {
        return await Cliente.findByPk(cpf, {
            include: ['pessoa', 'endereco']
        });
    }

    async create(req) {
        const { cpf, turno_preferido_de_coleta, status_cliente, frequencia_de_pedidos, id_endereco } = req.body;

        if (!id_endereco) throw new Error('O Endereço do Cliente deve ser preenchido!');

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
            return await this.findByPk(obj.cpf);
        } catch (error) {
            await t.rollback();
            console.error('Erro detalhado:', error);

            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(e => e.message).join(', ');
                throw new Error(`Erro de validação: ${validationErrors}`);
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('CPF já cadastrado');
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                if (error.message.includes('pessoas')) {
                    throw new Error('CPF não encontrado na tabela de pessoas');
                }
                if (error.message.includes('enderecos')) {
                    throw new Error('Endereço não encontrado');
                }
            }

            throw new Error("Erro ao criar cliente: " + error.message);
        }
    }

    async update(req) {
        const { cpf } = req.params;
        const { turno_preferido_de_coleta, status_cliente, frequencia_de_pedidos, id_endereco } = req.body;

        const obj = await this.findByPk(cpf);
        if (!obj) throw new Error('Cliente não encontrado!');

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
            return await this.findByPk(obj.cpf);
        } catch (error) {
            await t.rollback();
            throw new Error("Erro ao atualizar cliente: " + error.message);
        }
    }

    async delete(cpf) {
        const obj = await this.findByPk(cpf);
        if (!obj) throw new Error('Cliente não encontrado!');

        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw new Error("Não é possível remover este cliente: " + error.message);
        }
    }

    async findDevedores() {
        const objs = await sequelize.query(`
            SELECT DISTINCT clientes.* 
            FROM emprestimos 
            INNER JOIN clientes ON emprestimos.cliente_id = clientes.cpf 
            INNER JOIN multas ON emprestimos.id = multas.emprestimo_id 
            WHERE multas.pago = false
        `, { type: QueryTypes.SELECT });
        return objs;
    }
}

export { ClienteService };