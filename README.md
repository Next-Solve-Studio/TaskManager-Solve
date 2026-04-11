
# Bibliotecas instaladas:
 - Componentes:
     - @mui/material (Material-UI): Biblioteca de componentes prontos do Google Material Design.
     - @mui/icons-material: Pacote oficial de ícones do Material Design.

 - React-icons: Coleção gigante de ícones de várias bibliotecas (FontAwesome, Feather, Bootstrap etc).

 - Sonner: Biblioteca de notificações (toasts), Após criar um projeto, aparece uma mensagem verde no canto da tela.

 - emailjs: Serviço que envia email direto do frontend, Quando um dev clica "Solicitar projeto", o gerente recebe email na hora.

 - date-fns: Biblioteca para manipular datas de forma simples, Ex: format(project.deadline, 'dd/MM/yyyy') mostra "25/03/2026".

 - Firebase:
   - firebase: Biblioteca para conectar com Firebase pelo navegador, Quando um dev muda o status do projeto, o Firebase atualiza em tempo real para o gerente.
   - firebase-admin: Versão servidor do Firebase (roda nas API Routes do Next.js), A ação de promover alguém a admin só pode ser feita pelo backend com firebase-admin.

 - react-hook-form: Biblioteca para gerenciar formulários de forma performática, Evita re-renders desnecessários e reduz código em ~70% comparado a usar useState.

 - yup: Biblioteca de validação de dados, Impedir que alguém crie projeto sem título ou com prazo no passado.

 - @hookform/resolvers: Conector que faz o react-hook-form funcionar com yup, Passa as regras do yup para o react-hook-form

 - zustand: Gerenciador de estado global (mais simples que Redux), O nome do usuário aparece no canto da tela em qualquer página sem precisar buscar de novo.
 - Autenticação:
   - jsonwebtoken: Biblioteca para criar e verificar tokens de autenticação
   - cookie: Biblioteca para manipular cookies, Ex: Controlar os 20 dias de inatividade
   - bcryptjs: Biblioteca para criptografar senhas

 - recharts: Biblioteca de gráficos para React, Um gráfico de barras mostrando quantos projetos foram finalizados em cada mês.

 - lodash: Biblioteca com funções úteis para manipular dados, debounce faz a busca só aparecer depois que o usuário para de digitar.

 - uuid: Biblioteca para gerar IDs únicos


 # Task Manager Solve

O **Task Manager Solve** é uma plataforma moderna de gerenciamento de projetos e tarefas, desenvolvida para facilitar a colaboração entre administradores, líderes de projetos e desenvolvedores. O sistema oferece uma interface intuitiva com dashboards em tempo real, controle de acesso baseado em funções (RBAC) e integração robusta com o ecossistema Firebase.

---

## 🚀 Tecnologias e Bibliotecas

O projeto utiliza as tecnologias mais recentes do ecossistema JavaScript para garantir performance, escalabilidade e uma excelente experiência de usuário:

| Categoria | Tecnologias |
| :--- | :--- |
| **Framework** | [Next.js 14+](https://nextjs.org/) (App Router) |
| **Linguagem** | JavaScript (React) |
| **Backend as a Service** | [Firebase](https://firebase.google.com/) (Auth & Firestore) |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/), [Material UI (MUI)](https://mui.com/) |
| **Gerenciamento de Estado** | React Context API |
| **Formulários e Validação** | [React Hook Form](https://react-hook-form.com/), [Yup](https://github.com/jquense/yup) |
| **Visualização de Dados** | [Recharts](https://recharts.org/) |
| **Notificações** | [Sonner](https://sonner.emilkowal.ski/) |
| **Ícones** | [React Icons](https://react-icons.github.io/react-icons/) |
| **Manipulação de Datas** | [date-fns](https://date-fns.org/) |

---

## 📂 Arquitetura de Pastas

A estrutura do projeto segue as melhores práticas do Next.js, organizando responsabilidades de forma clara:

```text
src/
├── app/                # Rotas e layouts da aplicação (App Router)
│   ├── (main)/         # Grupo de rotas protegidas (Dashboard, Projetos, Usuários)
│   ├── api/            # Endpoints de API (se aplicável)
│   ├── login/          # Rota de autenticação
│   └── globals.css     # Estilos globais e tokens de design Tailwind
├── components/         # Componentes React reutilizáveis
│   ├── auth/           # Componentes de autorização (CanDo, HasRole, ProtectedRoutes)
│   ├── home/           # Componentes específicos da Dashboard
│   ├── login/          # Formulários de Login e Registro
│   ├── projects/       # Gestão de projetos (Cards, Modais, Configurações)
│   └── users/          # Gestão de usuários e permissões
├── context/            # Provedores de Contexto (Auth, Projects, Users)
├── hooks/              # Hooks personalizados (ex: useRole)
├── layout/             # Componentes de estrutura (SideMenu, Header, Footer)
├── lib/                # Configurações de bibliotecas externas (Firebase, Roles)
├── responsive/         # Utilitários para responsividade
└── utils/              # Funções utilitários e helpers globais
```

---

## 🔐 Contextos e Autenticação

O projeto utiliza a **Context API** para gerenciar estados globais de forma eficiente:

1.  **AuthContext**: Gerencia o ciclo de vida do usuário (Login, Registro, Logout) via Firebase Auth. Ele também persiste a sessão através de cookies e sincroniza os dados do usuário com o Firestore.
2.  **ProjectsContext**: Responsável pelo CRUD de projetos em tempo real usando `onSnapshot` do Firestore. Centraliza a lógica de criação, atualização e exclusão de projetos.
3.  **UsersContext**: Gerencia a listagem e modificação de perfis de usuários, permitindo que administradores alterem cargos ou removam contas.
4.  **AppProviders**: Um agregador que envolve as rotas protegidas com os contextos necessários para o funcionamento do sistema.

---

## 🛠️ Funcionamento Atual

Atualmente, o projeto funciona como um **MVP (Minimum Viable Product)** funcional com as seguintes características:

### 1. Sistema de Permissões (RBAC)
O acesso é controlado por três níveis de hierarquia definidos em `src/lib/roles.js`:
*   **Administrador**: Acesso total, incluindo gestão de usuários e exclusão de projetos.
*   **Líder de Projetos**: Pode criar e editar projetos e visualizar relatórios.
*   **Desenvolvedor**: Focado na visualização de projetos e execução de tarefas.

### 2. Fluxo de Autenticação
*   Suporte para login via **E-mail/Senha** e **Google Auth**.
*   O primeiro usuário a se cadastrar no sistema recebe automaticamente o cargo de **Administrador**.
*   Proteção de rotas tanto no cliente (via layouts) quanto no middleware (via cookies de sessão).

### 3. Gestão de Projetos
*   Listagem dinâmica com filtros por status, prioridade e desenvolvedor atribuído.
*   Formulários validados com **Yup**, garantindo a integridade dos dados enviados ao Firestore.
*   Atualização em tempo real: qualquer mudança no banco de dados é refletida instantaneamente na UI.

### 4. Dashboard
*   A tela inicial apresenta um resumo visual do status dos projetos e tarefas.
*   **Nota**: Atualmente, a Dashboard utiliza dados simulados (*mock data*) para os gráficos e KPIs, servindo como modelo para a futura integração total com as queries do Firestore.

---

## 🎨 Design System
O projeto utiliza um tema escuro (*Dark Mode*) personalizado via Tailwind CSS, com tokens de cores definidos para:
*   **Brand**: Verde vibrante (`#19CA68`)
*   **Accent**: Cyan (`#22d3ee`)
*   **Status**: Cores semânticas para Sucesso, Aviso, Erro e Info.
*   **Superfícies**: Camadas de cinza profundo e preto para uma interface profissional e de baixo cansaço visual.
