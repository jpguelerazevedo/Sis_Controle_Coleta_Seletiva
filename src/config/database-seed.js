import { sequelize, models } from '../models/index.js';

const seedDatabase = async () => {
  try {
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = OFF;');
    }

    // Criar bairros
    const bairros = await Promise.all([
      models.Bairro.create({
        nome: 'Texeira leite',
        distancia_sede: 5,
        qnt_pessoas_cadastradas: 0,
        estado_de_acesso: 'Bom'
      }),
    ]);

    // Criar endereços
    const enderecos = await Promise.all([
      models.Endereco.create({
        numero: 123,
        rua: 'Dos bobos',
        referencia: 'Próximo ao Mercado',
        cep: '12345-678',
        id_bairro: bairros[0].id_bairro
      }),
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
        nome: 'Maria Silva',
        email: 'mariasilva@email.com',
        telefone: '(22) 22222-2222',
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
    ]);

    // Criar materiais
    const materiais = await Promise.all([
      models.Material.create({
        nome: 'Papel',
        peso: 50.00,
        volume: 2.5,
        nivelDeRisco: 'Baixo'
      }),
    ]);

    // Criar terceirizadas
    const terceirizadas = await Promise.all([
      models.Terceirizada.create({
        cnpj: '11.111.111/0001-11',
        nome: 'Reciclagem Express',
        telefone: '(11) 11111-1111',
        email: 'contato@reciclagemexpress.com',
        horarioDeFuncionamento: '8h-18h',
        estado: 'ativo'
      }),
      models.Terceirizada.create({
        cnpj: '22.222.222/0001-22',
        nome: 'Eco Processamento',
        telefone: '(22) 22222-2222',
        email: 'contato@ecoprocessamento.com',
        horarioDeFuncionamento: '10h-20h',
        estado: 'ativo'
      }),
      models.Terceirizada.create({
        cnpj: '33.333.333/0001-33',
        nome: 'Recicla Brasil',
        telefone: '(33) 33333-3333',
        email: 'contato@reciclabrasil.com',
        horarioDeFuncionamento: '12h-22h',
        estado: 'ativo'
      })
    ]);

    // Criar clientes
    const clientes = await Promise.all([
      models.Cliente.create({
        cpf: pessoas[0].cpf,
        turno_preferido_de_coleta: 'MANHA',
        status_cliente: 'ATIVO',
        frequencia_de_pedidos: 'SEMANAL',
        id_endereco: enderecos[0].id_endereco
      }),
    ]);

    // Criar colaboradores
    const colaboradores = await Promise.all([
      models.Colaborador.create({
        cpf: pessoas[1].cpf,
        id_cargo: cargos[0].idCargo,
        dataAdmissao: new Date(),
        carga_horaria: 36,
        nacionalidade: 'Brasileiro',
        estado: 'ativo' // Add the new attribute with a default value
      })
    ]);

    // Criar pedido de coleta
    const pedidos_coleta = await Promise.all([
      models.PedidoColeta.create({
        tipo: 'Papel',
        peso: 25.5,
        volume: 10.2,
        idMaterial: materiais[0].idMaterial,
        cpfCliente: clientes[0].cpf,
        cpfColaborador: colaboradores[0].cpf
      })
    ]);

    // Criar envio de materiais
    const envioMateriais = await Promise.all([
      models.EnvioMaterial.create({
        idMaterial: materiais[0].idMaterial,
        cnpj: terceirizadas[0].cnpj,
        pesoEnviado: 50.5
      })
    ]);

    console.log('Banco populado com sucesso!');

  } catch (error) {
    // Tratamento de erro detalhado
    console.error('Erro ao inserir dados na base de dados:');
    console.error('Mensagem:', error.message);
    if (error.original) {
      console.error('Erro original do banco:', error.original);
    }
    if (error.errors) {
      console.error('Erros específicos:', error.errors);
    }
  } finally {
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = ON;');
    }
  }
};

export { seedDatabase };
