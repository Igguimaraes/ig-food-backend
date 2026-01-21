# Backend (API)

API backend do projeto **DevsFood**, construída com **Node.js + Express**, persistência com **PostgreSQL via Prisma**, autenticação com **JWT** e senhas com **bcryptjs**.

---

## Sumário

- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados (Prisma)](#banco-de-dados-prisma)
- [Scripts (NPM)](#scripts-npm)
- [Como rodar](#como-rodar)
- [Autenticação (JWT)](#autenticação-jwt)
- [CORS](#cors)
- [Estrutura sugerida do projeto](#estrutura-sugerida-do-projeto)
- [Troubleshooting](#troubleshooting)
- [Licença](#licença)

---

## Recursos

- Cadastro e consulta de dados no banco via **Prisma Client**
- **Hash de senha** com `bcryptjs`
- **Autenticação** com `jsonwebtoken` (Bearer Token)
- **CORS** habilitado para consumo pelo frontend
- **Configuração por variáveis de ambiente** com `dotenv`

---

## Tecnologias

Dependências do projeto:

- **express** `^5.2.1` — servidor HTTP e rotas
- **@prisma/client** `^5.22.0` — Prisma Client para acessar o banco
- **prisma** `^5.22.0` — CLI do Prisma (migrations, generate, studio)
- **jsonwebtoken** `^9.0.3` — criação/validação de tokens JWT
- **bcryptjs** `^3.0.3` — hash e comparação de senhas
- **cors** `^2.8.5` — política de origem cruzada
- **dotenv** `^17.2.3` — carregar `.env`

Dev dependencies:

- **nodemon** `^3.1.11` — reinicia o servidor automaticamente em dev

Configuração do Node:

- `"type": "commonjs"` — módulos no padrão `require(...)`

---

## Pré-requisitos

- **Node.js** (recomendado LTS)
- **PostgreSQL** (local ou Docker)
- **NPM** (ou gerenciador equivalente)

---

## Configuração do ambiente

Clone o repositório e entre na pasta do backend:

```bash
git clone <URL_DO_REPOSITORIO>
cd backend

Instale as dependências:

npm install


Crie o arquivo .env (modelo abaixo).

Rode as migrations e gere o Prisma Client:

npx prisma migrate dev
npx prisma generate

Variáveis de ambiente

Crie um arquivo .env na raiz do backend:

# Porta do servidor
PORT=5010

# String de conexão do Postgres (formato Prisma)
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/devsfood?schema=public"

# JWT
JWT_SECRET="troque_essa_chave_por_uma_forte"
JWT_EXPIRES_IN="7d"


Recomendação: adicione também um .env.example (não coloque credenciais reais):

PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=

Banco de dados (Prisma)
Criar migrations (primeira vez / mudanças no schema)
npx prisma migrate dev --name init

Gerar Prisma Client (normalmente já roda após migrate)
npx prisma generate

Prisma Studio (visualizar tabelas e registros)
npx prisma studio

Reset no banco (APAGA dados — apenas para desenvolvimento)
npx prisma migrate reset

Scripts (NPM)

No momento, seu package.json tem apenas o script test.
Recomendação: adicionar scripts para rodar o servidor e facilitar o fluxo.

Sugestão de scripts (copie e cole no package.json)

Ajuste o caminho do arquivo principal conforme o seu projeto (index.js, src/server.js, etc.)

{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}


npm run dev: desenvolvimento com auto-reload (nodemon)

npm start: execução em produção

npm run prisma:migrate: aplica migrations

npm run prisma:studio: abre o Prisma Studio

Como rodar
Desenvolvimento
npm run dev

Produção
npm start


Servidor ficará disponível em:

http://localhost:PORT

Autenticação (JWT)

A API utiliza autenticação via Bearer Token.

Formato do header:

Authorization: Bearer <SEU_TOKEN>


Boas práticas:

Expiração configurável em JWT_EXPIRES_IN

Chave forte em JWT_SECRET (não commitada)

CORS

A dependência cors permite que o frontend consuma a API.

Recomendação (produção):

Restringir origens permitidas (ex.: domínio do frontend)

Configurar métodos/headers necessários

Estrutura sugerida do projeto

Caso você queira organizar em camadas (recomendado conforme cresce):

backend/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ controllers/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ services/
│  ├─ utils/
│  ├─ app.js
│  └─ server.js
├─ .env
├─ package.json
└─ README.md

Troubleshooting
Erro: Prisma não conecta no banco

Confirme se o Postgres está rodando

Verifique DATABASE_URL (usuário, senha, host, porta e banco)

Rode:

npx prisma migrate dev

Erro: JWT_SECRET indefinido

Confirme se existe .env na raiz

Garanta que seu projeto carrega dotenv no início do app:

require("dotenv").config();

Nodemon não reinicia

Verifique se está rodando via npm run dev

Confira se o arquivo de entrada (index.js) é o correto

Licença

Este projeto está sob a licença ISC (conforme package.json).


---

### O que eu ainda preciso de você (para deixar 100% fiel, sem suposições)
Para eu ajustar esse README com **rotas reais** e **exemplos corretos de endpoints**, cole aqui:
1) Seu arquivo de entrada real (`index.js` ou `server.js`)
2) A árvore de pastas (pode ser só um print do Explorer ou `tree /f`)
3) As rotas existentes (pelo menos o arquivo de `routes`)

Com isso, eu devolvo o README com:
- **Endpoints reais**, exemplos de request/response
- Porta padrão correta
- Caminho correto do `nodemon` e `start`
- Seção “Como testar via Insomnia/Postman” já pronta
```
