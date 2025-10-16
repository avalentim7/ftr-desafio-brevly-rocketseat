# Brevly - Frontend Web

Frontend da aplicação Brevly, um encurtador de URLs desenvolvido com React, TypeScript, Vite, Zustand e Axios.

## Tecnologias Utilizadas

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento da aplicação
- **Zustand + Immer** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para chamadas à API
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Biblioteca de ícones

## Estrutura de Pastas

```
web/
├── src/
│   ├── http/              # Camada de comunicação com a API
│   │   ├── client.ts      # Cliente Axios configurado
│   │   ├── types.ts       # Tipos TypeScript da API
│   │   ├── create-link.ts # Criar novo link
│   │   ├── get-links.ts   # Listar links
│   │   ├── delete-link.ts # Deletar link
│   │   ├── get-original-url.ts # Obter URL original
│   │   ├── export-links.ts # Exportar links para CSV
│   │   └── index.ts       # Exports centralizados
│   ├── store/             # Gerenciamento de estado Zustand
│   │   └── use-links-store.ts # Store de links
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home.tsx       # Página principal
│   │   └── Redirect.tsx   # Página de redirecionamento
│   ├── components/        # Componentes reutilizáveis
│   │   ├── FormCreateShortenedUrl.tsx
│   │   ├── LinkCard.tsx
│   │   └── LinkNotFound.tsx
│   ├── assets/            # Imagens e recursos estáticos
│   ├── main.tsx           # Entry point da aplicação
│   └── index.css          # Estilos globais
├── .env                   # Variáveis de ambiente (local)
├── .env.example           # Exemplo de variáveis de ambiente
└── package.json
```

## Configuração

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com a URL da API:

```env
VITE_API_URL=http://localhost:3333
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria build de produção
- `pnpm preview` - Preview do build de produção
- `pnpm lint` - Executa o linter

## Funcionalidades

### 1. Criar Link Encurtado

Na página inicial, preencha o formulário com:
- **Link Original**: URL completa que deseja encurtar
- **Link Encurtado**: Slug personalizado (4-20 caracteres, alfanuméricos + _ -)

### 2. Listar Links

Todos os links criados aparecem na seção "Meus links" com:
- URL encurtada (clicável)
- URL original
- Contador de acessos
- Botões de copiar e deletar

### 3. Copiar Link

Clique no botão de copiar (ícone de cópia) para copiar a URL encurtada para a área de transferência.

### 4. Deletar Link

Clique no botão de deletar (ícone de lixeira) para remover um link. Uma confirmação será solicitada.

### 5. Redirecionamento

Ao clicar em um link encurtado ou acessar diretamente `/:slug`, você será redirecionado automaticamente para a URL original. Durante o redirecionamento, uma mensagem "Redirecionando..." é exibida.

### 6. Exportar para CSV

Clique no botão "Baixar CSV" para exportar todos os links para um arquivo CSV hospedado no Cloudflare R2.

## Arquitetura

### Camada HTTP (`src/http/`)

Responsável por toda comunicação com o backend:
- Cliente Axios configurado com base URL
- Funções tipadas para cada endpoint da API
- Tratamento de erros centralizado

### Gerenciamento de Estado (`src/store/`)

Utiliza Zustand com Immer para gerenciamento de estado:
- Estado global dos links
- Actions assíncronas (fetch, create, delete, export)
- Loading states e tratamento de erros

### Roteamento

- `/` - Página principal (Home)
- `/:slug` - Página de redirecionamento

### Integração com Backend

O frontend consome os seguintes endpoints do servidor:

- `POST /links` - Criar link
- `GET /links` - Listar links
- `DELETE /links/:id` - Deletar link
- `GET /links/:slug/original-url` - Obter URL original
- `POST /links/export` - Exportar links para CSV

## Build para Produção

```bash
pnpm build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para testar o build localmente:

```bash
pnpm preview
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API | `http://localhost:3333` |

## Observações

- O arquivo `.env` não deve ser commitado (incluído no `.gitignore`)
- Use `.env.example` como template para novos ambientes
- A aplicação requer que o servidor backend esteja rodando
