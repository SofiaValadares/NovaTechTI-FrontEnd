# NovaTech TI — Frontend (AV2)

Frontend React (TypeScript) do projeto acadêmico **NovaTech TI**, com **Design System e layout da AV1** ([NovaTech-TI](https://github.com/SofiaValadares/NovaTech-TI)) e integração à API da AV2:

[https://github.com/SofiaValadares/NovaTeckTi-BackEnd](https://github.com/SofiaValadares/NovaTeckTi-BackEnd)

## Páginas (AV1 + AV2)

| Rota | Página AV1 | Integração AV2 |
|------|------------|----------------|
| `/` | Home (apresentação, vídeo, galeria, fundadores) | `GET /api/servicos-ti` (cards de serviços) |
| `/login` | Login de clientes | `POST /api/autenticacao` |
| `/cadastro` | Cadastro de clientes | `POST /api/clientes` |
| `/troca-senha` | Troca de senha | `POST /api/autenticacao/troca-senha` |
| `/servicos` | Solicitação de serviços (carrinho) | `GET/PUT` serviços e solicitações |
| `/cadastro-servico` | — (nova na AV2) | `POST /api/servicos-ti` |

## Funcionalidades API

| Página | Endpoint |
|--------|----------|
| Login | `POST /api/autenticacao` |
| Troca de senha | `POST /api/autenticacao/troca-senha` |
| Cadastro de cliente | `POST /api/clientes` |
| Perfil do usuário (serviços) | `GET /api/clientes?login=` |
| Carrinho — serviços | `GET /api/servicos-ti` |
| Carrinho — solicitações | `GET /api/solicitacoes?login=` |
| Carrinho — salvar | `PUT /api/solicitacoes` |
| Cadastro de serviço (AV2) | `POST /api/servicos-ti` |

## Pré-requisitos

- Node.js 18+
- API publicada em [https://novateckti-backend.onrender.com](https://novateckti-backend.onrender.com)

## URL da API

Padrão em `src/config/api.ts`:

```
https://novateckti-backend.onrender.com
```

Para desenvolvimento local com backend na máquina, crie `.env`:

```
REACT_APP_API_URL=http://localhost:8080
```

Não é necessário variável de ambiente no Vercel.

## Tela “API indisponível”

Se a API na Render não responder (cold start ou serviço parado), o app exibe instruções e o botão **Tentar novamente** (verifica a cada 5s).

## Deploy no Vercel

1. Faça deploy no Vercel normalmente (sem variáveis de ambiente).
2. O front já aponta para `https://novateckti-backend.onrender.com`.
3. Na primeira visita após inatividade, aguarde o cold start da Render (~30–60s).

O arquivo `vercel.json` já configura o roteamento SPA do React.

## Executar localmente

```bash
npm install
npm start
```

Aplicação: [http://localhost:3000](http://localhost:3000)

Use `npm start` ou `npm run dev` (não use `nvm run dev`).

Para usar backend local, crie `.env` com `REACT_APP_API_URL=http://localhost:8080`.

### Usuário padrão (seed do backend)

- **Login:** `admin@novatech.com`
- **Senha:** `Admin@123`

## Estrutura

```
src/
├── api/              # Cliente HTTP e chamadas à API
├── components/       # Layout, formulários, alertas
├── context/          # Sessão do usuário (login)
├── pages/            # Uma página por rota (AV2)
├── types/            # Tipos da API
└── utils/            # Validações e datas
```

## Requisitos técnicos (AV2)

- Controle de estado exclusivamente com **Hooks** do React
- Um componente principal por página
- Componentes menores reutilizáveis (`Layout`, `FormGroup`, `AlertMessage`)
- Sem manipulação direta do DOM JavaScript

## Build

```bash
npm run build
```
