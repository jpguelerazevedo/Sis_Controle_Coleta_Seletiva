# Sistema de Controle de Coleta Seletiva

- Este é um sistema completo para gerenciamento de coleta de materiais recicláveis, desenvolvido com Node.js, Express e Sequelize.
- O repositorio é composto por 3 branches, onde são separados as camadas do projeto:
  - main (backend)
  - `frontend-local (frontend)`
  - gh-pages (configurações do GitHub Pages) 

## 🚀 Funcionalidades

- Gerenciamento de bairros e endereços
- Cadastro de clientes e colaboradores
- Controle de materiais recicláveis
- Gestão de pedidos de coleta
- Acompanhamento de recebimentos e envios
- Integração com empresas terceirizadas

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

## 🛠️ Estrutura do Projeto

```
src/
├── components/           # Componentes (Ex: Sidebar)
├── pages/             # Paginas da aplicação
├── services/            # Configuração dos endpoints
├── app.jsx            # Rotas do react-router-dom
└── main.jsx          # Criação do root
```

## 📃 O Sistema possui as seguintes paginas:

- **Dashboard**: Informações Basicas sobre a empresa
- **Clientes**: Listagem e Adição/Edição de clientes
- **Materiais**: Listagem e Adição de Materiais
- **Colaborador**: Listagem, Adição/Edição de colaboradores
- **Cargos**: Listagem, Adição/Edição de cargos
- **Terceirizada**: Listagem, Adição/Edição de Terceirizadas
- **Bairros**: Listagem, Adição/Edição de Bairros

- **PedidosColeta**: Listagem, Adição/Edição de pedido de coleta
- **RecebimentoMaterial**: Listagem, Adição/Edição de materiais recebidos
- **EnvioMaterial**: Listagem, Adição/Edição de materiais enviados

- **MateriaisColetados**: Listagem de materiais coletados / data
- **UtilizacaoBairros**: Contagem de utilização dos bairros
- **ClientesNovos**: Listagem de clientes novos / data

## 🚀 Como Executar

1. Inicie o Frontend:
```bash
npm run dev
```

## 🔍 Endpoints da API

A API oferece os seguintes endpoints principais (você pode encontrar os outros em: `src/services/endpoints.js` )

- `list /bairros` - Lista todos os bairros
- `list /cargos` - Listar todos os cargos
- `list /colaboradores` - Listar todos os colaboradores
- `list /terceirizadas` - Listar todas as terceirizadas
- `list /clientes` - Lista todos os clientes
- `list /materiais` - Lista todos os materiais
- `create /pedidos-coleta` - Cria um novo pedido de coleta
- `create /recebimentos` - Registra um recebimento de material
- `create /envios` - Registra um envio de material

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



Para suporte, envie um email para [seu-email@exemplo.com]
