# Sistema de Coleta de Materiais Recicláveis

Este é um sistema backend para gerenciamento de coleta de materiais recicláveis, desenvolvido com Node.js, Express e Sequelize.

## 🚀 Funcionalidades

- Gerenciamento de bairros e endereços
- Cadastro de clientes e colaboradores
- Controle de materiais recicláveis
- Gestão de pedidos de coleta
- Acompanhamento de recebimentos e envios
- Integração com empresas terceirizadas

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- SQLite3 (banco de dados)

## 🔧 Instalação

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
- O sistema utiliza SQLite3 como banco de dados
- O arquivo de configuração está em `src/config/database-config.js`

## 🛠️ Estrutura do Projeto

```
src/
├── config/             # Configurações do sistema
├── controllers/        # Controladores da aplicação
├── models/            # Modelos do banco de dados
├── routes/            # Rotas da API
└── server.js          # Arquivo principal da aplicação
```

## 📦 Modelos do Banco de Dados

O sistema possui os seguintes modelos principais:

- **Bairro**: Informações sobre os bairros atendidos
- **Endereco**: Endereços dos clientes
- **Pessoa**: Dados pessoais
- **Cliente**: Informações específicas dos clientes
- **Colaborador**: Dados dos funcionários
- **Material**: Materiais recicláveis
- **PedidoColeta**: Solicitações de coleta
- **RecebimentoMaterial**: Registro de materiais recebidos
- **EnvioMaterial**: Registro de materiais enviados
- **Terceirizada**: Empresas parceiras

## 🚀 Como Executar

1. Inicie o servidor:
```bash
npm start
```

2. Para popular o banco de dados com dados de exemplo:
```bash
node src/config/database-seed.js
```

## 🔍 Endpoints da API

A API oferece os seguintes endpoints principais:

- `GET /bairros` - Lista todos os bairros
- `GET /clientes` - Lista todos os clientes
- `POST /pedidos-coleta` - Cria um novo pedido de coleta
- `GET /materiais` - Lista todos os materiais
- `POST /recebimentos` - Registra um recebimento de material
- `POST /envios` - Registra um envio de material

## 📝 Exemplo de Uso

Para criar um novo pedido de coleta:

```javascript
POST /pedidos-coleta
{
    "data_pedido": "2024-03-20",
    "status": "Pendente",
    "observacoes": "Coleta de plástico",
    "id_cliente": 1,
    "tipo": "Reciclável",
    "peso": 10.5,
    "volume": 2.0,
    "idMaterial": 1
}
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



Para suporte, envie um email para [seu-email@exemplo.com]