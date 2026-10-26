#!/bin/bash
# Script de build otimizado para Cloudflare Pages
# Previne cache > 25MB

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Build para Cloudflare Pages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next

# Build do Next.js
echo "📦 Building Next.js..."
npm run build

# Aguardar build terminar completamente
sleep 2

# Remover cache (maior causador do erro 25MB)
echo "🧹 Removendo cache (previne erro 25MB)..."
rm -rf .next/cache || true
rm -rf .next/trace || true

# Verificar tamanho final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Tamanho final do .next:"
du -sh .next 2>/dev/null || echo "Diretório .next pronto"

# Verificar se há arquivos grandes
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verificando arquivos > 20MB..."
find .next -type f -size +20M 2>/dev/null | while read file; do
  size=$(du -h "$file" | cut -f1)
  echo "⚠️  Arquivo grande encontrado: $file ($size)"
done || echo "✅ Nenhum arquivo > 20MB encontrado"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Build concluído com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
