import { Endereco } from '../models/Endereco.js';

class EnderecoService {
    async findAll() {
        try {
            const enderecos = await Endereco.findAll({
                include: [
                    { association: 'bairro' }
                ]
            });
            return enderecos;
        } catch (error) {
            throw new Error('Erro ao buscar endereços: ' + error.message);
        }
    }

    async delete(idEndereco) {
        try {
            const endereco = await Endereco.findByPk(idEndereco);
            if (!endereco) {
                throw new Error('Endereço não encontrado.');
            }
            await endereco.destroy();
            return { message: 'Endereço deletado com sucesso.' };
        } catch (error) {
            throw new Error('Erro ao deletar endereço: ' + error.message);
        }
    }
}

export { EnderecoService };