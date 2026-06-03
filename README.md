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
- Backend rodando em `http://localhost:8080`

## URL da API

Fixa em `src/config/api.ts` → `http://localhost:8080`. **Não é necessário** criar variável no Vercel nem arquivo `.env`.

## Tela “Backend offline”

Se a API não responder, o app exibe uma página com:

- link do repositório [NovaTeckTi-BackEnd](https://github.com/SofiaValadares/NovaTeckTi-BackEnd)
- comandos para clonar e rodar `./mvnw spring-boot:run`
- botão **Tentar novamente** (verifica a cada 5s automaticamente)

Quando o backend voltar, o fluxo normal é restaurado.

## Deploy no Vercel (frontend) + backend local

1. Faça deploy no Vercel normalmente (sem variáveis de ambiente).
2. Rode o backend na sua máquina: `./mvnw spring-boot:run`
3. Abra o site do Vercel **no mesmo computador** onde o backend está rodando.

O arquivo `vercel.json` já configura o roteamento SPA do React.

## Executar

```bash
# Terminal 1 — backend (no repositório do BackEnd)
./mvnw spring-boot:run

# Terminal 2 — frontend
npm install
npm start
```

Aplicação: [http://localhost:3000](http://localhost:3000)

Use `npm start` ou `npm run dev` (não use `nvm run dev`).

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
