# Configuração para Cloudflare Pages

## ⚠️ Importante: Limitações das API Routes

Seu projeto usa operações de **filesystem (fs)** nas API routes, o que **NÃO funciona** no Cloudflare Pages/Workers por ser um ambiente serverless edge.

### APIs afetadas:
- `/api/solicitacoes` - usa fs para salvar solicitações
- `/api/cartas` - lê arquivo JSON do disco
- `/api/admin/veiculos` - CRUD com arquivos JSON
- `/api/admin/upload` - upload de imagens para disco
- `/api/admin/cartas`, `/api/admin/simulacoes`, `/api/admin/images-360` - provavelmente usam fs

## 🚀 Opções de Deploy

### Opção 1: Deploy Estático (Sem APIs) - RÁPIDO
```bash
npm run build
```
- Funciona: páginas estáticas, componentes React
- Não funciona: todas as API routes
- Use para testar o frontend

### Opção 2: Cloudflare Pages com D1/KV - RECOMENDADO PARA PRODUÇÃO

#### A. Configurar Cloudflare D1 (Banco SQL)
```bash
# Instalar Wrangler (CLI do Cloudflare)
npm install -g wrangler

# Criar banco D1
wrangler d1 create autosim-db

# Criar schema
wrangler d1 execute autosim-db --local --file=./migrations/schema.sql
```

#### B. Migrar APIs para usar D1
- Substituir `fs.readFile/writeFile` por queries SQL
- Usar Cloudflare R2 para uploads de imagens
- Exemplo disponível em: `/docs/cloudflare-migration.md`

#### C. Deploy
```bash
npm run build
# Conectar ao Cloudflare Pages no dashboard
```

### Opção 3: Cloudflare Workers + R2 + KV
- KV para dados key-value (cartas, veículos)
- R2 para arquivos (imagens, uploads)
- Workers para API routes

## 📋 Passos para Deploy no Cloudflare Pages

### 1. Preparar o Build
```bash
# Instalar dependências
npm install

# Build de produção
npm run build
```

### 2. Conectar ao GitHub (Recomendado)
1. Acesse: https://dash.cloudflare.com/
2. Pages → Create a project → Connect to Git
3. Selecione seu repositório
4. Configurações:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
   - **Node version:** 20.18.0

### 3. Ou Upload Manual
```bash
# Build local
npm run build

# Upload via Wrangler
npx wrangler pages deploy .next
```

## ⚙️ Configurações do Cloudflare Dashboard

### Build Settings:
- **Framework:** Next.js
- **Build command:** `npm run build`
- **Build output:** `.next`
- **Root directory:** `/`
- **Node version:** 20.18.0

### Environment Variables:
```
NODE_VERSION=20.18.0
```

## 🔧 Correções Necessárias

### Para fazer as APIs funcionarem:

1. **Instalar @cloudflare/next-on-pages:**
```bash
npm install --save-dev @cloudflare/next-on-pages
```

2. **Adicionar script de build:**
```json
"scripts": {
  "pages:build": "npx @cloudflare/next-on-pages",
  "pages:deploy": "npm run pages:build && wrangler pages deploy .vercel/output/static"
}
```

3. **Migrar storage:**
   - Substituir fs por Cloudflare D1/KV/R2
   - Ver exemplos em `/docs/api-migration-examples.md`

## 📊 Status das Features

| Feature | Status | Solução |
|---------|--------|---------|
| Páginas estáticas | ✅ Funciona | - |
| Componentes React | ✅ Funciona | - |
| Imagens otimizadas | ✅ Funciona | `unoptimized: true` |
| API Routes GET (leitura) | ⚠️ Precisa migração | Usar D1/KV |
| API Routes POST/DELETE | ⚠️ Precisa migração | Usar D1/R2 |
| Upload de imagens | ❌ Não funciona | Usar R2 |
| Font optimization | ✅ Funciona | next/font |

## 🐛 Erros Comuns e Soluções

### Erro: "Module not found: fs"
- **Causa:** Tentativa de usar Node.js fs em ambiente edge
- **Solução:** Migrar para Cloudflare D1/KV/R2

### Erro: "Dynamic require of 'X' is not supported"
- **Causa:** Importação dinâmica não compatível
- **Solução:** Usar imports estáticos

### Erro: "Request timeout"
- **Causa:** Function execution limit (30s no Cloudflare)
- **Solução:** Otimizar queries, usar background tasks

## 📝 Próximos Passos

1. **Teste o build localmente:**
   ```bash
   npm run build
   ```

2. **Verifique erros de build** no output

3. **Escolha uma opção:**
   - Deploy estático (sem APIs) → imediato
   - Migrar para D1/KV → produção completa

4. **Se escolher migração:** Eu posso ajudar a:
   - Criar schema D1
   - Migrar cada API route
   - Configurar R2 para uploads
   - Testar localmente com Wrangler

## 🔗 Links Úteis

- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
