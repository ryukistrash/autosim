# Deploy Cloudflare Pages - Guia Rápido ⚡

## Status: ✅ PRONTO PARA DEPLOY

### Opção 1: Via GitHub (Recomendado - Mais Fácil)

```bash
# 1. Commit tudo
git add .
git commit -m "Pronto para Cloudflare Pages"
git push origin main

# 2. Acesse: https://dash.cloudflare.com/
# 3. Workers & Pages → Create → Connect to Git
# 4. Configure:
#    - Framework: Next.js
#    - Build: npm run build
#    - Output: .next
#    - Node: 20
```

### Opção 2: Deploy Manual

```bash
# Build e deploy em um comando
npm run build && npx wrangler pages deploy .next --project-name=autosim-financeira
```

---

## ⚠️ IMPORTANTE: Suas APIs

Suas APIs funcionarão, MAS dados salvos em arquivos JSON serão **perdidos a cada deploy** (filesystem efêmero).

**APIs afetadas:**
- `/api/solicitacoes`
- `/api/cartas`
- `/api/admin/*` (veiculos, upload, cartas, etc)

**Para produção real:** Migrar para Cloudflare D1 (banco SQL) ou KV. Ver `DEPLOY.md` completo.

---

## 🚀 Deploy Agora

Escolha um método acima e execute. Seu site estará no ar em ~3 minutos!
