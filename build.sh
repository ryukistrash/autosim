#!/bin/bash
# Build script para Cloudflare Pages

echo "🚀 Iniciando build para Cloudflare Pages..."

# Limpar cache antigo se existir
if [ -d ".next/cache" ]; then
  echo "🧹 Removendo cache antigo..."
  rm -rf .next/cache
fi

# Build do Next.js
echo "📦 Building Next.js..."
npm run build

# Remover cache após build para reduzir tamanho
if [ -d ".next/cache" ]; then
  echo "🧹 Removendo cache do build..."
  rm -rf .next/cache
fi

# Remover trace desnecessário
if [ -d ".next/trace" ]; then
  echo "🧹 Removendo trace..."
  rm -rf .next/trace
fi

echo "✅ Build concluído! Tamanho do .next:"
du -sh .next

echo "✅ Pronto para deploy!"
