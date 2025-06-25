import axios from "axios";


async function main() {

    const pessoas = [{
        cpf: '22222222222',
        nome: 'Colaborador Exemplo 1',
        email: 'colab1@email.com',
        telefone: '(11) 90000-0001',
        sexo: 'M'
    },
    {
        cpf: '33333333333',
        nome: 'Colaborador Exemplo 2',
        email: 'colab2@email.com',
        telefone: '(11) 90000-0002',
        sexo: 'F'
    },
    {
        cpf: '11111111111',
        nome: 'Cliente Exemplo 1',
        email: 'cliente1@email.com',
        telefone: '(11) 90000-0003',
        sexo: 'F'
    },
    {
        cpf: '44444444444',
        nome: 'Cliente Exemplo 2',
        email: 'cliente2@email.com',
        telefone: '(11) 90000-0004',
        sexo: 'M'
    },
    // Novos colaboradores
    {
        cpf: '55555555555',
        nome: 'Colaborador Exemplo 3',
        email: 'colab3@email.com',
        telefone: '(11) 90000-0005',
        sexo: 'M'
    },
    {
        cpf: '66666666666',
        nome: 'Colaborador Exemplo 4',
        email: 'colab4@email.com',
        telefone: '(11) 90000-0006',
        sexo: 'F'
    },
    {
        cpf: '77777777777',
        nome: 'Colaborador Exemplo 5',
        email: 'colab5@email.com',
        telefone: '(11) 90000-0007',
        sexo: 'M'
    },
    {
        cpf: '88888888888',
        nome: 'Colaborador Exemplo 6',
        email: 'colab6@email.com',
        telefone: '(11) 90000-0008',
        sexo: 'F'
    },
    // Novos clientes
    {
        cpf: '99999999999',
        nome: 'Cliente Exemplo 3',
        email: 'cliente3@email.com',
        telefone: '(11) 90000-0009',
        sexo: 'M'
    },
    {
        cpf: '10101010101',
        nome: 'Cliente Exemplo 4',
        email: 'cliente4@email.com',
        telefone: '(11) 90000-0010',
        sexo: 'F'
    },
    {
        cpf: '12121212121',
        nome: 'Cliente Exemplo 5',
        email: 'cliente5@email.com',
        telefone: '(11) 90000-0011',
        sexo: 'M'
    },
    {
        cpf: '13131313131',
        nome: 'Cliente Exemplo 6',
        email: 'cliente6@email.com',
        telefone: '(11) 90000-0012',
        sexo: 'F'
    }
    ];


    const payloadsList = [{
        bairros: {
            nome: 'Zumbi',
            distancia_sede: 5,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Médio'
        },
        enderecos: {
            numero: 123,
            rua: 'Rua dos Bobos',
            referencia: 'Próximo ao Mercado',
            cep: '12345-678',
            id_bairro: 1
        },
        cargos: {
            nomeCargo: 'Motorista',
            descricao: 'Responsável por coletas',
            hierarquia: 1,
            salario: 2500.00
        },
        materiais: {
            nome: 'Papel',
            peso: 500.00,
            volume: 20.5,
            nivelDeRisco: 'Baixo'
        },
        terceirizadas: {
            cnpj: '11111111000111',
            nome: 'Reciclagem Express',
            telefone: '(11) 11111-1111',
            email: 'contato@reciclagemexpress.com',
            horarioDeFuncionamento: '8h-18h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '11111111111',
            turno_preferido_de_coleta: 'Manha',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'SEMANAL',
            id_endereco: 1
        },
        colaboradores: {
            cpf: '22222222222',
            id_cargo: 1,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 36,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Papel",
            peso: 25.5,
            volume: 10.2,
            idMaterial: 1,
            cpfCliente: '11111111111',
            cpfColaborador: '22222222222'
        },
        "envios-material": {
            idMaterial: 1,
            cnpj: '11111111000111',
            pesoEnviado: 50.5,
            volumeEnviado: 10
        }
    },
    {
        bairros: {
            nome: 'Centro',
            distancia_sede: 2,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Fácil'
        },
        enderecos: {
            numero: 456,
            rua: 'Av. Central',
            referencia: 'Em frente à praça',
            cep: '98765-432',
            id_bairro: 2
        },
        cargos: {
            nomeCargo: 'Coletor',
            descricao: 'Auxilia nas coletas',
            hierarquia: 2,
            salario: 1800.00
        },
        materiais: {
            nome: 'Vidro',
            peso: 300.00,
            volume: 15.0,
            nivelDeRisco: 'Médio'
        },
        terceirizadas: {
            cnpj: '22222222000122',
            nome: 'EcoLogística',
            telefone: '(11) 22222-2222',
            email: 'contato@ecologistica.com',
            horarioDeFuncionamento: '7h-17h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '44444444444',
            turno_preferido_de_coleta: 'Tarde',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'Mensal',
            id_endereco: 2
        },
        colaboradores: {
            cpf: '33333333333',
            id_cargo: 2,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 40,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Vidro",
            peso: 15.0,
            volume: 5.0,
            idMaterial: 2,
            cpfCliente: '44444444444',
            cpfColaborador: '33333333333'
        },
        "envios-material": {
            idMaterial: 2,
            cnpj: '22222222000122',
            pesoEnviado: 30.0,
            volumeEnviado: 6
        }
    },
    // Novo cliente 3
    {
        bairros: {
            nome: 'Jardim Esperança',
            distancia_sede: 7,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Fácil'
        },
        enderecos: {
            numero: 789,
            rua: 'Rua da Paz',
            referencia: 'Próximo à escola',
            cep: '22222-333',
            id_bairro: 3
        },
        cargos: {
            nomeCargo: 'Auxiliar',
            descricao: 'Auxilia nas tarefas',
            hierarquia: 3,
            salario: 1700.00
        },
        materiais: {
            nome: 'Metal',
            peso: 120.00,
            volume: 8.0,
            nivelDeRisco: 'Médio'
        },
        terceirizadas: {
            cnpj: '33333333000133',
            nome: 'MetalRecicla',
            telefone: '(11) 33333-3333',
            email: 'contato@metalrecicla.com',
            horarioDeFuncionamento: '9h-19h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '99999999999', // Pessoa nova associada
            turno_preferido_de_coleta: 'Noite',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'Quinzenal',
            id_endereco: 3
        },
        colaboradores: {
            cpf: '55555555555',
            id_cargo: 3,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 40,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Metal",
            peso: 12.0,
            volume: 4.0,
            idMaterial: 3,
            cpfCliente: '99999999999',
            cpfColaborador: '55555555555'
        },
        "envios-material": {
            idMaterial: 3,
            cnpj: '33333333000133',
            pesoEnviado: 24.0,
            volumeEnviado: 5
        }
    },
    // Novo cliente 4
    {
        bairros: {
            nome: 'Vila Nova',
            distancia_sede: 4,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Médio'
        },
        enderecos: {
            numero: 101,
            rua: 'Rua Nova',
            referencia: 'Ao lado do mercado',
            cep: '44444-555',
            id_bairro: 4
        },
        cargos: {
            nomeCargo: 'Supervisor',
            descricao: 'Supervisiona equipes',
            hierarquia: 4,
            salario: 3000.00
        },
        materiais: {
            nome: 'Plástico',
            peso: 200.00,
            volume: 10.0,
            nivelDeRisco: 'Baixo'
        },
        terceirizadas: {
            cnpj: '44444444000144',
            nome: 'PlastiColeta',
            telefone: '(11) 44444-4444',
            email: 'contato@plasticole.com',
            horarioDeFuncionamento: '6h-16h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '10101010101', // Pessoa nova associada
            turno_preferido_de_coleta: 'Tarde',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'Mensal',
            id_endereco: 4
        },
        colaboradores: {
            cpf: '66666666666',
            id_cargo: 4,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 36,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Plástico",
            peso: 18.0,
            volume: 7.0,
            idMaterial: 4,
            cpfCliente: '10101010101',
            cpfColaborador: '66666666666'
        },
        "envios-material": {
            idMaterial: 4,
            cnpj: '44444444000144',
            pesoEnviado: 36.0,
            volumeEnviado: 8
        }
    },
    // Novo cliente 5
    {
        bairros: {
            nome: 'Bela Vista',
            distancia_sede: 6,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Fácil'
        },
        enderecos: {
            numero: 202,
            rua: 'Rua Bela',
            referencia: 'Próximo ao parque',
            cep: '66666-777',
            id_bairro: 5
        },
        cargos: {
            nomeCargo: 'Gerente',
            descricao: 'Gerencia operações',
            hierarquia: 5,
            salario: 4000.00
        },
        materiais: {
            nome: 'Orgânico',
            peso: 300.00,
            volume: 12.0,
            nivelDeRisco: 'Baixo'
        },
        terceirizadas: {
            cnpj: '55555555000155',
            nome: 'OrganiColeta',
            telefone: '(11) 55555-5555',
            email: 'contato@organicole.com',
            horarioDeFuncionamento: '8h-20h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '12121212121', // Pessoa nova associada
            turno_preferido_de_coleta: 'Manha',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'SEMANAL',
            id_endereco: 5
        },
        colaboradores: {
            cpf: '77777777777',
            id_cargo: 5,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 44,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Orgânico",
            peso: 22.0,
            volume: 9.0,
            idMaterial: 5,
            cpfCliente: '12121212121',
            cpfColaborador: '77777777777'
        },
        "envios-material": {
            idMaterial: 5,
            cnpj: '55555555000155',
            pesoEnviado: 44.0,
            volumeEnviado: 10
        }
    },
    // Novo cliente 6
    {
        bairros: {
            nome: 'Industrial',
            distancia_sede: 9,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Difícil'
        },
        enderecos: {
            numero: 303,
            rua: 'Av. Industrial',
            referencia: 'Próximo à fábrica',
            cep: '88888-999',
            id_bairro: 6
        },
        cargos: {
            nomeCargo: 'Operador',
            descricao: 'Opera máquinas',
            hierarquia: 6,
            salario: 2200.00
        },
        materiais: {
            nome: 'Eletrônico',
            peso: 80.00,
            volume: 3.0,
            nivelDeRisco: 'Alto'
        },
        terceirizadas: {
            cnpj: '66666666000166',
            nome: 'EletroRecicla',
            telefone: '(11) 66666-6666',
            email: 'contato@eletroricla.com',
            horarioDeFuncionamento: '10h-22h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '13131313131', // Pessoa nova associada
            turno_preferido_de_coleta: 'Noite',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'Diario',
            id_endereco: 6
        },
        colaboradores: {
            cpf: '88888888888',
            id_cargo: 6,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 48,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Eletrônico",
            peso: 6.0,
            volume: 2.0,
            idMaterial: 6,
            cpfCliente: '13131313131',
            cpfColaborador: '88888888888'
        },
        "envios-material": {
            idMaterial: 6,
            cnpj: '66666666000166',
            pesoEnviado: 12.0,
            volumeEnviado: 3
        }
    },
    // Novo colaborador 3
    {
        bairros: {
            nome: 'Residencial Sol',
            distancia_sede: 8,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Fácil'
        },
        enderecos: {
            numero: 404,
            rua: 'Rua do Sol',
            referencia: 'Próximo à padaria',
            cep: '14141-414',
            id_bairro: 7
        },
        cargos: {
            nomeCargo: 'Analista',
            descricao: 'Analisa processos',
            hierarquia: 7,
            salario: 2800.00
        },
        materiais: {
            nome: 'Borracha',
            peso: 60.00,
            volume: 2.5,
            nivelDeRisco: 'Baixo'
        },
        terceirizadas: {
            cnpj: '77777777000177',
            nome: 'BorrachaRecicla',
            telefone: '(11) 77777-7777',
            email: 'contato@borracharecicla.com',
            horarioDeFuncionamento: '7h-15h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '11111111111',
            turno_preferido_de_coleta: 'Tarde',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'Mensal',
            id_endereco: 7
        },
        colaboradores: {
            cpf: '55555555555', // Pessoa nova associada
            id_cargo: 7,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 40,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Borracha",
            peso: 8.0,
            volume: 2.0,
            idMaterial: 7,
            cpfCliente: '11111111111',
            cpfColaborador: '55555555555'
        },
        "envios-material": {
            idMaterial: 7,
            cnpj: '77777777000177',
            pesoEnviado: 16.0,
            volumeEnviado: 3
        }
    },
    // Novo colaborador 4
    {
        bairros: {
            nome: 'Parque Verde',
            distancia_sede: 11,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Médio'
        },
        enderecos: {
            numero: 505,
            rua: 'Rua Verde',
            referencia: 'Próximo ao parque',
            cep: '15151-515',
            id_bairro: 8
        },
        cargos: {
            nomeCargo: 'Técnico',
            descricao: 'Técnico de campo',
            hierarquia: 8,
            salario: 2600.00
        },
        materiais: {
            nome: 'Têxtil',
            peso: 90.00,
            volume: 4.0,
            nivelDeRisco: 'Médio'
        },
        terceirizadas: {
            cnpj: '88888888000188',
            nome: 'TextilRecicla',
            telefone: '(11) 88888-8888',
            email: 'contato@textilrecicla.com',
            horarioDeFuncionamento: '8h-18h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '44444444444',
            turno_preferido_de_coleta: 'Manha',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'SEMANAL',
            id_endereco: 8
        },
        colaboradores: {
            cpf: '66666666666', // Pessoa nova associada
            id_cargo: 8,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 36,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Têxtil",
            peso: 10.0,
            volume: 3.0,
            idMaterial: 8,
            cpfCliente: '44444444444',
            cpfColaborador: '66666666666'
        },
        "envios-material": {
            idMaterial: 8,
            cnpj: '88888888000188',
            pesoEnviado: 20.0,
            volumeEnviado: 4
        }
    },
    // Novo colaborador 5
    {
        bairros: {
            nome: 'Jardim Azul',
            distancia_sede: 13,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Difícil'
        },
        enderecos: {
            numero: 606,
            rua: 'Rua Azul',
            referencia: 'Próximo ao lago',
            cep: '16161-616',
            id_bairro: 9
        },
        cargos: {
            nomeCargo: 'Motorista',
            descricao: 'Motorista de caminhão',
            hierarquia: 9,
            salario: 2300.00
        },
        materiais: {
            nome: 'Madeira',
            peso: 150.00,
            volume: 6.0,
            nivelDeRisco: 'Médio'
        },
        terceirizadas: {
            cnpj: '99999999000199',
            nome: 'MadeiraRecicla',
            telefone: '(11) 99999-9999',
            email: 'contato@madeirarecicla.com',
            horarioDeFuncionamento: '6h-14h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '12121212121',
            turno_preferido_de_coleta: 'Tarde',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'Mensal',
            id_endereco: 9
        },
        colaboradores: {
            cpf: '77777777777', // Pessoa nova associada
            id_cargo: 9,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 44,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Madeira",
            peso: 15.0,
            volume: 5.0,
            idMaterial: 9,
            cpfCliente: '12121212121',
            cpfColaborador: '77777777777'
        },
        "envios-material": {
            idMaterial: 9,
            cnpj: '99999999000199',
            pesoEnviado: 30.0,
            volumeEnviado: 6
        }
    },
    // Novo colaborador 6
    {
        bairros: {
            nome: 'Centro Antigo',
            distancia_sede: 5,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Difícil'
        },
        enderecos: {
            numero: 707,
            rua: 'Rua Antiga',
            referencia: 'Próximo ao museu',
            cep: '17171-717',
            id_bairro: 10
        },
        cargos: {
            nomeCargo: 'Auxiliar',
            descricao: 'Auxiliar de limpeza',
            hierarquia: 10,
            salario: 1500.00
        },
        materiais: {
            nome: 'Resíduo',
            peso: 40.00,
            volume: 1.5,
            nivelDeRisco: 'Alto'
        },
        terceirizadas: {
            cnpj: '10101010000110',
            nome: 'ResíduoRecicla',
            telefone: '(11) 10101-0101',
            email: 'contato@residuorecicla.com',
            horarioDeFuncionamento: '7h-13h',
            estado: 'ativo'
        },
        clientes: {
            cpf: '13131313131',
            turno_preferido_de_coleta: 'Noite',
            status_cliente: 'ATIVO',
            frequencia_de_pedidos: 'ANUAL',
            id_endereco: 10
        },
        colaboradores: {
            cpf: '88888888888', // Pessoa nova associada
            id_cargo: 10,
            dataAdmissao: new Date().toISOString(),
            carga_horaria: 48,
            nacionalidade: 'Brasileiro',
            estado: 'ativo'
        },
        "pedidos-coleta": {
            tipo: "Resíduo",
            peso: 4.0,
            volume: 1.0,
            idMaterial: 10,
            cpfCliente: '13131313131',
            cpfColaborador: '88888888888'
        },
        "envios-material": {
            idMaterial: 10,
            cnpj: '10101010000110',
            pesoEnviado: 8.0,
            volumeEnviado: 2
        }
    },
    // Recebimento de material 1
    {
        "recebimentos-material": {
            peso: 10.5,
            volume: 2.1,
            idMaterial: 1,
            cpfCliente: '11111111111',
            cpfColaborador: '22222222222'
        }
    },
    // Recebimento de material 2
    {
        "recebimentos-material": {
            peso: 20.0,
            volume: 3.5,
            idMaterial: 2,
            cpfCliente: '44444444444',
            cpfColaborador: '33333333333'
        }
    },
    // Recebimento de material 3
    {
        "recebimentos-material": {
            peso: 15.2,
            volume: 4.0,
            idMaterial: 3,
            cpfCliente: '99999999999',
            cpfColaborador: '55555555555'
        }
    },
    // Recebimento de material 4
    {
        "recebimentos-material": {
            peso: 8.8,
            volume: 1.7,
            idMaterial: 4,
            cpfCliente: '10101010101',
            cpfColaborador: '66666666666'
        }
    },
    // Recebimento de material 5
    {
        "recebimentos-material": {
            peso: 12.0,
            volume: 2.8,
            idMaterial: 5,
            cpfCliente: '12121212121',
            cpfColaborador: '77777777777'
        }
    },
    // Recebimento de material 6
    {
        "recebimentos-material": {
            peso: 18.3,
            volume: 3.2,
            idMaterial: 6,
            cpfCliente: '13131313131',
            cpfColaborador: '88888888888'
        }
    },
    // Recebimento de material 7
    {
        "recebimentos-material": {
            peso: 9.9,
            volume: 1.5,
            idMaterial: 7,
            cpfCliente: '11111111111',
            cpfColaborador: '55555555555'
        }
    }
    ];

    // Adiciona pessoas primeiro (caso necessário para integridade referencial)
    for (const pessoa of pessoas) {
        try {
            const url = `https://scv-w0i2.onrender.com/pessoas`;
            const response = await axios.post(url, pessoa);
            console.log(`✅ [pessoas] Status: ${response.status}`);
            console.log(`Resposta:`, response.data);
        } catch (error) {
            if (error.response) {
                console.error(`❌ [pessoas] Erro ${error.response.status}:`, error.response.data);
            } else {
                console.error(`❌ [pessoas] Erro:`, error.message);
            }
        }
    }

    // Adiciona os demais recursos
    for (const payloads of payloadsList) {
        for (const [recurso, payload] of Object.entries(payloads)) {
            // pula pessoas, pois já foram inseridas acima
            if (recurso === "pessoas") continue;
            try {
                const url = `https://scv-w0i2.onrender.com/${recurso}`;
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
    }
}

main();