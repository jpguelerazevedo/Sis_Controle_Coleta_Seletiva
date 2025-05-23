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
            }),
            models.Endereco.create({
                numero: 202,
                rua: 'Rua das Flores',
                referencia: 'Próximo à Praça',
                cep: '23456-789',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 303,
                rua: 'Avenida Principal',
                referencia: 'Em frente ao Banco',
                cep: '34567-890',
                id_bairro: bairros[1].id_bairro
            }),
            models.Endereco.create({
                numero: 404,
                rua: 'Rua dos Coqueiros',
                referencia: 'Próximo à Padaria',
                cep: '45678-901',
                id_bairro: bairros[2].id_bairro
            }),
            models.Endereco.create({
                numero: 505,
                rua: 'Avenida Central',
                referencia: 'Em frente ao Posto',
                cep: '56789-012',
                id_bairro: bairros[3].id_bairro
            }),
            models.Endereco.create({
                numero: 606,
                rua: 'Rua das Palmeiras',
                referencia: 'Próximo à Farmácia',
                cep: '67890-123',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 707,
                rua: 'Avenida das Árvores',
                referencia: 'Em frente ao Supermercado',
                cep: '78901-234',
                id_bairro: bairros[1].id_bairro
            }),
            models.Endereco.create({
                numero: 808,
                rua: 'Rua dos Girassóis',
                referencia: 'Próximo à Escola',
                cep: '89012-345',
                id_bairro: bairros[2].id_bairro
            }),
            models.Endereco.create({
                numero: 909,
                rua: 'Avenida dos Ipês',
                referencia: 'Em frente à Igreja',
                cep: '90123-456',
                id_bairro: bairros[3].id_bairro
            }),
            models.Endereco.create({
                numero: 110,
                rua: 'Rua das Orquídeas',
                referencia: 'Próximo ao Hospital',
                cep: '01234-567',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 220,
                rua: 'Avenida das Margaridas',
                referencia: 'Em frente à Academia',
                cep: '12345-678',
                id_bairro: bairros[1].id_bairro
            }),
            models.Endereco.create({
                numero: 330,
                rua: 'Rua dos Lírios',
                referencia: 'Próximo ao Restaurante',
                cep: '23456-789',
                id_bairro: bairros[2].id_bairro
            }),
            models.Endereco.create({
                numero: 440,
                rua: 'Avenida das Rosas',
                referencia: 'Em frente à Biblioteca',
                cep: '34567-890',
                id_bairro: bairros[3].id_bairro
            }),
            models.Endereco.create({
                numero: 550,
                rua: 'Rua dos Cravos',
                referencia: 'Próximo à Lanchonete',
                cep: '45678-901',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 660,
                rua: 'Avenida das Tulipas',
                referencia: 'Em frente à Sorveteria',
                cep: '56789-012',
                id_bairro: bairros[1].id_bairro
            }),
            models.Endereco.create({
                numero: 770,
                rua: 'Rua dos Jasmins',
                referencia: 'Próximo à Loja',
                cep: '67890-123',
                id_bairro: bairros[2].id_bairro
            }),
            models.Endereco.create({
                numero: 880,
                rua: 'Avenida das Hortênsias',
                referencia: 'Em frente ao Café',
                cep: '78901-234',
                id_bairro: bairros[3].id_bairro
            }),
            models.Endereco.create({
                numero: 990,
                rua: 'Rua das Violetas',
                referencia: 'Próximo à Pizzaria',
                cep: '89012-345',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 111,
                rua: 'Avenida das Begônias',
                referencia: 'Em frente à Loja de Roupas',
                cep: '90123-456',
                id_bairro: bairros[1].id_bairro
            }),
            models.Endereco.create({
                numero: 222,
                rua: 'Rua dos Crisântemos',
                referencia: 'Próximo à Casa de Carnes',
                cep: '01234-567',
                id_bairro: bairros[2].id_bairro
            }),
            models.Endereco.create({
                numero: 333,
                rua: 'Avenida das Azaleias',
                referencia: 'Em frente à Papelaria',
                cep: '12345-678',
                id_bairro: bairros[3].id_bairro
            }),
            models.Endereco.create({
                numero: 444,
                rua: 'Rua dos Antúrios',
                referencia: 'Próximo à Casa de Material',
                cep: '23456-789',
                id_bairro: bairros[0].id_bairro
            }),
            models.Endereco.create({
                numero: 555,
                rua: 'Avenida das Bromélias',
                referencia: 'Em frente à Casa de Construção',
                cep: '34567-890',
                id_bairro: bairros[1].id_bairro
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
                nome: 'Pepe Guardiola',
                email: 'pepeg@email.com',
                telefone: '(22) 22222-2222',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '333.333.333-33',
                nome: 'Carlo Ancelotti',
                email: 'ancelotti@email.com',
                telefone: '(33) 33333-3333',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '444.444.444-44',
                nome: 'Zinedine Zidane',
                email: 'zidane@email.com',
                telefone: '(44) 44444-4444',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '555.555.555-55',
                nome: 'Cristiano Ronaldo',
                email: 'ronaldo@email.com',
                telefone: '(55) 55555-5555',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '666.666.666-66',
                nome: 'Neymar Jr',
                email: 'neymar@email.com',
                telefone: '(66) 66666-6666',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '777.777.777-77',
                nome: 'Lionel Messi',
                email: 'messi@email.com',
                telefone: '(77) 77777-7777',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '888.888.888-88',
                nome: 'Maria Silva',
                email: 'mariasilva@email.com',
                telefone: '(88) 88888-8888',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '999.999.999-99',
                nome: 'Ana Oliveira',
                email: 'anaoliveira@email.com',
                telefone: '(99) 99999-9999',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '101.101.101-10',
                nome: 'João Santos',
                email: 'joaosantos@email.com',
                telefone: '(10) 10101-1010',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '202.202.202-20',
                nome: 'Pedro Costa',
                email: 'pedrocosta@email.com',
                telefone: '(20) 20202-2020',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '303.303.303-30',
                nome: 'Carla Ferreira',
                email: 'carlaferreira@email.com',
                telefone: '(30) 30303-3030',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '404.404.404-40',
                nome: 'Lucas Martins',
                email: 'lucasmartins@email.com',
                telefone: '(40) 40404-4040',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '505.505.505-50',
                nome: 'Juliana Lima',
                email: 'julianalima@email.com',
                telefone: '(50) 50505-5050',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '606.606.606-60',
                nome: 'Rafael Souza',
                email: 'rafaelsouza@email.com',
                telefone: '(60) 60606-6060',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '707.707.707-70',
                nome: 'Fernanda Alves',
                email: 'fernandaalves@email.com',
                telefone: '(70) 70707-7070',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '808.808.808-80',
                nome: 'Bruno Pereira',
                email: 'brunopereira@email.com',
                telefone: '(80) 80808-8080',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '909.909.909-90',
                nome: 'Patricia Gomes',
                email: 'patriciagomes@email.com',
                telefone: '(90) 90909-9090',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '010.010.010-01',
                nome: 'Marcelo Dias',
                email: 'marcelodias@email.com',
                telefone: '(01) 01010-0101',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '020.020.020-02',
                nome: 'Camila Rodrigues',
                email: 'camilarodrigues@email.com',
                telefone: '(02) 02020-0202',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '030.030.030-03',
                nome: 'Ricardo Mendes',
                email: 'ricardomendes@email.com',
                telefone: '(03) 03030-0303',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '040.040.040-04',
                nome: 'Beatriz Castro',
                email: 'beatrizcastro@email.com',
                telefone: '(04) 04040-0404',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '050.050.050-05',
                nome: 'Gabriel Santos',
                email: 'gabrielsantos@email.com',
                telefone: '(05) 05050-0505',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '060.060.060-06',
                nome: 'Isabela Costa',
                email: 'isabelacosta@email.com',
                telefone: '(06) 06060-0606',
                sexo: 'F'
            }),
            models.Pessoa.create({
                cpf: '070.070.070-07',
                nome: 'Diego Oliveira',
                email: 'diegooliveira@email.com',
                telefone: '(07) 07070-0707',
                sexo: 'M'
            }),
            models.Pessoa.create({
                cpf: '080.080.080-08',
                nome: 'Larissa Ferreira',
                email: 'larissaferreira@email.com',
                telefone: '(08) 08080-0808',
                sexo: 'F'
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
                peso: 50.00,
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

        // Create clients for all people
        const clientes = await Promise.all([
            models.Cliente.create({
                cpf: '111.111.111-11',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 1
            }),
            models.Cliente.create({
                cpf: '222.222.222-22',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 2
            }),
            models.Cliente.create({
                cpf: '333.333.333-33',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 3
            }),
            models.Cliente.create({
                cpf: '444.444.444-44',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 4
            }),
            models.Cliente.create({
                cpf: '555.555.555-55',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 5
            }),
            models.Cliente.create({
                cpf: '666.666.666-66',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 6
            }),
            models.Cliente.create({
                cpf: '777.777.777-77',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 7
            }),
            models.Cliente.create({
                cpf: '888.888.888-88',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 8
            }),
            models.Cliente.create({
                cpf: '999.999.999-99',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 9
            }),
            models.Cliente.create({
                cpf: '101.101.101-10',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 10
            }),
            models.Cliente.create({
                cpf: '202.202.202-20',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 11
            }),
            models.Cliente.create({
                cpf: '303.303.303-30',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 12
            }),
            models.Cliente.create({
                cpf: '404.404.404-40',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 13
            }),
            models.Cliente.create({
                cpf: '505.505.505-50',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 14
            }),
            models.Cliente.create({
                cpf: '606.606.606-60',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 15
            }),
            models.Cliente.create({
                cpf: '707.707.707-70',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 16
            }),
            models.Cliente.create({
                cpf: '808.808.808-80',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 17
            }),
            models.Cliente.create({
                cpf: '909.909.909-90',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 18
            }),
            models.Cliente.create({
                cpf: '010.010.010-01',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 19
            }),
            models.Cliente.create({
                cpf: '020.020.020-02',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 20
            }),
            models.Cliente.create({
                cpf: '030.030.030-03',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 21
            }),
            models.Cliente.create({
                cpf: '040.040.040-04',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 22
            }),
            models.Cliente.create({
                cpf: '050.050.050-05',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 23
            }),
            models.Cliente.create({
                cpf: '060.060.060-06',
                turno_preferido_de_coleta: 'NOITE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
                id_endereco: 24
            }),
            models.Cliente.create({
                cpf: '070.070.070-07',
                turno_preferido_de_coleta: 'MANHA',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'SEMANAL',
                id_endereco: 25
            }),
            models.Cliente.create({
                cpf: '080.080.080-08',
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'QUINZENAL',
                id_endereco: 26
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

        const pedidos_coleta = await Promise.all([
            models.PedidoColeta.create({
                tipo: "Papel",
                peso: 25.5,
                volume: 10.2,
                idMaterial: 1,
                cpfCliente: "111.111.111-11",
                cpfColaborador: "444.444.444-44"
            })
        ])

        const EnvioMateriais = await Promise.all([
            models.EnvioMaterial.create({
                idMaterial: 2,
                cnpj: "11.111.111/0001-11",
                pesoEnviado: 50.5
            })
        ])



    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    } finally {
        // Reabilitar foreign keys
        await sequelize.query('PRAGMA foreign_keys = ON;');
    }
};

export { seedDatabase };