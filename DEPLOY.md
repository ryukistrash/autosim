# 🚀 Deploy no Cloudflare Pages - GUIA COMPLETO

**Status:** ✅ Projeto pronto para deploy
**Data:** 26/10/2026
**Build testado:** Sucesso ✓

## ✅ Pré-requisitos Concluídos

- [x] Next.js 15.3.9 instalado
- [x] Build de produção funcionando
- [x] Wrangler CLI instalado
- [x] Node.js 20.18.0 configurado
- [x] Imagens otimizadas para edge
- [x] TypeScript sem erros

## 📊 Análise do Projeto

### O que funciona no Cloudflare:
- ✅ Todas as páginas estáticas (/, /cartas, /simulacao, etc)
- ✅ Componentes React e client-side
- ✅ Imagens (já configurado `unoptimized: true`)
- ✅ Fonts do Google (next/font)
- ✅ Tailwind CSS e estilos
- ✅ GSAP e animações
- ✅ Forms com React Hook Form

### ⚠️ APIs com limitações (usam Node.js fs):
- `/api/solicitacoes` - salva dados em JSON local
- `/api/cartas` - lê cartas de arquivo JSON
- `/api/admin/veiculos` - CRUD de veículos em JSON
- `/api/admin/upload` - upload de imagens para disco
- `/api/admin/cartas` - gerencia cartas
- `/api/admin/simulacoes` - gerencia simulações
- `/api/admin/images-360` - gerencia imagens 360

**Essas APIs funcionarão no primeiro deploy**, mas o filesystem será efêmero (dados perdidos em cada deploy).

## 🎯 Método Recomendado: Deploy via GitHub (Automático)

### Passo 1: Commit e Push
```bash
git add .
git commit -m "Preparar para deploy no Cloudflare Pages"
git push origin main
```

### Passo 2: Conectar ao Cloudflare Pages
1. Acesse: https://dash.cloudflare.com/
2. Clique em **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Selecione seu repositório GitHub
4. Configure:
   ```
   Framework preset: Next.js (SSR)
   Build command: npm run build
   Build output directory: .next
   Root directory: /
   Node version: 20
   ```
5. **Environment Variables** (opcional):
   ```
   NODE_VERSION=20.18.0
   NODE_ENV=production
   ```
6. Clique em **Save and Deploy**

### Passo 3: Aguardar Deploy
- Tempo estimado: 3-5 minutos
- URL será gerado automaticamente: `autosim-financeira.pages.dev`

---

## 🖥️ Método Alternativo: Deploy Manual via CLI

### Opção A: Deploy Direto (mais simples)
```bash
# 1. Build local
npm run build

# 2. Login no Cloudflare
npx wrangler login

# 3. Deploy
npx wrangler pages deploy .next --project-name=autosim-financeira
```

### Opção B: Criar Projeto Primeiro
```bash
# 1. Build
npm run build

# 2. Login
npx wrangler login

# 3. Criar projeto
npx wrangler pages project create autosim-financeira --production-branch=main

# 4. Deploy
npx wrangler pages deploy .next --project-name=autosim-financeira --branch=main
```

---

## 🔧 Configurações Importantes

### Build Settings (no Cloudflare Dashboard)
```
Framework: Next.js
Build command: npm run build
Build output: .next
Node version: 20
Root directory: (leave empty)
```

### Compatibilidade Node.js
Já configurado em:
- ✅ `.node-version` → 20.18.0
- ✅ `.nvmrc` → 20.18.0
- ✅ `package.json` → engines.node >= 20.0.0
- ✅ `wrangler.toml` → nodejs_compat flag

---

## 🐛 Solução de Problemas

### Se o build falhar:

#### Erro: "Module not found"
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

#### Erro: "spawn ENOENT" ou "command not found"
```bash
# Usar npx para comandos
npx wrangler pages deploy .next
```

#### Erro: Build timeout
No Cloudflare Dashboard:
- Settings → Functions → Increase timeout
- Ou localmente: adicione `--max-duration=300` ao comando

### Se as APIs não funcionarem:

**Solução temporária** (dados efêmeros):
- As APIs funcionarão, mas dados serão perdidos em cada deploy
- OK para testes e desenvolvimento

**Solução permanente** (recomendado para produção):
Ver seção "Migração para D1/KV" abaixo

---

## 📈 Próximos Passos Após Deploy

### Imediato (Funcional):
1. ✅ Deploy funcionando
2. ✅ Frontend 100% operacional
3. ⚠️ APIs funcionais mas efêmeras

### Opcional (Produção completa):
4. Configurar domínio customizado
5. Migrar dados para Cloudflare D1 (SQL)
6. Migrar uploads para R2 (S3-compatible)
7. Configurar analytics
8. Setup de monitoramento

---

## 💾 Migração para Storage Persistente (Opcional)

### Por que migrar?
- Dados atualmente salvos em arquivos JSON serão perdidos a cada deploy
- Para produção real, você precisa de banco de dados persistente

### Opções de Storage:

#### 1. Cloudflare D1 (SQL Database)
**Melhor para:** Dados estruturados (veículos, cartas, solicitações)
```bash
# Criar banco
npx wrangler d1 create autosim-db

# Adicionar ao wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "autosim-db"
database_id = "<ID_GERADO>"
```

#### 2. Cloudflare KV (Key-Value)
**Melhor para:** Cache, configurações simples
```bash
# Criar namespace
npx wrangler kv:namespace create "AUTOSIM_KV"

# Adicionar ao wrangler.toml
[[kv_namespaces]]
binding = "KV"
id = "<ID_GERADO>"
```

#### 3. Cloudflare R2 (Object Storage)
**Melhor para:** Imagens, arquivos, uploads
```bash
# Criar bucket
npx wrangler r2 bucket create autosim-uploads

# Adicionar ao wrangler.toml
[[r2_buckets]]
binding = "R2"
bucket_name = "autosim-uploads"
```

### Exemplo de migração (API com D1):
```typescript
// Antes (filesystem)
import fs from "fs/promises";
const data = await fs.readFile("data.json", "utf-8");

// Depois (D1)
export async function GET(request: NextRequest) {
  const { DB } = request.env;
  const result = await DB.prepare("SELECT * FROM cartas").all();
  return NextResponse.json(result);
}
```

---

## 📋 Checklist Final

Antes do deploy:
- [x] `npm run build` sem erros
- [x] Arquivos `.node-version` e `.nvmrc` criados
- [x] `wrangler.toml` configurado
- [x] Git atualizado (commit recente)
- [ ] Teste local: `npm run dev` funcionando
- [ ] Review de environment variables sensíveis
- [ ] Backup dos dados em `/data` (se houver)

Após o deploy:
- [ ] Verificar todas as páginas no browser
- [ ] Testar formulários
- [ ] Verificar imagens carregando
- [ ] Testar responsividade mobile
- [ ] Verificar console do browser (sem erros)
- [ ] Testar APIs (se aplicável)

---

## 🔗 Links Úteis

- **Dashboard Cloudflare:** https://dash.cloudflare.com/
- **Docs Next.js + Cloudflare:** https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **D1 Database:** https://developers.cloudflare.com/d1/
- **R2 Storage:** https://developers.cloudflare.com/r2/

---

## 🆘 Precisa de Ajuda?

Se encontrar erros:
1. Copie a mensagem de erro completa
2. Verifique os logs no Cloudflare Dashboard
3. Rode `npm run build` localmente para reproduzir
4. Peça ajuda com o log específico

---

## 📝 Comando Rápido para Deploy

```bash
# Build e deploy em um comando
npm run build && npx wrangler pages deploy .next --project-name=autosim-financeira

# Ou se já estiver conectado ao Git, apenas:
git push origin main
# (Cloudflare detecta e faz deploy automático)
```

**Seu site está pronto! Escolha o método de deploy acima e prossiga.** 🚀
