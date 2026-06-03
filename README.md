# Bibliotecas instaladas:
 - Componentes:
     - @mui/material (Material-UI): Biblioteca de componentes prontos do Google Material Design.
     - @mui/icons-material: Pacote oficial de ícones do Material Design.

 - React-icons: Coleção gigante de ícones de várias bibliotecas (FontAwesome, Feather, Bootstrap etc).

 - Sonner: Biblioteca de notificações (toasts).

 - emailjs: Serviço que envia email direto do frontend.

 - date-fns: Biblioteca para manipular datas de forma simples.

 - Firebase:
   - firebase: Biblioteca para conectar com Firebase pelo navegador.
   - firebase-admin: Versão servidor do Firebase (roda nas API Routes do Next.js).

 - react-hook-form: Biblioteca para gerenciar formulários de forma performática.

 - yup: Biblioteca de validação de dados.

 - @hookform/resolvers: Conector que faz o react-hook-form funcionar com yup.

 - zustand: Gerenciador de estado global (se aplicável).
 - Autenticação:
   - jsonwebtoken: Biblioteca para criar e verificar tokens de autenticação
   - cookie: Biblioteca para manipular cookies
   - bcryptjs: Biblioteca para criptografar senhas

 - recharts: Biblioteca de gráficos para React.

 - lodash: Biblioteca com funções úteis para manipular dados.

 - uuid: Biblioteca para gerar IDs únicos.


# Task Manager Solve

O **Task Manager Solve** é uma plataforma moderna e **Multi-Tenant (SaaS)** de gerenciamento de projetos e tarefas, desenvolvida para facilitar a colaboração dentro de diferentes empresas. O sistema oferece uma interface intuitiva com dashboards, controle de acesso detalhado baseado em funções (RBAC), agenda da equipe, gestão de clientes e integração robusta em tempo real com o ecossistema Firebase.

---

## 🚀 Tecnologias e Bibliotecas

O projeto utiliza as tecnologias mais recentes do ecossistema JavaScript para garantir performance, escalabilidade e uma excelente experiência de usuário:

| Categoria | Tecnologias |
| :--- | :--- |
| **Framework** | [Next.js 14+](https://nextjs.org/) (App Router) |
| **Linguagem** | JavaScript (React) |
| **Backend as a Service** | [Firebase](https://firebase.google.com/) (Auth, Firestore) |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/), [Material UI (MUI)](https://mui.com/) |
| **Gerenciamento de Estado** | React Context API |
| **Formulários e Validação** | [React Hook Form](https://react-hook-form.com/), [Yup](https://github.com/jquense/yup) |
| **Visualização de Dados** | [Recharts](https://recharts.org/) |
| **Notificações** | [Sonner](https://sonner.emilkowal.ski/) |
| **Ícones** | [React Icons](https://react-icons.github.io/react-icons/) |
| **Manipulação de Datas** | [date-fns](https://date-fns.org/) |

---

## 📂 Arquitetura de Pastas

A estrutura do projeto segue as melhores práticas do Next.js (App Router), dividida por módulos (features):

```text
src/
├── app/                # Rotas e layouts (App Router)
│   ├── (main)/         # Rotas protegidas (analytics, clients, projects, schedule, settings, tasks, users)
│   ├── api/            # API Routes (ex: registro de funcionário)
│   ├── login/          # Rotas públicas (Login / Cadastro de Empresa)
│   └── globals.css     # Estilos globais Tailwind
├── components/         # Componentes React modularizados por feature
│   ├── analytics/      # Gráficos e indicadores financeiros/status
│   ├── auth/           # Controle de UI baseado em permissões (CanDo, HasRole)
│   ├── clients/        # Gestão da carteira de clientes
│   ├── home/           # Dashboard inicial (Feed, Stats)
│   ├── login/          # Formulários de acesso
│   ├── projects/       # Cadastro e acompanhamento de projetos
│   ├── schedule/       # Controle de cronogramas e disponibilidade
│   ├── settings/       # Configurações do sistema e perfil
│   ├── tasks/          # Kanban/Listagem de tarefas
│   ├── ui/             # Componentes base (Botões, Badges, Tooltips)
│   └── users/          # Administração da equipe
├── context/            # Provedores de Estado Global Multi-Tenant
├── hooks/              # Custom Hooks (useRole, responsividade, debounce)
├── layout/             # Estruturas da página (SideMenu, Header)
├── lib/                # Configurações globais (Firebase, Matriz de Permissões/Roles)
├── styles/             # Utilitários de estilização extras
└── utils/              # Funções utilitárias (Formatadores, Exportadores, Activity Logger)
```

---

## 🏢 Arquitetura Multi-Tenant & Contextos

O sistema foi arquitetado para suportar múltiplas empresas (Tenants) simultaneamente e de forma segura. 
O isolamento de dados é garantido injetando e validando o `companyId` da empresa em todas as operações do Firestore e na Context API.

### Provedores de Estado:
1. **AuthContext**: Gerencia sessão, persistência via cookies, login (E-mail/Google) e onboarding (criação da Empresa ou Funcionário). O `currentUser` contém o vínculo primordial com o `companyId`.
2. **CompanyContext**: Dados e configurações gerais do Tenant (empresa atual logada).
3. **UsersContext**: Gestão dos funcionários que pertencem **exclusivamente** à empresa atual.
4. **ProjectsContext**: CRUD em tempo real de projetos. Filtra automaticamente os dados apenas do `companyId` ativo.
5. **ClientsContext**: Gestão da carteira de clientes do Tenant.
6. **TasksContext**: Quadro de tarefas e entregáveis vinculados aos projetos.
7. **ScheduleContext**: Agenda e planejamento da capacidade produtiva da equipe.

---

## 🛠️ Funcionalidades Principais

### 1. Sistema de Permissões Avançado (RBAC)
O acesso e as ações na UI/Banco são controlados por hierarquias dinâmicas (`src/lib/roles.js`):
*   **Master (Dono)**: Controle total. Pode gerenciar a assinatura da empresa, ver faturamento, criar e excluir usuários livremente.
*   **Administrador**: Gestão quase irrestrita da operação diária, gerenciando usuários, projetos, e acessando relatórios.
*   **Líder de Projetos**: Focado no lado operacional; cria projetos, atribui tarefas, planeja a agenda e visualiza andamento.
*   **Desenvolvedor**: Focado na execução; visualiza os projetos onde está alocado e gerencia o status das próprias tarefas.

### 2. Multi-Tenancy e Isolamento de Dados
*   **Onboarding Simples**: Ao se registrar, o usuário cria sua **Empresa**, ganhando o cargo de `Master`.
*   **Gestão de Equipe**: O Master/Admin pode convidar funcionários diretamente para a sua base, isolando totalmente as informações entre organizações.
*   **Consultas Seguras**: O front-end blinda todas as requisições (`where("companyId", "==", currentUser.companyId)`), impedindo vazamento de dados entre empresas.

### 3. Gestão Completa de Produção
*   **Projetos & Clientes**: Vínculo direto de projetos com clientes cadastrados, com controle de faturamento, status e prazos.
*   **Kanban / Tarefas**: Gestão da execução em nível granular.
*   **Schedule (Agenda)**: Visualização da disponibilidade da equipe durante as semanas, melhorando o fluxo de alocação.
*   **Analytics & Dashboard**: Visualização de KPIs da empresa, feed de atividades em tempo real e status financeiro.
*   **Activity Logger**: Auditoria de ações gerando histórico do que foi feito, por quem e quando.

---

## 🎨 Design System
O projeto utiliza um tema escuro (*Dark Mode*) sofisticado via Tailwind CSS, com tokens de cores semânticos:
*   **Brand / Sucesso**: Verde vibrante (`#19CA68`)
*   **Accent / Informativo**: Cyan (`#22d3ee`) e Azul (`#3b82f6`)
*   **Cargos (Roles)**: Cores específicas para rápida identificação visual (Laranja para Master, Verde para Admin, Cyan para Líder, Roxo para Dev).
*   **Superfícies**: Múltiplas camadas de cinza profundo e preto, reduzindo o cansaço visual e garantindo contraste ideal.