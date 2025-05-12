import { sequelize, models } from '../models/index.js';

const seedDatabase = async() => {
    try {
        // Desabilitar foreign keys
        await sequelize.query('PRAGMA foreign_keys = OFF;');

        // Criar 4 bairros
        const bairros = await Promise.all([
            models.Bairro.create({
                nome: 'Texeira leite',
                distancia_sede: 5,
                qnt_pessoas_cadastradas: 0,
                estado_de_acesso: 'Bom'
            }),
            models.Bairro.create({
                nome: 'Zumbi',
                distancia_sede: 8,
                qnt_pessoas_cadastradas: 0,
                estado_de_acesso: 'Dificil'
            }),
            models.Bairro.create({
                nome: 'Valão',
                distancia_sede: 12,
                qnt_pessoas_cadastradas: 0,
                estado_de_acesso: 'Ruim'
            }),
            models.Bairro.create({
                nome: 'Aeroporto',
                distancia_sede: 15,
                qnt_pessoas_cadastradas: 0,
                estado_de_acesso: 'Bom'
            })
        ]);

        // Criar 4 endereços
        const enderecos = await Promise.all([
            models.Endereco.create({
                numero: 123,
                rua: 'Dos bobos',
                referencia: 'Próximo ao Mercado',
                cep: '12345-678',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 456,
                rua: 'Rua dos pelicanos',
                referencia: 'Em frente à Escola',
                cep: '87654-321',
                id_bairro: bairros[1].id_bairro
            }),
            models.Endereco.create({
                numero: 789,
                rua: 'Rua dos padeiros',
                referencia: 'Próximo ao Parque',
                cep: '98765-432',
                id_bairro: bairros[2].id_bairro
            }),
            models.Endereco.create({
                numero: 101,
                rua: 'Rua dos pelicanos',
                referencia: 'Próximo ao Shopping',
                cep: '45678-901',
                id_bairro: bairros[3].id_bairro
            })
        ]);

        // Criar pessoas
        const pessoas = await Promise.all([
            models.Pessoa.create({
                cpf: '111.111.111-11',
                nome: 'Jose Mourinho',
                email: 'josemourinho@email.com',
                telefone: '(11) 11111-1111',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '222.222.222-22',
                nome: 'Pepe guardiola',
                email: 'pepeg@email.com',
                telefone: '(22) 22222-2222',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '333.333.333-33',
                nome: 'Ancelotti',
                email: 'ancelotti@email.com',
                telefone: '(33) 33333-3333',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '444.444.444-44',
                nome: 'Zidane',
                email: 'zidane@email.com',
                telefone: '(44) 44444-4444',
                sexo: 'M'
            })
        ]);

        // Criar cargos
        const cargos = await Promise.all([
            models.Cargo.create({
                nomeCargo: 'Motorista',
                descricao: 'Responsável por realizar as coletas e entregas',
                hierarquia: 1,
                salario: 2500.00
            }),
            models.Cargo.create({
                nomeCargo: 'Coletor',
                descricao: 'Responsável por coletar os materiais',
                hierarquia: 2,
                salario: 2000.00
            }),
            models.Cargo.create({
                nomeCargo: 'Supervisor',
                descricao: 'Responsável por supervisionar as operações',
                hierarquia: 3,
                salario: 3500.00
            })
        ]);

        // Criar materiais
        const materiais = await Promise.all([
            models.Material.create({
                nome: 'Papel',
                peso: 150.00,
                volume: 2.5,
                nivelDeRisco: 'Baixo'
            }),
            models.Material.create({
                nome: 'Plástico',
                peso: 200.00,
                volume: 3.0,
                nivelDeRisco: 'Médio'
            }),
            models.Material.create({
                nome: 'Vidro',
                peso: 300.00,
                volume: 4.0,
                nivelDeRisco: 'Alto'
            })
        ]);

        // Criar terceirizadas
        const terceirizadas = await Promise.all([
            models.Terceirizada.create({
                cnpj: '11.111.111/0001-11',
                nome: 'Reciclagem Express',
                telefone: '(11) 11111-1111',
                email: 'contato@reciclagemexpress.com',
                horarioDeFuncionamento: 8
            }),
            models.Terceirizada.create({
                cnpj: '22.222.222/0001-22',
                nome: 'Eco Processamento',
                telefone: '(22) 22222-2222',
                email: 'contato@ecoprocessamento.com',
                horarioDeFuncionamento: 10
            }),
            models.Terceirizada.create({
                cnpj: '33.333.333/0001-33',
                nome: 'Recicla Brasil',
                telefone: '(33) 33333-3333',
                email: 'contato@reciclabrasil.com',
                horarioDeFuncionamento: 12
            })
        ]);

        // Criar clientes
        const clientes = await Promise.all([
            models.Cliente.create({
                cpf: pessoas[0].cpf,
                turno_preferido_de_coleta: 'Manhã',
                status_cliente: 'Ativo',
                frequencia_de_pedidos: 'Semanal',
                id_endereco: enderecos[0].id_endereco
            }),
            models.Cliente.create({
                cpf: pessoas[1].cpf,
                turno_preferido_de_coleta: 'Tarde',
                status_cliente: 'Ativo',
                frequencia_de_pedidos: 'Mensal',
                id_endereco: enderecos[1].id_endereco
            })
        ]);

        // Criar colaboradores
        const colaboradores = await Promise.all([
            models.Colaborador.create({
                cpf: pessoas[2].cpf,
                id_cargo: cargos[0].dataValues.idCargo,
                dataAdmissao: new Date(),
                carga_horaria: 36,
                nacionalidade: "Brasileiro"
            }),
            models.Colaborador.create({
                cpf: pessoas[3].cpf,
                id_cargo: cargos[0].dataValues.idCargo,
                dataAdmissao: new Date(),
                carga_horaria: 36,
                nacionalidade: "Brasileiro"
            })
        ]);

    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    } finally {
        // Reabilitar foreign keys
        await sequelize.query('PRAGMA foreign_keys = ON;');
    }
};

export { seedDatabase };