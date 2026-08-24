# Task Manager Solve

O **Task Manager Solve** é uma plataforma **Multi-Tenant (SaaS)** de gerenciamento de projetos e tarefas, desenvolvida para facilitar a colaboração dentro de diferentes empresas. O sistema oferece dashboards, controle de acesso detalhado baseado em cargos (RBAC dinâmico e configurável por empresa), agenda de equipe, gestão de clientes, cobrança recorrente via PIX/cartão, e integração em tempo real com o ecossistema Firebase.

---

## 🧩 Arquitetura Geral — Dois Repositórios

Este projeto **não roda sozinho**: ele depende de um segundo serviço para licenciamento e cobrança.

| Serviço | Repositório | Responsabilidade |
| :--- | :--- | :--- |
| **TaskManagerSolve** (este repo) | Next.js 16 (App Router) | Aplicação principal: autenticação, projetos, tarefas, clientes, agenda, RBAC, UI de cobrança |
| **api-taskmanager** | Express + TypeScript + Prisma/PostgreSQL + Redis | Cadastro de licenças, validação de assinatura, integração com Asaas (PIX/cartão), fonte da verdade do plano/status de cada empresa |

Os dois se comunicam por HTTP:
- **TaskManagerSolve → api-taskmanager**: cadastro de empresa, checagem de CPF/CNPJ duplicado, validação de licença, configuração/assinatura de cobrança (`LICENSE_API_URL`).
- **api-taskmanager → TaskManagerSolve**: webhook assinado (HMAC) avisando quando o `status`/plano/validade de uma empresa muda (pagamento confirmado, cancelamento, expiração), mantendo o Firestore sincronizado com o Postgres.

O Firestore **nunca** é a fonte da verdade do plano/pagamento — ele só espelha o que o Postgres do api-taskmanager decide. Os campos `plan`, `status`, `appKey` e `licenseExpiresAt` do documento da empresa são bloqueados contra escrita direta do cliente nas regras do Firestore.

---

## 🚀 Tecnologias e Bibliotecas

| Categoria | Tecnologias |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Linguagem** | JavaScript (React 19) |
| **Backend as a Service** | [Firebase](https://firebase.google.com/) (Auth, Firestore) + [firebase-admin](https://firebase.google.com/docs/admin/setup) nas API Routes |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/), [Material UI (MUI)](https://mui.com/) |
| **Gerenciamento de Estado** | React Context API |
| **Formulários e Validação** | [React Hook Form](https://react-hook-form.com/), [Yup](https://github.com/jquense/yup) |
| **Visualização de Dados** | [Recharts](https://recharts.org/) |
| **Notificações (toast)** | [Sonner](https://sonner.emilkowal.ski/) |
| **Ícones** | [React Icons](https://react-icons.github.io/react-icons/), [@mui/icons-material](https://mui.com/material-ui/material-icons/) |
| **Manipulação de Datas** | [date-fns](https://date-fns.org/) |
| **Exportação de Relatórios** | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) (PDF), [ExcelJS](https://github.com/exceljs/exceljs) (Excel) |
| **Autenticação de Tokens (API)** | [jose](https://github.com/panva/jose) — verificação de ID Tokens do Firebase nas rotas server-side |
| **E-mail Transacional** | [EmailJS](https://www.emailjs.com/) (API REST, chamada do servidor) — código de verificação para troca de senha |
| **Utilitários** | [lodash](https://lodash.com/), [uuid](https://github.com/uuidjs/uuid), [zustand](https://github.com/pmndrs/zustand) |

---

## 📂 Arquitetura de Pastas

```text
src/
├── app/                    # Rotas e layouts (App Router)
│   ├── (main)/             # Rotas protegidas (home, analytics, clients, projects, schedule, settings, tasks, users)
│   │   └── LicenseGuard.jsx    # Bloqueia o app quando a licença está inativa/expirada; fluxo de pagamento (PIX/cartão)
│   ├── api/                 # API Routes (server-side)
│   │   ├── auth/             # Sessão (cookie) e código de verificação por e-mail (troca de senha)
│   │   ├── billing/           # Ponte para o api-taskmanager (setup/subscribe/status/cancelar assinatura ou cadastro)
│   │   ├── webhooks/          # Recebe o aviso de status de licença vindo do api-taskmanager
│   │   ├── register-company/, registerEmployee/, deleteEmployee/, check-cpf-availability/, validate-license/
│   │   └── lgpd/              # Exportação dos próprios dados do usuário
│   ├── login/                # Rotas públicas (Login / Cadastro de Empresa / Recuperar Senha)
│   └── globals.css
├── components/              # Componentes React modularizados por feature
│   ├── auth/                 # CanDo, ProtectedRoutes — controle de UI baseado em permissões
│   ├── billing/               # Formulário de cartão de crédito (visual animado) compartilhado entre cadastro e reativação
│   ├── login/                 # Formulários de acesso, seleção de plano, cadastro de empresa
│   └── ...                    # analytics, clients, home, projects, schedule, settings, tasks, users, ui
├── context/                  # Providers globais (ver seção abaixo)
├── hooks/                    # Custom Hooks (useRole, responsividade, debounce)
├── lib/                      # Configuração do Firebase, Admin SDK, matriz de permissões padrão (roles.js)
├── styles/                   # Utilitários de estilização extras
└── utils/                    # Formatadores, exportadores, ActivityLogger, mensagens de erro do Firebase
```

---

## 🏢 Multi-Tenant & Contextos Globais

O isolamento de dados é garantido validando o `companyId` da empresa em toda operação do Firestore, tanto no client-side quanto nas **regras de segurança do Firestore** (não confia só na UI).

### Providers (`src/context/`)
1. **AuthContext** — sessão, cookie httpOnly, login (e-mail/Google), cadastro de empresa/funcionário.
2. **CompanyContext** — dados da empresa atual.
3. **RolePermissionsContext** — matriz de permissões dinâmica e customizável por empresa (ver seção RBAC).
4. **LicenseApiContext** — status da licença em tempo real (ouve o Firestore + faz polling da API externa a cada 30 min); alimenta o `LicenseGuard`.
5. **BillingContext** — integração com o fluxo de cobrança (Asaas) via `api-taskmanager`.
6. **UsersContext, ProjectsContext, ClientsContext, TasksContext, ScheduleContext** — CRUD em tempo real, sempre filtrado por `companyId`.
7. **SettingsContext** — perfil, troca de senha (com verificação por código), configurações da empresa (inclui preferências de exibição dos cards de projeto).

---

## 🛠️ Funcionalidades Principais

### 1. RBAC Dinâmico e Customizável por Empresa
As permissões não são mais fixas no código — cada empresa pode reconfigurar o que cada cargo pode fazer, na tela **Configurações → Controle de Acesso** (só o Master vê essa aba):
- **Master (Dono)**: acesso total, sempre. Não aparece na tela de configuração — não pode ser restringido, evitando autoexclusão acidental.
- **Administrador**, **Líder de Projetos**, **Desenvolvedor**: o que cada um pode fazer (criar/editar/excluir projetos, tarefas, clientes; gerenciar usuários; ver histórico de atividades; ver agenda de outros; personalizar visualização dos cards) é definido por empresa, com um padrão sensato caso nunca tenha sido customizado.
- Aplicado tanto na UI (`<CanDo permission="...">`) quanto nas regras do Firestore (`roleCan(...)`) — a permissão é real, não só visual.

### 2. Cobrança Recorrente (PIX e Cartão)
- Planos **FREE**, **BASIC** e **PRO**, com ciclo mensal ou anual (o "anual" aplica um valor mensal com desconto, cobrado todo mês).
- Pagamento via **PIX** (QR Code com expiração de 5 minutos, renovável) ou **Cartão de Crédito** (formulário com visual de cartão animado).
- Verificação de CPF/CNPJ duplicado antes de liberar o cadastro em plano pago ou gratuito (impede reuso do trial grátis).
- Cancelamento de cadastro pendente (antes do primeiro pagamento) ou de assinatura ativa, disponível em Configurações → Licença.
- Aviso de licença "vencendo em breve" (3 dias antes) e bloqueio automático do sistema quando o pagamento não é confirmado — sincronizado em tempo real com o `api-taskmanager`.

### 3. Segurança e LGPD
- Regras do Firestore restringem leitura/escrita sempre por `companyId`, nunca confiando só na interface.
- Exclusão de usuário remove tanto o documento no Firestore quanto a conta no Firebase Auth.
- Exclusão de cliente remove em cascata os registros de atividade relacionados.
- Exportação dos próprios dados (perfil, atividades, agenda) disponível em Configurações → Perfil.
- Troca de senha (logado) exige confirmação por código de 6 caracteres enviado ao e-mail cadastrado, com validade de 15 minutos e limite de 5 tentativas.

### 4. Gestão Completa de Produção
- **Projetos & Clientes**: vínculo direto com controle de faturamento, status e prazos.
- **Kanban / Tarefas**: gestão da execução em nível granular, com checklist e filtros (status, prioridade, projeto, responsável, mês).
- **Schedule (Agenda)**: disponibilidade da equipe por semana.
- **Analytics & Dashboard**: KPIs, feed de atividades em tempo real, status financeiro.
- **Activity Logger**: auditoria de quem fez o quê e quando.

---

## 🎨 Design System
Tema escuro (*Dark Mode*) via Tailwind CSS, com tokens de cores semânticos:
- **Brand / Sucesso**: Verde vibrante (`#19CA68`)
- **Accent / Informativo**: Cyan (`#22d3ee`) e Azul (`#3b82f6`)
- **Cargos (Roles)**: cores específicas por cargo (Laranja para Master, Verde para Admin, Cyan para Líder, Roxo para Dev)
- **Superfícies**: múltiplas camadas de cinza profundo e preto, reduzindo o cansaço visual

---

## ⚙️ Variáveis de Ambiente

Crie um `.env.local` (desenvolvimento) com as variáveis abaixo. **Nunca commite este arquivo.**

```bash
# Firebase — configuração pública do cliente (não são segredos)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side apenas — segredos reais)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY_B64=      # chave privada em base64 (evita corrupção de \n em produção)

# Integração com o api-taskmanager
LICENSE_API_URL=                 # ex: https://api-taskmanager.nextsolve.com.br
REGISTRATION_SECRET=             # precisa ser IGUAL ao configurado no api-taskmanager
LICENSE_WEBHOOK_SECRET=          # segredo do webhook de status de licença (HMAC)
LICENSE_WEBHOOK_SECRET_PREVIOUS= # opcional, usado só durante rotação do segredo acima

# EmailJS (código de verificação para troca de senha)
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
```

---

## ▶️ Como Rodar Localmente

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env.local (veja a seção acima)

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para testar cadastro/cobrança, o `api-taskmanager` precisa estar acessível (local ou já publicado) e o `LICENSE_API_URL` apontando para ele.

### Outros comandos
```bash
npm run build   # build de produção
npm run start   # roda o build de produção
npm run lint    # Biome (lint)
npm run format  # Biome (formata o código)
```

---

## 🔒 Regras do Firestore

As regras de segurança vivem versionadas em `firestore.rules` na raiz do repositório e precisam ser publicadas manualmente no Console do Firebase (Firestore Database → Regras) após qualquer alteração — não há deploy automático delas. Pontos-chave:
- Toda leitura/escrita de dados de empresa exige `companyId` igual ao do usuário autenticado.
- Permissões por cargo são resolvidas dinamicamente via `roleCan()`, lendo a matriz customizada da empresa em `role_permissions/{companyId}` (com fallback pros padrões de `src/lib/roles.js`).
- Campos de cobrança (`plan`, `status`, `appKey`, `licenseExpiresAt`) só podem ser alterados pelo backend (Admin SDK), nunca pelo cliente.
