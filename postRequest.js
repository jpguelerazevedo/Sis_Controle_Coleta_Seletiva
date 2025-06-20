import axios from "axios";

async function main() {
    const pessoas = [{
            cpf: '22222222222',
            nome: 'Colaborador Exemplo',
            email: 'colaborador@email.com',
            telefone: '(11) 22222-2222',
            sexo: 'M'
        },
        {
            cpf: '11111111111',
            nome: 'Cliente Exemplo',
            email: 'cliente@email.com',
            telefone: '(11) 11111-1111',
            sexo: 'F'
        }
    ];

    // Primeiro, cadastra as pessoas
    for (const pessoa of pessoas) {
        try {
            const response = await axios.post('https://scv-w0i2.onrender.com/pessoas', pessoa);
            console.log('Pessoa cadastrada:', response.data);
        } catch (error) {

        }
    }

    // Define os outros payloads
    const payloads = {
        bairros: {
            nome: 'Zumbi',
            distancia_sede: 5,
            qnt_pessoas_cadastradas: 0,
            estado_de_acesso: 'Bom'
        },
        enderecos: {
            numero: 123,
            rua: 'Dos bobos',
            referencia: 'Próximo ao Mercado',
            cep: '12345-678',
            id_bairro: 1
        },
        cargos: {
            nomeCargo: 'Motorista',
            descricao: 'Responsável por realizar as coletas e entregas',
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
            cpfCliente: '11111111111', // Atenção: tire os pontos e traços do CPF aqui e abaixo
            cpfColaborador: '22222222222'
        },
        "envios-material": {
            idMaterial: 1,
            cnpj: '11111111000111',
            pesoEnviado: 50.5,
            volumeEnviado: 10
        }
    };

    // Envia os dados para todas as rotas (exceto pessoas, que já enviamos)
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

// Executa a função principal
main();