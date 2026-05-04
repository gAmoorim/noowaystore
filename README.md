# Noo Way Store

Noo Way Store é uma aplicação fullstack de e-commerce para catálogo e venda de calçados, com vitrine pública, carrinho, autenticação de usuários e painel administrativo.

## Funcionalidades

- Vitrine de produtos com imagens principais
- Carrossel na página inicial com produtos em destaque
- Catálogo com filtros por:
  - nome
  - categoria
  - preço mínimo
  - preço máximo
  - disponibilidade em estoque
- Página de detalhes do produto
- Carrinho de compras
- Cadastro e login de usuários
- Área de conta do cliente
- Painel administrativo protegido
- Gerenciamento de:
  - produtos
  - categorias
  - estoque
  - pedidos
  - usuários
  - imagens dos produtos
- Tema claro e modo noturno
- API REST com autenticação via JWT

## Tecnologias

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS com variáveis de tema

### Backend

- Node.js
- Express
- Knex.js
- PostgreSQL
- JWT
- Bcrypt
- Multer
- CORS
- Dotenv

### Banco de Dados

- Neon PostgreSQL
- Cloudinary para hospedagem das imagens

## Deploy

O deploy da aplicação foi realizado na Vercel.

A aplicação utiliza:

- Frontend hospedado na Vercel
- Backend configurado na Vercel
- Banco de dados PostgreSQL na Neon
- Imagens dos produtos hospedadas na Cloudinary

## Estrutura do Projeto

```txt
noowayStore/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── routers/
│   │   └── app.js
│   └── package.json
├── api/
│   └── index.js
├── dump.sql
└── vercel.json
```
## Como Rodar Localmente
1. Clone o repositório

```
git clone https://github.com/seu-usuario/noowayStore.git
cd noowayStore
```
2. Instale as dependências

```
cd backend
npm install

Frontend:

cd ../frontend
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo .env dentro de backend/:

```
PORT=3000

DB_HOST=seu_host
DB_PORT=sua_port
DB_USER=seu_usuario
DB_PWD=sua_senha
DB_NAME=seu_banco

JWT_PWD=sua_chave_jwt

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

Crie um arquivo .env dentro de frontend/:

VITE_API_URL=http://localhost:3000

```

4. Crie as tabelas no banco
Execute o arquivo dump.sql no seu PostgreSQL.

5. Rode o backend

```
cd backend
npm run dev
```

6. Rode o frontend

```
cd frontend
npm run dev
```

A aplicação ficará disponível em:

http://localhost:5173
