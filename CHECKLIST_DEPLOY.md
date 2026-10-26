# ✅ CHECKLIST FINAL - Deploy Cloudflare Pages

## 📦 Status do Projeto

- [x] Git inicializado
- [x] Dependências instaladas (Next.js 15 + React 18)
- [x] Configuração do Next.js ajustada
- [x] `.npmrc` criado (força legacy-peer-deps)
- [x] `.node-version` criado (Node 20)
- [x] `wrangler.toml` configurado
- [x] Build local em andamento
- [ ] Código enviado para GitHub
- [ ] Deploy no Cloudflare Pages

---

## 🎯 COMANDOS PARA EXECUTAR

### 1️⃣ Commitar as alterações finais

```bash
git add .
git commit -m "Configurar projeto para Cloudflare Pages

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### 2️⃣ Conectar ao GitHub (se ainda não fez)

**Substitua `SEU_USUARIO` pelo seu username do GitHub:**

```bash
git remote add origin https://github.com/SEU_USUARIO/autosim-financeira.git
git branch -M main
git push -u origin main
```

Se pedir senha, use um **Personal Access Token** (não a senha normal).

---

## ⚙️ CONFIGURAÇÃO NO CLOUDFLARE PAGES

### Acesse: https://dash.cloudflare.com

Se é a primeira vez configurando, siga:
1. **Workers & Pages** → **Create application** → **Pages**
2. **Connect to Git** → Conectar GitHub
3. Selecionar repositório: `autosim-financeira`

Se já tentou antes e deu erro:
1. **Workers & Pages** → Seu projeto existente
2. **Settings** → **Builds & deployments**
3. Editar configurações:

---

## 📋 CONFIGURAÇÕES EXATAS

### Build configuration:

| Campo | Valor |
|-------|-------|
| **Framework preset** | `Next.js` |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | `/` (ou deixe vazio) |

### Environment variables:

| Variable name | Value |
|--------------|-------|
| `NODE_VERSION` | `20` |

**⚠️ IMPORTANTE:** 
- O arquivo `.npmrc` já está configurado, então **NÃO** precisa adicionar `NPM_FLAGS`
- Certifique-se de que o `package-lock.json` está commitado no Git

---

## 🔄 RETRY DEPLOY

Se você já tentou fazer deploy e deu erro:

1. Faça push das alterações:
   ```bash
   git push origin main
   ```

2. No Cloudflare Pages:
   - Vá no seu projeto
   - Clique em **"Retry deployment"**
   - Ou vá em **"View build"** → **"Retry deployment"**

---

## 🎯 O QUE MUDOU (correções aplicadas)

1. ✅ **Downgrade para Next.js 15** - Compatível com @cloudflare/next-on-pages
2. ✅ **React 18** - Compatível com Next.js 15
3. ✅ **Arquivo .npmrc** - Resolve conflitos de peer dependencies automaticamente
4. ✅ **Node version 20** - Versão estável e suportada
5. ✅ **package-lock.json** - Gerado com as flags corretas

---

## 🆘 SE DER ERRO NO BUILD

### Erro: "Cannot find module 'next'"
**Solução:** O `.npmrc` resolve isso automaticamente. Fazer retry.

### Erro: "Peer dependencies conflict"
**Solução:** Já resolvido com `.npmrc`. Fazer retry.

### Erro: "Build output directory not found"
**Verificar:** Build output está como `.vercel/output/static`

### Erro: "Command failed"
**Verificar:** Build command está como `npx @cloudflare/next-on-pages`

---

## ⏱️ TEMPO ESTIMADO DE BUILD

- **Download de dependências:** 2-3 minutos
- **Next.js build:** 2-3 minutos
- **Cloudflare adapter:** 1-2 minutos
- **Deploy:** 30 segundos
- **TOTAL:** ~6-9 minutos

---

## ✅ APÓS O DEPLOY BEM-SUCEDIDO

1. **Teste a URL:**
   ```
   https://autosim-financeira-[seu-hash].pages.dev
   ```

2. **Verifique as páginas:**
   - Home: `/`
   - Simulação: `/simulacao`
   - Cartas: `/cartas`
   - Admin: `/admin`

3. **Configure domínio personalizado (opcional):**
   - Pages → Custom domains → Set up a custom domain

---

## 📞 SUPORTE

Documentação oficial:
- https://developers.cloudflare.com/pages/framework-guides/nextjs/
- https://github.com/cloudflare/next-on-pages

---

**🚀 Pronto para deploy!**

Aguarde o build local terminar e depois execute os comandos acima.
