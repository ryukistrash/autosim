# 📸 Guia Visual - Configuração Cloudflare Pages

## ⚙️ CONFIGURAÇÕES EXATAS DO BUILD

Quando chegar na tela de configuração do projeto no Cloudflare Pages, você verá um formulário. Preencha **exatamente** assim:

---

### 🎯 **1. Project name (Nome do projeto)**
```
autosim-financeira
```
> Este será o nome da URL: `autosim-financeira.pages.dev`

---

### 🎯 **2. Production branch (Branch de produção)**
```
main
```
> O Cloudflare vai monitorar a branch `main` para fazer deploys automáticos

---

### 🎯 **3. Framework preset (Predefinição de framework)**

**Selecione no dropdown:**
```
Next.js (Static HTML Export)
```

**⚠️ ATENÇÃO:** Não confunda com as outras opções:
- ❌ Next.js (não é essa)
- ❌ Next.js SSR (não é essa)
- ✅ **Next.js (Static HTML Export)** ← ESSA AQUI!

---

### 🎯 **4. Build command (Comando de build)**

**Cole exatamente isso:**
```
npx @cloudflare/next-on-pages
```

**Explicação:** Este comando adapta o Next.js para rodar no Cloudflare Workers

---

### 🎯 **5. Build output directory (Diretório de saída)**

**Cole exatamente isso:**
```
.vercel/output/static
```

**⚠️ ATENÇÃO:** 
- Começa com ponto: `.vercel`
- Não esqueça as barras: `/`
- É sensível a maiúsculas/minúsculas

---

### 🎯 **6. Root Directory (Diretório raiz)**

**Deixe VAZIO** ou coloque:
```
/
```

---

### 🎯 **7. Environment variables (Variáveis de ambiente)**

Clique no botão **"Add variable"** e adicione estas duas variáveis:

#### **Variável 1:**
| Campo | Valor |
|-------|-------|
| Variable name | `NODE_VERSION` |
| Value | `20` |

Clique em **"Add variable"** novamente para adicionar a segunda:

#### **Variável 2:**
| Campo | Valor |
|-------|-------|
| Variable name | `NPM_FLAGS` |
| Value | `--legacy-peer-deps` |

---

## 📋 RESUMO - CHECKLIST FINAL

Antes de clicar em "Save and Deploy", confira:

- [ ] Build command: `npx @cloudflare/next-on-pages`
- [ ] Build output: `.vercel/output/static`
- [ ] Variável `NODE_VERSION` = `20`
- [ ] Variável `NPM_FLAGS` = `--legacy-peer-deps`
- [ ] Framework preset: Next.js (Static HTML Export)

---

## 🎬 ORDEM DOS PASSOS

### **PASSO 1: GitHub**
1. Criar repositório em https://github.com/new
2. Nome: `autosim-financeira`
3. Não marcar "Add README"
4. Criar repositório

### **PASSO 2: Terminal (você vai executar)**
```bash
# Conectar ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/autosim-financeira.git

# Renomear branch para main
git branch -M main

# Enviar código
git push -u origin main
```

### **PASSO 3: Cloudflare**
1. Ir em https://dash.cloudflare.com
2. Workers & Pages → Create application
3. Pages → Connect to Git
4. Conectar GitHub
5. Selecionar repositório `autosim-financeira`
6. **Preencher configurações conforme acima**
7. Save and Deploy

---

## ⏱️ TEMPO ESTIMADO

- GitHub: 2 minutos
- Enviar código: 1 minuto
- Configurar Cloudflare: 3 minutos
- Build/Deploy: 5-8 minutos
- **TOTAL: ~15 minutos**

---

## 🆘 TROUBLESHOOTING

### Erro: "Build failed - Command not found"
**Solução:** Verificar se o build command está correto:
```
npx @cloudflare/next-on-pages
```

### Erro: "Output directory not found"
**Solução:** Verificar se o output está correto:
```
.vercel/output/static
```

### Erro: "Node version not supported"
**Solução:** Adicionar variável de ambiente:
- Nome: `NODE_VERSION`
- Valor: `20`

### Erro: "Peer dependencies conflict"
**Solução:** Adicionar variável de ambiente:
- Nome: `NPM_FLAGS`
- Valor: `--legacy-peer-deps`

---

## 📞 PRÓXIMOS PASSOS APÓS DEPLOY

Quando o deploy finalizar com sucesso:

1. **Testar o site:**
   - Abrir a URL: `https://autosim-financeira-xxx.pages.dev`
   - Navegar pelas páginas
   - Testar funcionalidades

2. **Configurar domínio personalizado (opcional):**
   - Pages → Custom domains → Set up a custom domain

3. **Configurar Analytics (opcional):**
   - Pages → Analytics → Enable Web Analytics

---

**✅ Tudo pronto para o deploy!**

Agora é só seguir os passos acima e seu site estará no ar! 🚀
