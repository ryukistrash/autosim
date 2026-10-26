#!/bin/bash
# Script de Deploy para Cloudflare Pages
# Autosim Financeira

echo "🚀 Iniciando processo de deploy..."
echo ""

# Verifica se há mudanças para commitar
if [[ -n $(git status -s) ]]; then
    echo "📝 Commitando alterações..."
    git add .
    git commit -m "Preparar projeto para Cloudflare Pages

- Ajustes de configuração
- Adicionar .npmrc com legacy-peer-deps
- Atualizar dependências

Co-Authored-By: Claude Code <noreply@anthropic.com>"
    echo "✅ Commit realizado"
else
    echo "ℹ️  Nenhuma alteração para commitar"
fi

echo ""
echo "📤 Verificando remote do GitHub..."

# Verifica se o remote está configurado
if git remote | grep -q "origin"; then
    echo "✅ Remote origin configurado"
    echo "📍 URL: $(git remote get-url origin)"
    echo ""
    echo "🔄 Fazendo push para o GitHub..."
    git push origin main
    echo ""
    echo "✅ Código enviado para o GitHub!"
else
    echo "⚠️  Remote 'origin' não configurado!"
    echo ""
    echo "Execute os comandos abaixo (substitua SEU_USUARIO):"
    echo ""
    echo "  git remote add origin https://github.com/SEU_USUARIO/autosim-financeira.git"
    echo "  git push -u origin main"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deploy preparado!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Próximos passos no Cloudflare Pages:"
echo ""
echo "1. Acesse: https://dash.cloudflare.com"
echo "2. Workers & Pages → seu projeto"
echo "3. Clique em 'Retry deployment' ou 'New deployment'"
echo ""
echo "📋 Configurações importantes:"
echo "   Build command: npx @cloudflare/next-on-pages"
echo "   Build output: .vercel/output/static"
echo "   NODE_VERSION: 20"
echo ""
echo "🎉 Seu site estará disponível em:"
echo "   https://autosim-financeira.pages.dev"
echo ""
