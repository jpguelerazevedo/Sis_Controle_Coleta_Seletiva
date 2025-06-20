import axios from "axios";

async function main() {
    const pessoas = [{
            cpf: '22222222222',
            nome: 'Colaborador Exemplo 1',
            email: 'colab1@email.com',
            telefone: '(11) 22222-2222',
            sexo: 'M'
        },
        {
            cpf: '33333333333',
            nome: 'Colaborador Exemplo 2',
            email: 'colab2@email.com',
            telefone: '(11) 33333-3333',
            sexo: 'F'
        },
        {
            cpf: '11111111111',
            nome: 'Cliente Exemplo 1',
            email: 'cliente1@email.com',
            telefone: '(11) 11111-1111',
            sexo: 'F'
        },
        {
            cpf: '44444444444',
            nome: 'Cliente Exemplo 2',
            email: 'cliente2@email.com',
            telefone: '(11) 44444-4444',
            sexo: 'M'
        }
    ];

    for (const pessoa of pessoas) {
        try {
            const response = await axios.post('https://scv-w0i2.onrender.com/pessoas', pessoa);
            console.log('Pessoa cadastrada:', response.data);
        } catch (error) {}
    }

    const payloadsList = [{
            bairros: {
                nome: 'Zumbi',
                distancia_sede: 5,
                qnt_pessoas_cadastradas: 0,
                estado_de_acesso: 'Bom'
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
                turno_preferido_de_coleta: 'MANHA',
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
                estado_de_acesso: 'Excelente'
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
                turno_preferido_de_coleta: 'TARDE',
                status_cliente: 'ATIVO',
                frequencia_de_pedidos: 'MENSAL',
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
        }
    ];

    for (const payloads of payloadsList) {
        for (const [recurso, payload] of Object.entries(payloads)) {
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