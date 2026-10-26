# AutoSim Financeira - Site de Simulação de Financiamento

Site moderno para financeira com catálogo de veículos, simulador de propostas e painel administrativo.

## 🚀 Como Rodar o Projeto

### Instalação

```bash
npm install --legacy-peer-deps
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Build de Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
autosim-financeira/
├── app/                          # Páginas Next.js (App Router)
│   ├── page.tsx                 # Página inicial
│   ├── simulacao/page.tsx       # Página de simulação
│   ├── cartas/page.tsx          # Cartas contempladas
│   ├── repasses/[token]/        # Catálogo privado por token
│   └── admin/                   # Painel administrativo
│       ├── login/page.tsx
│       └── dashboard/page.tsx
├── components/
│   ├── layout/                  # Header, Footer
│   ├── home/                    # Componentes da home
│   ├── simulation/              # Simulação e formulários
│   └── ui/                      # Componentes reutilizáveis
├── data/                        # Dados mock (EDITAR AQUI)
│   ├── cars.ts                 # Carros ilustrativos
│   ├── texts.ts                # Textos do site
│   ├── faq.ts                  # Perguntas frequentes
│   ├── proposals.ts            # Lógica de propostas (mock)
│   └── repasses.ts             # Catálogo de repasses
├── services/                    # Lógica de negócio (mock)
│   ├── simulation.ts           # Simulação de propostas
│   ├── leads.ts                # Envio de leads
│   └── tokens.ts               # Gerenciamento de tokens
├── lib/
│   ├── utils.ts                # Funções utilitárias
│   └── validations.ts          # Schemas de validação
└── public/
    ├── car-360/                # Frames do carro 360° (ADICIONAR)
    ├── cars/                   # Imagens dos carros (ADICIONAR)
    └── icons/

```

## 🎨 Personalização

### 1. Textos do Site

Edite `data/texts.ts`:
- Nome da empresa
- Textos do hero
- Como funciona
- Números de confiança
- Informações de contato

### 2. Carros Ilustrativos (Home)

Edite `data/cars.ts`:
- Adicione ou remova modelos
- Ajuste valores e descrições
- Troque imagens em `/public/cars/`

### 3. FAQ

Edite `data/faq.ts`:
- Adicione/remova perguntas
- Personalize respostas

### 4. Catálogo de Repasses

Edite `data/repasses.ts`:
- Adicione veículos disponíveis para repasse
- Atualize valores e especificações

### 5. Carro 360° (Hero)

O componente está pronto para receber frames:

1. Renderize 72 frames do carro girando 360°
2. Salve como `frame-001.webp` até `frame-072.webp`
3. Coloque em `/public/car-360/`
4. O componente carregará automaticamente

Enquanto não tiver os frames, um placeholder animado é exibido.

## 🔐 Painel Administrativo

Acesse: http://localhost:3000/admin/login

**Credenciais demo:**
- Usuário: `admin`
- Senha: `admin123`

### Funcionalidades:
- ✅ Edição de textos do site
- ✅ Gerenciamento de carros ilustrativos
- ✅ Geração de links privados para catálogo de repasses
- ✅ Cópia rápida de links com token

## 📋 Próximos Passos (Integração Backend)

### 1. Cálculos Reais de Propostas

Substitua `services/simulation.ts` e `data/proposals.ts` com:
- Chamadas para API de cálculo real
- Tabelas de financiamento
- Regras de negócio da financeira

### 2. Base de Dados

Substitua os arquivos em `/data` por chamadas a banco de dados:
- Carros disponíveis
- Veículos de repasse
- Textos editáveis via admin

### 3. Sistema de Leads

Substitua `services/leads.ts` com:
- Integração com CRM
- Envio de e-mails
- Webhook para notificações

### 4. Autenticação Real

Substitua o sistema de login mock em `/admin` com:
- JWT ou sessões seguras
- Middleware de proteção de rotas
- Níveis de acesso

### 5. Perguntas de Sondagem

Adicione campos customizados no `LeadForm`:
- Edite `components/simulation/LeadForm.tsx`
- Adicione novos campos ao schema em `lib/validations.ts`

### 6. Integração "Cartas Contempladas Brasil"

A página `/cartas` tem um placeholder para iframe:
- Tente: `<iframe src="https://cartascontempladasbrasil.com.br" />`
- Se bloquear (X-Frame-Options), solicite:
  - API oficial
  - Parceria para integração
  - Ou use botão para abrir em nova janela

## 🎯 Stack Tecnológica

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Motion** (animações)
- **GSAP + ScrollTrigger** (carro 360°)
- **React Hook Form + Zod** (formulários)
- **Phosphor Icons**

## 🎨 Design System

- **Paleta de cores**: Azul confiança (`#2563eb`) + Neutros Zinc
- **Tipografia**: Geist Sans + Geist Mono
- **Dials de design**:
  - Variance: 7 (layout próprio, profissional)
  - Motion: 6 (animações sutis)
  - Density: 4 (espaçado, respirável)

## ✅ Checklist de Deploy

- [ ] Trocar textos em `data/texts.ts`
- [ ] Adicionar imagens reais dos carros
- [ ] Adicionar frames do carro 360° (ou remover componente)
- [ ] Configurar variáveis de ambiente (API keys, etc)
- [ ] Integrar backend real (simulação, leads, autenticação)
- [ ] Configurar domínio e SSL
- [ ] Adicionar Google Analytics / Meta Pixel
- [ ] Testar todos os formulários
- [ ] Testar responsividade mobile
- [ ] Validar SEO (meta tags, sitemap)

## 📝 Notas Importantes

### Dados Mock
Todos os dados são fictícios e estão em arquivos locais. Substitua por dados reais do backend.

### Placeholders de Imagens
As imagens de carros retornarão erro 404 até você adicionar as imagens reais em `/public/cars/`.

### Carro 360°
Enquanto não houver frames reais, o componente mostra um placeholder animado com gradiente.

### Validação CPF
Implementada com algoritmo real de validação de CPF brasileiro.

### LGPD
Checkbox de consentimento obrigatório em todos os formulários.

## 🔧 Troubleshooting

### Erro de instalação
Use `npm install --legacy-peer-deps` devido a conflitos de peer dependencies.

### Build falha
Verifique se todas as imagens referenciadas existem ou se há erros de TypeScript.

### Layout quebrado
Verifique se o Tailwind CSS v4 está carregando corretamente no `globals.css`.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação oficial:
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev)
- [GSAP](https://gsap.com)
