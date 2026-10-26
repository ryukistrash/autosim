# 🚀 Guia Completo - Deploy no Cloudflare Pages

## 📋 Pré-requisitos

1. **Conta no GitHub** - https://github.com/signup
2. **Conta no Cloudflare** - https://dash.cloudflare.com/sign-up

---

## 🔧 Passo 1: Enviar Código para o GitHub

### 1.1 - Criar Repositório no GitHub

**Via Interface Web:**
1. Acesse: https://github.com/new
2. Nome do repositório: `autosim-financeira`
3. Deixe como **Público** ou **Privado** (sua escolha)
4. **NÃO** marque "Add a README file"
5. Clique em **"Create repository"**

### 1.2 - Conectar e Enviar Código

Após criar o repositório, o GitHub vai te mostrar comandos. Use estes:

```bash
git remote add origin https://github.com/SEU_USUARIO/autosim-financeira.git
git branch -M main
git push -u origin main
```

⚠️ **IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu username do GitHub!

Se pedir login:
- Username: seu_usuario_github
- Password: use um **Personal Access Token** (não a senha normal)

**Como criar Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → Marque "repo" → "Generate token"
3. Copie o token e use como senha

---

## ☁️ Passo 2: Configurar Cloudflare Pages

### 2.1 - Acessar Dashboard do Cloudflare

1. Entre em: https://dash.cloudflare.com
2. Faça login ou crie uma conta (gratuita)

### 2.2 - Criar Projeto no Cloudflare Pages

1. No menu lateral, clique em **"Workers & Pages"**
2. Clique no botão **"Create application"**
3. Selecione a aba **"Pages"**
4. Clique em **"Connect to Git"**

### 2.3 - Conectar GitHub

1. Clique em **"Connect GitHub"**
2. Autorize o Cloudflare a acessar sua conta
3. Selecione o repositório **"autosim-financeira"**
4. Clique em **"Begin setup"**

### 2.4 - Configurar Build Settings

Aqui é onde você precisa configurar corretamente:

#### **Framework preset**
- Selecione: **"Next.js (Static HTML Export)"**

#### **Build command**
```
npx @cloudflare/next-on-pages
```

#### **Build output directory**
```
.vercel/output/static
```

#### **Environment variables** (Variáveis de Ambiente)
Clique em **"Add variable"** e adicione:

| Nome da Variável | Valor |
|-----------------|-------|
| `NODE_VERSION` | `20` |
| `NPM_FLAGS` | `--legacy-peer-deps` |

#### **Root directory**
- Deixe em branco (ou `/` se aparecer)

### 2.5 - Fazer Deploy

1. Revise todas as configurações
2. Clique em **"Save and Deploy"**
3. Aguarde o build (leva 3-5 minutos)

---

## ✅ Resultado

Após o deploy:
- Você receberá uma URL tipo: `autosim-financeira-xyz.pages.dev`
- O site estará disponível publicamente
- Cada push no GitHub fará deploy automático!

---

## 🔄 Deploys Futuros

Depois do primeiro deploy, é automático:

1. Faça suas alterações no código
2. Commit:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push
   ```
3. O Cloudflare detecta e faz deploy automaticamente!

---

## 🌐 Domínio Personalizado (Opcional)

Se você tiver um domínio próprio:

1. No Cloudflare Pages → seu projeto
2. Vá em **"Custom domains"**
3. Clique em **"Set up a custom domain"**
4. Siga as instruções para configurar DNS

---

## 🆘 Problemas Comuns

### Erro: "Build failed"
- Verifique se as variáveis de ambiente estão corretas
- Verifique se o build command está certo

### Erro: "Git push rejected"
```bash
git pull origin main --rebase
git push origin main
```

### Site não atualiza
- Aguarde 1-2 minutos (cache do Cloudflare)
- Limpe o cache do navegador (Ctrl + Shift + R)

---

## 📞 Suporte

- Documentação Cloudflare Pages: https://developers.cloudflare.com/pages/
- Comunidade Cloudflare: https://community.cloudflare.com/

---

**Criado com ❤️ por Claude Code**
