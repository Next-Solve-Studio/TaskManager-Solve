const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, PageBreak, ExternalHyperlink
} = require('docx');
const fs = require('fs');

// Color palette
const COLORS = {
  primary: '2563EB',
  primaryLight: 'DBEAFE',
  danger: 'DC2626',
  dangerLight: 'FEE2E2',
  warning: 'D97706',
  warningLight: 'FEF3C7',
  success: '16A34A',
  successLight: 'DCFCE7',
  gray: '374151',
  grayLight: 'F3F4F6',
  border: 'E5E7EB',
  white: 'FFFFFF',
  dark: '1F2937',
  headerBg: '1E3A5F',
};

const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, color: COLORS.headerBg, font: 'Arial' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.primary, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 28, color: COLORS.primary, font: 'Arial' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: COLORS.dark, font: 'Arial' })],
  });
}

function para(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, color: COLORS.gray, font: 'Arial', ...options })],
  });
}

function bold(text, color = COLORS.dark) {
  return new TextRun({ text, bold: true, size: 22, color, font: 'Arial' });
}

function code(text) {
  return new TextRun({ text, font: 'Courier New', size: 20, color: '7C3AED', highlight: 'yellow' });
}

function bullet(text, level = 0, color = COLORS.gray) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, color, font: 'Arial' })],
  });
}

function bulletMixed(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 60, after: 60 },
    children: runs,
  });
}

function coloredBox(rows, bgColor, borderColor) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: rows.map(row => new TableRow({
      children: [new TableCell({
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
          left: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
          right: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
        },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [row],
      })],
    })),
  });
}

function statusTable(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  const headerCells = headers.map((h, i) => new TableCell({
    borders,
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text: h, bold: true, color: COLORS.white, size: 20, font: 'Arial' })],
    })],
  }));
  const dataRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: i === 0 ? COLORS.grayLight : COLORS.white, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, size: 20, color: COLORS.gray, font: 'Arial' })],
      })],
    })),
  }));
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ children: headerCells }), ...dataRows],
  });
}

function spacer(before = 120) {
  return new Paragraph({ spacing: { before, after: 0 }, children: [new TextRun('')] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.border, space: 1 } },
    children: [new TextRun('')],
  });
}

// ========================= DOCUMENT =========================
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '\u25E6', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [

      // ========================= CAPA =========================
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 200 },
        children: [new TextRun({ text: 'Task Manager Solve', bold: true, size: 72, color: COLORS.headerBg, font: 'Arial' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: 'Code Review & Technical Documentation', size: 32, color: COLORS.primary, font: 'Arial' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Next.js  |  Firebase  |  React Context API', size: 24, color: COLORS.gray, font: 'Arial', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 1440 },
        children: [new TextRun({ text: 'Maio 2026', size: 22, color: COLORS.gray, font: 'Arial' })],
      }),
      divider(),

      // ========================= SUMARIO =========================
      h1('Sumário'),
      bullet('1. Visão Geral do Projeto'),
      bullet('2. Stack e Arquitetura'),
      bullet('3. Organização do Código'),
      bullet('4. Segurança'),
      bullet('5. Funcionalidades'),
      bullet('   5.1  Autenticação'),
      bullet('   5.2  Projetos'),
      bullet('   5.3  Tarefas (Tasks)'),
      bullet('   5.4  Agenda (Schedules)'),
      bullet('   5.5  Usuários'),
      bullet('   5.6  Clientes'),
      bullet('   5.7  Settings'),
      bullet('   5.8  Tema'),
      bullet('   5.9  Dashboard (Home)'),
      bullet('6. Performance'),
      bullet('7. Bugs Identificados'),
      bullet('8. Recomendações Finais'),
      spacer(200),

      // ========================= 1. VISAO GERAL =========================
      h1('1. Visão Geral do Projeto'),
      para('O Task Manager Solve é uma aplicação web de gestão de projetos e tarefas voltada para equipes de desenvolvimento. Permite controle de projetos, tarefas com checklist, agenda semanal, gestão de clientes e controle de usuários com sistema de papéis (RBAC).'),
      spacer(),
      statusTable(
        ['Aspecto', 'Avaliação', 'Nota'],
        [
          ['Organização', 'Estrutura de pastas clara e bem dividida por feature', '⭐ 9/10'],
          ['Segurança', 'Boas práticas, porém com pontos críticos no middleware', '⚠️ 6.5/10'],
          ['Performance', 'Uso de useMemo/useCallback; carregamento global sem paginação', '⚠️ 7/10'],
          ['Manutenibilidade', 'Comentários detalhados, código legível e bem separado', '⭐ 9/10'],
          ['Completude', 'Funcionalidades bem implementadas com log de atividades', '⭐ 8/10'],
        ],
        [3500, 4360, 1500]
      ),
      spacer(),

      // ========================= 2. STACK =========================
      h1('2. Stack e Arquitetura'),
      h2('Tecnologias Utilizadas'),
      statusTable(
        ['Camada', 'Tecnologia', 'Uso'],
        [
          ['Framework', 'Next.js (App Router)', 'Roteamento, SSR, middleware'],
          ['Backend / DB', 'Firebase Firestore + Auth', 'Banco de dados em tempo real, autenticação'],
          ['Estado Global', 'React Context API', 'Gerenciamento de estado por feature'],
          ['Formulários', 'React Hook Form + Yup', 'Validação e controle de formulários'],
          ['UI Components', 'Material UI + Custom CSS', 'Componentes base + estilos customizados'],
          ['Notificações', 'Sonner', 'Toasts de feedback ao usuário'],
          ['Datas', 'date-fns', 'Manipulação e formatação de datas'],
          ['Ícones', 'React Icons (MD, FA, AI)', 'Ícones variados'],
        ],
        [2800, 2800, 3760]
      ),
      spacer(),
      h2('Padrão de Arquitetura'),
      para('O projeto segue o padrão de Context + Provider por feature, onde cada domínio (Projetos, Tarefas, Usuários, etc.) tem seu próprio contexto React. Os componentes consomem os contextos via hooks customizados, sem prop drilling.'),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('Fluxo de dados: ', COLORS.primary), new TextRun({ text: 'Firebase Firestore (onSnapshot) → Context Provider → Custom Hook → Componente', size: 22, font: 'Arial', color: COLORS.dark })] }),
      ], COLORS.primaryLight, COLORS.primary),
      spacer(),

      // ========================= 3. ORGANIZACAO =========================
      h1('3. Organização do Código'),
      h2('Estrutura de Pastas'),
      para('A organização é um dos pontos mais fortes do projeto. A estrutura segue o modelo feature-based, separando claramente responsabilidades:'),
      spacer(),
      coloredBox([
        new Paragraph({ children: [code('src/app/              '), new TextRun({ text: '→ Páginas (App Router do Next.js)', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/components/      '), new TextRun({ text: '→ Componentes por feature (tasks, projects, users...)', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/context/         '), new TextRun({ text: '→ State management via Context API', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/hooks/           '), new TextRun({ text: '→ Custom hooks (useRole, useDebounce, useIsMobile)', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/lib/             '), new TextRun({ text: '→ Configurações externas (Firebase, roles/permissões)', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/layout/          '), new TextRun({ text: '→ Componentes de layout (Header, SideMenu)', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/styles/          '), new TextRun({ text: '→ Componentes de estilo reutilizáveis', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('src/utils/           '), new TextRun({ text: '→ Funções auxiliares (ActivityLogger, formatadores)', size: 20, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.grayLight, COLORS.border),
      spacer(),
      h2('Pontos Positivos de Organização'),
      bullet('Separação clara por feature: cada funcionalidade tem sua pasta com subpastas button/, card/, modals/, sections/'),
      bullet('Hooks customizados bem definidos: useRole, useDebounce, useIsMobile, useIsTablet, useProjectDates'),
      bullet('Sistema de permissões centralizado em src/lib/roles.js — zero duplicação de regras'),
      bullet('AppProviders.jsx agrega todos os contextos em um único ponto de entrada'),
      bullet('Comentários extensivos em português, facilitando a manutenção pela equipe'),
      h2('Pontos de Melhoria na Organização'),
      bulletMixed([bold('ProjectsContext', COLORS.danger), new TextRun({ text: ' duplica a busca de users e clients que já existem em seus respectivos contextos', size: 22, font: 'Arial', color: COLORS.gray })]),
      bulletMixed([bold('ActivityLogger.jsx', COLORS.warning), new TextRun({ text: ' está na pasta utils/ mas é um módulo JSX — considere movê-lo para services/ ou lib/', size: 22, font: 'Arial', color: COLORS.gray })]),
      bullet('Arquivo proxy.js deveria estar na raiz como middleware.js para seguir a convenção do Next.js'),
      spacer(),

      // ========================= 4. SEGURANCA =========================
      h1('4. Segurança'),
      coloredBox([
        new Paragraph({ children: [new TextRun({ text: '⚠️  IMPORTANTE: A segurança do lado do cliente (CanDo, ProtectedRoutes, useRole) é apenas visual. A verdadeira segurança deve ser enforçada nas Firestore Security Rules no Firebase Console.', size: 22, font: 'Arial', bold: true, color: COLORS.warning })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),
      h2('O que está Correto'),
      bullet('Credenciais Firebase via variáveis de ambiente (NEXT_PUBLIC_*) — sem exposição de secrets no código'),
      bullet('Cookie de sessão com flags Secure (em produção) e SameSite=lax'),
      bullet('Troca de senha exige reautenticação via EmailAuthProvider.credential() — correto'),
      bullet('Guards de rota client-side: ProtectedRoutes e CanDo com sistema de permissões centralizado'),
      bullet('onAuthStateChanged para gestão reativa do estado de autenticação'),
      bullet('Queries protegidas por currentUser?.uid antes de abrir listeners'),
      spacer(),
      h2('Vulnerabilidades e Riscos'),
      spacer(80),
      coloredBox([
        new Paragraph({ children: [bold('🔴  CRÍTICO — Middleware não valida o JWT', COLORS.danger)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'O arquivo proxy.js (middleware) apenas verifica a EXISTÊNCIA do cookie __session, sem validar a assinatura ou expiração do token JWT. Qualquer pessoa pode criar um cookie com esse nome e acessar as rotas protegidas.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Solução: ', COLORS.success), new TextRun({ text: 'Use o Firebase Admin SDK no middleware para verificar o token com auth.verifySessionCookie() ou auth.verifyIdToken()', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.dangerLight, COLORS.danger),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('🔴  CRÍTICO — Corrida de condição no primeiro registro', COLORS.danger)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'No RegisterForm, o primeiro usuário cadastrado vira "administrador" via verificação isFirstUser = usersSnapshot.empty. Em cenários de alta concorrência (dois registros simultâneos), ambos podem receber o papel de admin.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Solução: ', COLORS.success), new TextRun({ text: 'Use uma Firestore Transaction ou defina o admin manualmente no Firebase Console via Security Rules.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.dangerLight, COLORS.danger),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('🟡  MÉDIO — updateSystemSettings sem verificação de role no contexto', COLORS.warning)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'A função updateSystemSettings em SettingsContext não verifica se o currentUser tem a permissão canManageSystemSettings. A proteção existe apenas no client-side (CanDo), mas a função em si poderia ser chamada de qualquer lugar.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Solução: ', COLORS.success), new TextRun({ text: 'Adicionar verificação de role no início da função + Firestore Security Rules para a coleção system_settings.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('🟡  MÉDIO — Schedule: edição de agenda de outros usuários sem validação server-side', COLORS.warning)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'A função saveDay aceita um targetUserId para editar a agenda de outro usuário. A validação se o currentUser pode fazer isso existe apenas no client-side. As Firestore Security Rules precisam garantir que apenas admins possam escrever no documento de outro usuário.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('🟡  MÉDIO — deleteUser não remove o usuário do Firebase Auth', COLORS.warning)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'UsersContext.deleteUser() remove apenas o documento do Firestore, mas não deleta a conta no Firebase Authentication. O usuário deletado pode continuar fazendo login.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Solução: ', COLORS.success), new TextRun({ text: 'Use uma Cloud Function (Firebase Functions) com Admin SDK para deletar o usuário de ambos os lugares atomicamente.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),
      h2('Firestore Security Rules Recomendadas'),
      para('É essencial configurar Security Rules no Firebase Console para proteger todas as coleções. Exemplo básico:'),
      coloredBox([
        new Paragraph({ children: [code('rules_version = \'2\';'), new TextRun({ text: '', size: 22, font: 'Courier New' })] }),
        new Paragraph({ children: [code('service cloud.firestore {'), new TextRun({ text: '', size: 22, font: 'Courier New' })] }),
        new Paragraph({ children: [code('  match /databases/{database}/documents {'), new TextRun({ text: '', size: 22, font: 'Courier New' })] }),
        new Paragraph({ children: [code('    // Projetos: leitura autenticada, escrita p/ admin e lider'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('    match /projects/{id} {'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('      allow read: if request.auth != null;'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('                    in [\'administrador\', \'lider_de_projetos\'];'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('    }'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('    // system_settings: apenas admins'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('    match /system_settings/{id} {'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('      allow read: if request.auth != null;'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('      allow write: if get(...).data.role == \'administrador\';'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('    }'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('  }'), new TextRun({ text: '', size: 22 })] }),
        new Paragraph({ children: [code('}'), new TextRun({ text: '', size: 22 })] }),
      ], COLORS.grayLight, COLORS.border),
      spacer(),

      // ========================= 5. FUNCIONALIDADES =========================
      h1('5. Funcionalidades'),

      // 5.1 Auth
      h2('5.1 Autenticação'),
      para('Gerenciada pelo AuthContext.jsx com Firebase Authentication. Suporte a login por e-mail/senha e Google OAuth.'),
      spacer(80),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Login com e-mail/senha', '✅ Implementado', 'Validação com Yup + React Hook Form'],
          ['Login com Google', '✅ Implementado', 'GoogleAuthProvider do Firebase'],
          ['Registro de novo usuário', '✅ Implementado', 'Cria doc no Firestore + role automático'],
          ['Logout', '✅ Implementado', 'Limpa cookie de sessão + redireciona'],
          ['Persistência de sessão', '✅ Implementado', 'Cookie __session, 30 dias'],
          ['Proteção de rotas', '⚠️ Parcial', 'Middleware não valida JWT (ver Segurança)'],
          ['Recuperação de senha', '❌ Ausente', 'Não implementado — recomenda-se adicionar'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),
      h3('Fluxo de Login'),
      bullet('Usuário preenche e-mail e senha'),
      bullet('React Hook Form + Yup valida os campos'),
      bullet('signInWithEmailAndPassword() do Firebase é chamado'),
      bullet('onAuthStateChanged dispara, popula currentUser com dados do Firestore'),
      bullet('justLoggedIn.current = true sinaliza para redirecionar após o estado ser atualizado'),
      bullet('Cookie __session é salvo com o token JWT do Firebase'),
      spacer(80),
      coloredBox([
        new Paragraph({ children: [bold('Bug no LoginForm: ', COLORS.danger), new TextRun({ text: 'O bloco finally sempre dispara o toast de sucesso, mesmo quando o login falha. Mova o toast.success() para dentro do bloco try, ANTES do catch.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.dangerLight, COLORS.danger),
      spacer(),

      // 5.2 Projetos
      h2('5.2 Projetos'),
      para('Gerenciado pelo ProjectsContext.jsx. Usa onSnapshot para atualizações em tempo real. Suporta criação, edição, exclusão e filtros.'),
      spacer(80),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Listar projetos', '✅ Implementado', 'Tempo real via onSnapshot'],
          ['Criar projeto', '✅ Implementado', 'Com log de atividade'],
          ['Editar projeto', '✅ Implementado', 'Com log de mudança de status'],
          ['Excluir projeto', '✅ Implementado', 'Com log de atividade'],
          ['Status automático', '✅ Implementado', 'deliveryDate e supportEndDate automáticos'],
          ['Filtros', '✅ Implementado', 'Por status, prioridade, tech stack'],
          ['Mapa de dados', '✅ Implementado', 'usersMap, clientMap, projectMap via useMemo'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),
      h3('Lógica de Status Inteligente'),
      bullet('Quando status muda para "concluido" → deliveryDate recebe serverTimestamp() automaticamente'),
      bullet('Quando status muda para "suporte" → supportEndDate = hoje + 45 dias automaticamente'),
      bullet('Quando sai de "concluido" ou "suporte" → as datas são zeradas (null)'),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('Melhoria sugerida: ', COLORS.warning), new TextRun({ text: 'ProjectsContext faz getDocs() separado para users e clients, duplicando dados que já existem em UsersContext e ClientsContext. Considere consumir os contextos existentes para evitar múltiplas leituras do Firestore.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),

      // 5.3 Tasks
      h2('5.3 Tarefas (Tasks)'),
      para('Gerenciado pelo TasksContext.jsx. Suporta filtragem por projeto (projectId) ou listagem global. Inclui checklist, prioridade, status e atribuição de usuários.'),
      spacer(80),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Listar tarefas', '✅ Implementado', 'Global ou por projeto (onSnapshot)'],
          ['Criar tarefa', '✅ Implementado', 'Com checklist e campos ricos'],
          ['Editar tarefa', '✅ Implementado', 'Log de mudança de status'],
          ['Excluir tarefa', '⚠️ Bug', 'Referencia payload.projectId inexistente'],
          ['Checklist', '✅ Implementado', 'updateChecklist() sem reabrir modal'],
          ['Filtros', '✅ Implementado', 'Por status, prioridade, projeto, responsável'],
          ['Atribuição múltipla', '✅ Implementado', 'assignedTo[] com múltiplos usuários'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('🔴  Bug Crítico — deleteTask usa variável payload inexistente', COLORS.danger)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'Na função deleteTask do TasksContext, o log de atividade referencia payload.projectId, mas a variável payload não existe nesse escopo (ela só existe nas funções createTask e updateTask). Isso gera um ReferenceError em runtime ao deletar uma tarefa.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Correção: ', COLORS.success), new TextRun({ text: 'Substituir payload.projectId por task.projectId no logActivity dentro de deleteTask.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.dangerLight, COLORS.danger),
      spacer(),

      // 5.4 Schedule
      h2('5.4 Agenda (Schedules)'),
      para('Gerenciado pelo ScheduleContext.jsx. Exibe agenda semanal por usuário. Admins e líderes podem ver e editar agendas de todos os usuários.'),
      spacer(80),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Minha agenda', '✅ Implementado', 'Edição dos próprios dias da semana'],
          ['Agenda de outros usuários', '✅ Implementado', 'Filtro por userId'],
          ['Navegação semanal', '✅ Implementado', 'Anterior / atual / próxima semana'],
          ['Edição por admin', '✅ Implementado', 'targetUserId permite editar agenda alheia'],
          ['Persistência semanal', '✅ Implementado', 'Chave única: {userId}_{weekKey}'],
          ['Log de atividade', '✅ Implementado', 'Registra cada atualização de dia'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),
      h3('Estrutura do Documento no Firestore'),
      coloredBox([
        new Paragraph({ children: [code('schedules/{userId}_{weekKey}'), new TextRun({ text: '  →  ex: abc123_2026-04-28', size: 20, font: 'Arial', color: COLORS.gray })] }),
        new Paragraph({ children: [code('  userId, userName, weekKey, weekStart'), new TextRun({ text: '', size: 20 })] }),
        new Paragraph({ children: [code('  days.segunda.description / .updatedAt'), new TextRun({ text: '', size: 20 })] }),
        new Paragraph({ children: [code('  days.terca ... days.domingo'), new TextRun({ text: '', size: 20 })] }),
      ], COLORS.grayLight, COLORS.border),
      spacer(),

      // 5.5 Usuarios
      h2('5.5 Usuários'),
      para('Gerenciado pelo UsersContext.jsx. Lista todos os usuários em tempo real. Admins podem alterar roles e excluir usuários.'),
      spacer(80),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Listar usuários', '✅ Implementado', 'Tempo real via onSnapshot'],
          ['Alterar role', '✅ Implementado', 'Admin pode promover/rebaixar'],
          ['Excluir usuário (Firestore)', '✅ Implementado', 'Remove documento'],
          ['Excluir usuário (Auth)', '❌ Ausente', 'Não remove do Firebase Auth'],
          ['Convidar usuário', '❌ Ausente', 'Não existe sistema de convite'],
          ['Visualização por cards/tabela', '✅ Implementado', 'Alternância card/linha'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),

      // 5.6 Clientes
      h2('5.6 Clientes'),
      para('Gerenciado pelo ClientsContext.jsx. CRUD completo com visualização em tabela e cards, busca por texto e filtros.'),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Listar clientes', '✅ Implementado', 'Tempo real via onSnapshot'],
          ['Criar cliente', '✅ Implementado', 'Formulário com validação'],
          ['Editar cliente', '✅ Implementado', 'Modal de edição'],
          ['Excluir cliente', '✅ Implementado', 'Com modal de confirmação'],
          ['Busca por texto', '✅ Implementado', 'SearchInput com debounce'],
          ['Log de atividade', '✅ Implementado', 'Registra todas as ações'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),

      // 5.7 Settings
      h2('5.7 Settings'),
      para('Gerenciado pelo SettingsContext.jsx. Divide-se em configurações de perfil, segurança e configurações globais do sistema.'),
      statusTable(
        ['Feature', 'Status', 'Observação'],
        [
          ['Editar perfil (nome)', '✅ Implementado', 'Atualiza Firestore'],
          ['Trocar senha', '✅ Implementado', 'Reautenticação obrigatória'],
          ['Configurações globais', '✅ Implementado', 'allowRegistration, nome da empresa'],
          ['Foto de perfil', '❌ Ausente', 'Não há upload de avatar'],
          ['Preferências do usuário', '⚠️ Parcial', 'Estrutura existe, UI incompleta'],
        ],
        [3200, 1800, 4360]
      ),
      spacer(),

      // 5.8 Tema
      h2('5.8 Tema (Dark/Light Mode)'),
      para('Gerenciado pelo ThemeContext.jsx. Persiste no localStorage e aplica o atributo data-theme no elemento raiz HTML para controle via CSS variables.'),
      bullet('Implementação limpa e eficiente com useCallback e localStorage'),
      bullet('data-theme="dark" e data-theme="light" controlam todas as variáveis CSS via globals.css'),
      bullet('Sem flash de tema incorreto (FOUC) pois o tema é carregado no useEffect imediato'),
      spacer(80),
      coloredBox([
        new Paragraph({ children: [bold('Melhoria sugerida: ', COLORS.warning), new TextRun({ text: 'Considere sincronizar o tema com as preferências do sistema operacional usando window.matchMedia("(prefers-color-scheme: dark)") como valor padrão, no lugar de "dark" hardcoded.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),

      // 5.9 Dashboard
      h2('5.9 Dashboard (Home)'),
      para('A tela inicial (HomeMain.jsx) apresenta estatísticas, projetos ativos, projetos da semana, feed de atividades e radar de skills da equipe.'),
      bullet('StatCards com métricas de projetos por status'),
      bullet('ActiveProjects: projetos em andamento com barra de progresso'),
      bullet('ProjectsWeek: projetos com entregas previstas nesta semana'),
      bullet('ActivityFeed: histórico de ações recentes da equipe (activity_logs)'),
      bullet('TeamRadar: gráfico radar com as tecnologias da equipe (Recharts)'),
      spacer(),

      // ========================= 6. PERFORMANCE =========================
      h1('6. Performance'),
      h2('Pontos Positivos'),
      bullet('useMemo para usersMap, clientMap e projectMap — evita recriação de objetos a cada render'),
      bullet('useCallback em todas as funções de CRUD — evita referências desnecessárias'),
      bullet('useDebounce implementado para campos de busca — reduz chamadas excessivas'),
      bullet('onSnapshot com unsubscribe correto em todos os useEffect — sem memory leaks'),
      bullet('ScheduleContext usa useMemo no value do Provider — evita re-renders desnecessários'),
      spacer(),
      h2('Problemas de Performance'),
      spacer(80),
      coloredBox([
        new Paragraph({ children: [bold('Sem paginação — carrega todos os documentos de uma vez', COLORS.danger)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'Todos os contextos usam onSnapshot ou getDocs sem limit(). Em coleções com centenas ou milhares de documentos, isso gera alto consumo de leituras do Firestore e lentidão na UI.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Solução: ', COLORS.success), new TextRun({ text: 'Adicionar limit(50) nas queries e implementar paginação com startAfter() para carregamento progressivo.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.dangerLight, COLORS.danger),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('Todos os contextos carregam na inicialização', COLORS.warning)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'AppProviders.jsx inicializa todos os contextos (Users, Projects, Clients, Tasks, Schedule) independentemente da página que o usuário está. Um usuário na tela de Agenda não precisa dos dados de Tasks carregados.', size: 22, font: 'Arial', color: COLORS.gray })] }),
        spacer(60),
        new Paragraph({ children: [bold('Solução: ', COLORS.success), new TextRun({ text: 'Mova os providers para o layout de cada feature específica, ou use lazy initialization nos contextos.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),
      coloredBox([
        new Paragraph({ children: [bold('ProjectsContext duplica fetches de users e clients', COLORS.warning)] }),
        spacer(60),
        new Paragraph({ children: [new TextRun({ text: 'O ProjectsContext faz getDocs() para users e clients internamente, enquanto UsersContext e ClientsContext já mantêm esses dados atualizados em tempo real. Isso resulta em leituras duplicadas do Firestore.', size: 22, font: 'Arial', color: COLORS.gray })] }),
      ], COLORS.warningLight, COLORS.warning),
      spacer(),
      h2('Recomendações de Performance'),
      statusTable(
        ['Recomendação', 'Prioridade', 'Impacto'],
        [
          ['Adicionar limit() em todas as queries', 'Alta', 'Reduz custo e tempo de carregamento'],
          ['Implementar paginação com startAfter()', 'Alta', 'Escalabilidade da aplicação'],
          ['Mover providers para layouts de feature', 'Média', 'Reduz carregamento inicial'],
          ['Eliminar getDocs duplicados no ProjectsContext', 'Média', 'Reduz leituras do Firestore'],
          ['Adicionar React.memo em componentes de lista', 'Baixa', 'Evita re-renders desnecessários'],
          ['Considerar TanStack Query para cache de dados', 'Baixa', 'Gerenciamento avançado de estado servidor'],
        ],
        [4000, 1500, 3860]
      ),
      spacer(),

      // ========================= 7. BUGS =========================
      h1('7. Bugs Identificados'),
      statusTable(
        ['Bug', 'Arquivo', 'Severidade', 'Correção'],
        [
          ['deleteTask usa payload.projectId (variável inexistente → ReferenceError)', 'TasksContext.jsx', '🔴 Crítico', 'Usar task.projectId no lugar'],
          ['LoginForm mostra toast de sucesso no bloco finally, mesmo em caso de erro', 'LoginForm.jsx', '🟡 Médio', 'Mover toast.success para o try'],
          ['currentUser.displayname (minúsculo) vs currentUser.displayName (Firebase API)', 'TasksContext.jsx', '🟡 Médio', 'Corrigir capitalização'],
          ['proxy.js não valida JWT — aceita qualquer cookie __session', 'proxy.js', '🔴 Crítico', 'Validar com Firebase Admin SDK'],
          ['deleteUser não remove do Firebase Auth', 'UsersContext.jsx', '🟡 Médio', 'Usar Cloud Function com Admin SDK'],
        ],
        [3600, 2000, 1200, 2560]
      ),
      spacer(),

      // ========================= 8. RECOMENDACOES =========================
      h1('8. Recomendações Finais'),
      h2('Prioridade Alta — Corrigir Antes do Deploy'),
      bullet('Implementar validação real do JWT no middleware (Firebase Admin SDK)'),
      bullet('Corrigir o bug do deleteTask (payload.projectId → task.projectId)'),
      bullet('Configurar Firestore Security Rules robustas no Firebase Console'),
      bullet('Corrigir toast de sucesso no bloco finally do LoginForm'),
      spacer(),
      h2('Prioridade Média — Próximo Ciclo'),
      bullet('Usar Cloud Function para deletar usuários do Firebase Auth ao excluir'),
      bullet('Adicionar limit() e paginação nas queries do Firestore'),
      bullet('Eliminar fetches duplicados de users/clients no ProjectsContext'),
      bullet('Adicionar recuperação de senha (sendPasswordResetEmail)'),
      bullet('Sincronizar tema padrão com a preferência do sistema operacional'),
      bullet('Mover providers para layouts de feature (lazy loading de contextos)'),
      spacer(),
      h2('Prioridade Baixa — Melhorias Futuras'),
      bullet('Upload de foto de perfil (Firebase Storage)'),
      bullet('Sistema de convite por e-mail para novos usuários'),
      bullet('Adicionar testes unitários para funções de contexto (Jest/Vitest)'),
      bullet('Adicionar React.memo em componentes de listagem'),
      bullet('Mover ActivityLogger para src/services/ ou src/lib/'),
      bullet('Renomear proxy.js para middleware.js (convenção Next.js)'),
      spacer(),
      h2('Avaliação Final'),
      coloredBox([
        new Paragraph({ children: [new TextRun({ text: 'O projeto demonstra maturidade técnica considerável para um sistema interno de gestão. A organização do código é excelente, o sistema de permissões está bem desenhado e os contextos React são implementados com boas práticas. Os principais pontos de atenção são a segurança do middleware e a falta de Firestore Security Rules, que devem ser endereçados antes de qualquer exposição em produção.', size: 22, font: 'Arial', color: COLORS.dark })] }),
        spacer(100),
        new Paragraph({ children: [bold('Com os bugs críticos corrigidos e as Security Rules configuradas, o projeto está em excelente forma.', COLORS.success)] }),
      ], COLORS.primaryLight, COLORS.primary),
      spacer(),

      // Footer
      divider(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: 'Task Manager Solve — Code Review Report — Maio 2026', size: 18, color: COLORS.gray, font: 'Arial', italics: true })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/README_TaskManagerSolve.docx', buffer);
  console.log('Done!');
});