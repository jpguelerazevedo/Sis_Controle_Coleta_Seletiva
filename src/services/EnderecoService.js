import { Endereco } from '../models/Endereco.js';
import { Bairro } from '../models/Bairro.js';
import { Cliente } from '../models/Cliente.js';
import { Colaborador } from '../models/Colaborador.js';

class EnderecoService {
    async findAll() {
        try {
            const enderecos = await Endereco.findAll({
                include: [{
                    model: Bairro,
                    as: 'bairro',
                    attributes: ['id_bairro', 'nome'] // Ajustado para id_bairro
                }]
            });
            return enderecos;
        } catch (error) {
            throw new Error('Erro ao buscar endereços: ' + error.message);
        }
    }

    async findByPk(idEndereco) {
        try {
            const endereco = await Endereco.findByPk(idEndereco, {
                include: [{
                    model: Bairro,
                    as: 'bairro',
                    attributes: ['id_bairro', 'nome'] // Ajustado para id_bairro
                }]
            });

            if (!endereco) {
                throw new Error('Endereço não encontrado.');
            }

            return endereco;
        } catch (error) {
            throw new Error('Erro ao buscar endereço: ' + error.message);
        }
    }

    async create(enderecoData) {
        try {
            console.log('Dados recebidos no serviço:', enderecoData);

            // Validação dos campos obrigatórios
            if (!enderecoData.rua || !enderecoData.numero || !enderecoData.cep || !enderecoData.id_bairro) {
                throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
            }

            // Verifica se o bairro existe
            const bairro = await Bairro.findByPk(enderecoData.id_bairro);
            if (!bairro) {
                throw new Error('Bairro não encontrado.');
            }

            // Converte o número para inteiro
            const numero = parseInt(enderecoData.numero, 10);
            if (isNaN(numero)) {
                throw new Error('Número inválido.');
            }

            // Cria o endereço com os campos corretos
            const endereco = await Endereco.create({
                rua: enderecoData.rua.trim(),
                numero: numero,
                cep: enderecoData.cep.trim(),
                referencia: enderecoData.referencia ? .trim() || null,
                id_bairro: enderecoData.id_bairro
            });

            console.log('Endereço criado:', endereco.toJSON());

            // Retorna o endereço com os dados do bairro
            return this.findByPk(endereco.id_endereco);
        } catch (error) {
            console.error('Erro ao criar endereço:', error);
            throw new Error('Erro ao criar endereço: ' + error.message);
        }
    }

    async update(idEndereco, enderecoData) {
        try {
            const endereco = await Endereco.findByPk(idEndereco);
            if (!endereco) {
                throw new Error('Endereço não encontrado.');
            }

            // Se estiver atualizando o bairro, verifica se ele existe
            if (enderecoData.id_bairro) { // Ajustado para id_bairro
                const bairro = await Bairro.findByPk(enderecoData.id_bairro);
                if (!bairro) {
                    throw new Error('Bairro não encontrado.');
                }
            }

            // Atualiza com os campos corretos
            await endereco.update({
                rua: enderecoData.rua,
                numero: enderecoData.numero,
                cep: enderecoData.cep,
                referencia: enderecoData.referencia,
                id_bairro: enderecoData.id_bairro // Ajustado para id_bairro
            });

            // Retorna o endereço atualizado com os dados do bairro
            return this.findByPk(idEndereco);
        } catch (error) {
            throw new Error('Erro ao atualizar endereço: ' + error.message);
        }
    }

    async delete(idEndereco) {
        try {
            const endereco = await Endereco.findByPk(idEndereco);
            if (!endereco) {
                throw new Error('Endereço não encontrado.');
            }

            // Verifica se o endereço está em uso por algum cliente
            const clienteComEndereco = await Cliente.findOne({
                where: { id_endereco: idEndereco } // Ajustado para id_endereco
            });

            // Verifica se o endereço está em uso por algum colaborador
            const colaboradorComEndereco = await Colaborador.findOne({
                where: { id_endereco: idEndereco } // Ajustado para id_endereco
            });

            if (clienteComEndereco || colaboradorComEndereco) {
                throw new Error('Não é possível deletar este endereço pois está em uso.');
            }

            await endereco.destroy();
            return { message: 'Endereço deletado com sucesso.' };
        } catch (error) {
            throw new Error('Erro ao deletar endereço: ' + error.message);
        }
    }
}

export { EnderecoService };