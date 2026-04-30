# Noo Way Store — Frontend React + Vite

Frontend completo para e-commerce de calçados, consumindo a API REST do backend Node.js/Express.

## 🚀 Instalação e Uso

```bash
# 1. Instalar dependências
npm install

# 2. Configurar a URL da API
# Edite o arquivo .env na raiz:
VITE_API_URL=http://localhost:3000   # <- coloque a URL do seu backend

# 3. Iniciar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

## 📁 Estrutura

```
src/
├── context/
│   └── AppContext.jsx      # Auth, Cart e Toast (Context API)
├── services/
│   └── api.js              # Todas as chamadas à API (axios)
├── components/
│   └── Shared.jsx          # Navbar, Footer, ProductCard, Modal, ShoeIcon
├── pages/
│   ├── Home.jsx            # Página inicial
│   ├── Produtos.jsx        # Listagem com filtros
│   ├── ProdutoDetalhe.jsx  # Detalhe + seleção de variantes
│   ├── Carrinho.jsx        # Carrinho de compras
│   ├── Checkout.jsx        # Fluxo de 3 etapas
│   ├── Auth.jsx            # Login e Cadastro
│   ├── Conta.jsx           # Perfil, Pedidos, Endereços
│   └── Admin.jsx           # Painel Admin completo
└── App.jsx                 # Rotas
```

## 🔐 Autenticação JWT

- Token salvo em `localStorage` (chave: `nws_token`)
- Header enviado automaticamente em todas as requisições: `Authorization: Bearer <token>`
- Usuários com `tipo: 'admin'` são redirecionados para `/admin` ao fazer login

## 🛍️ Rotas da Loja

| Rota | Página |
|---|---|
| `/` | Home com hero e destaques |
| `/produtos` | Listagem com filtro por categoria e busca |
| `/produto/:id` | Detalhe com seleção tamanho/cor/quantidade |
| `/carrinho` | Carrinho persistido em localStorage |
| `/checkout` | 3 etapas: endereço → revisão → confirmação |
| `/login` | Login |
| `/cadastro` | Cadastro |
| `/conta` | Perfil, pedidos e endereços do cliente |
| `/admin` | Painel admin (restrito a tipo: 'admin') |

## 🔧 Painel Admin (`/admin`)

- **Dashboard**: estatísticas e gráfico de pedidos
- **Produtos**: CRUD completo + gerenciamento de imagens
- **Categorias**: CRUD
- **Estoque**: visualização com barra de nível + edição
- **Pedidos**: listagem, filtro por status, atualização de status inline
- **Usuários**: listagem e exclusão
