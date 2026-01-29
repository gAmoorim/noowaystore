-- 1 TABELA USUÁRIOS

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    telefone VARCHAR(20),
    tipo VARCHAR(20) DEFAULT 'cliente',
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 2 TABELA CATEGORIAS

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- 3 TABELA PRODUTOS

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 4 TABELA ESTOQUE

CREATE TABLE estoque (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    tamanho VARCHAR(10),
    cor VARCHAR(50),
    quantidade INTEGER NOT NULL DEFAULT 0
);

-- 5) TABELA PEDIDOS

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 6) TABELA ITENS DO PEDIDO

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    estoque_id INTEGER NOT NULL REFERENCES estoque(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL
);

-- 7) TABELA ENDEREÇOS

CREATE TABLE enderecos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    endereco TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cep VARCHAR(20) NOT NULL
);

-- 8) IMAGENS DOS PRODUTOS

CREATE TABLE imagens_produtos (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    img_principal BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9) PROMOCOES

CREATE TABLE promocoes (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    preco_promocional NUMERIC(10,2) NOT NULL,
    começa_em TIMESTAMP NOT NULL,
    termina_em TIMESTAMP, -- pode ser NULL para promoção permanente
    ativa BOOLEAN DEFAULT TRUE
);