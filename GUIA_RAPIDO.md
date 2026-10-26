# 🚀 GUIA RÁPIDO - Deploy Cloudflare Pages

## ⚡ Comandos Rápidos

### 1. Commitar alterações
```bash
git add .
git commit -m "Preparar para deploy Cloudflare Pages

- Configurar Next.js 15 + React 18
- Adicionar .npmrc com legacy-peer-deps
- Corrigir erros de build

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### 2. Enviar para GitHub
```bash
# Criar repositório em: https://github.com/new
# Nome: autosim-financeira

# Depois executar (substituir SEU_USUARIO):
git remote add origin https://github.com/SEU_USUARIO/autosim-financeira.git
git push -u origin main
```

### 3. Configurar Cloudflare Pages
Acesse: https://dash.cloudflare.com

**Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

---

## ⚙️ CONFIGURAÇÕES CLOUDFLARE

### Build Settings:

```
Framework preset: Next.js
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
```

### Environment Variables:

```
NODE_VERSION = 20
```

---

## ✅ Alterações Aplicadas

1. ✅ Next.js downgrade para 15.0.3 (compatível)
2. ✅ React downgrade para 18.3.1 (compatível)
3. ✅ Arquivo `.npmrc` criado (resolve peer deps automaticamente)
4. ✅ Arquivo `.node-version` criado (força Node 20)
5. ✅ Configuração ESLint corrigida
6. ✅ Erro TypeScript em FormularioConsultor corrigido
7. ✅ Todas dependências instaladas corretamente

---

## 📦 Arquivos Importantes Commitados

- `.npmrc` - Configura npm para usar legacy-peer-deps
- `.node-version` - Define versão do Node
- `next.config.js` - Configuração otimizada para Cloudflare
- `wrangler.toml` - Configuração Cloudflare Workers
- `package-lock.json` - Lock file com dependências corretas

---

## 🎯 Resultado Esperado

Após o deploy:
- URL: `https://autosim-financeira-xxx.pages.dev`
- Deploy automático em cada push
- Build time: ~6-9 minutos

---

## 🆘 Se Houver Erro

1. **Verificar build logs** no Cloudflare Dashboard
2. **Verificar configurações**:
   - Build command está correto?
   - Build output está correto?
   - NODE_VERSION está definido?
3. **Tentar retry deployment**

---

**Data da configuração:** 2026-10-26
**Build local:** Testado e funcionando
**Pronto para deploy!** ✅
