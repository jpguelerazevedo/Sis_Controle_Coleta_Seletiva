import axios from "axios";

// Define todos os payloads (com os nomes de rota como chave)
const payloads = {
    bairros: {
        nome: 'Texeira leite',
        distancia_sede: 5,
        qnt_pessoas_cadastradas: 0,
        estado_de_acesso: 'Bom'
    },
    endereco: {
        numero: 123,
        rua: 'Dos bobos',
        referencia: 'Próximo ao Mercado',
        cep: '12345-678',
        id_bairro: 1
    },
    pessoas: {
        cpf: '111.111.111-11',
        nome: 'Jose Mourinho',
        email: 'josemourinho@email.com',
        telefone: '(11) 11111-1111',
        sexo: 'M'
    },
    cargos: {
        nomeCargo: 'Motorista',
        descricao: 'Responsável por realizar as coletas e entregas',
        hierarquia: 1,
        salario: 2500.00
    },
    materiais: {
        nome: 'Papel',
        peso: 50.00,
        volume: 2.5,
        nivelDeRisco: 'Baixo'
    },
    terceirizadas: {
        cnpj: '11.111.111/0001-11',
        nome: 'Reciclagem Express',
        telefone: '(11) 11111-1111',
        email: 'contato@reciclagemexpress.com',
        horarioDeFuncionamento: '8h-18h',
        estado: 'ativo'
    },
    clientes: {
        cpf: '111.111.111-11',
        turno_preferido_de_coleta: 'MANHA',
        status_cliente: 'ATIVO',
        frequencia_de_pedidos: 'SEMANAL',
        id_endereco: 1
    },
    colaboradores: {
        cpf: '222.222.222-22',
        id_cargo: 1,
        dataAdmissao: new Date().toISOString(),
        carga_horaria: 36,
        nacionalidade: 'Brasileiro',
        estado: 'ativo'
    },
    pedidos_coleta: {
        tipo: 'Papel',
        peso: 25.5,
        volume: 10.2,
        id_material: 1,
        cpf_cliente: '111.111.111-11',
        cpf_colaborador: '222.222.222-22'
    },
    envios_material: {
        id_material: 1,
        cnpj: '11.111.111/0001-11',
        peso_enviado: 50.5,
        volume_enviado: 0
    }
};

// Envia os dados para todas as rotas
for (const [recurso, payload] of Object.entries(payloads)) {
    const url = `https://scv-w0i2.onrender.com/${recurso}`;
    try {
        const response = await axios.post(url, payload);
        console.log(`✅ [${recurso}] Status: ${response.status}`);
        console.log(`Resposta:`, response.data);
    } catch (error) {
        if (error.response) {
            console.error(`❌ [${recurso}] Erro ${error.response.status}:`, error.response.data);
        } else {
            console.error(`❌ [${recurso}] Erro:`, error.message);
        }
    }
}
