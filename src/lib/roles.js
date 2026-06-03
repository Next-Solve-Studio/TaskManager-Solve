import {
    MdAdminPanelSettings,
    MdCode,
    MdSupervisorAccount,
    MdStars,
} from "react-icons/md";

//Cargos
export const ROLES = {
    ADMIN: "administrador",
    DEVELOPER: "desenvolvedor",
    PROJECT_LEAD: "lider_de_projetos",
    MASTER: "master"
};
//Rótulo de cargos
export const ROLE_LABELS = {
    [ROLES.ADMIN]: "Administrador",
    [ROLES.DEVELOPER]: "Desenvolvedor",
    [ROLES.PROJECT_LEAD]: "Líder de Projetos",
    [ROLES.MASTER]: "Master",
};

export const ROLES_STYLES = {
    [ROLES.MASTER]: {
        icon: MdStars,
        color: "text-orange-400",
        bg: "bg-orange-500/15",
        border: "border-orange-500/30",
        description:
            "Dono da empresa. Acesso total ao sistema, faturamento e configurações da empresa.",
    },
    [ROLES.ADMIN]: {
        icon: MdAdminPanelSettings,
        color: "text-brand-400",
        bg: "bg-brand-500/15",
        border: "border-brand-500/30",
        description:
            "Acesso total ao sistema, pode gerenciar usuários e projetos.",
    },
    [ROLES.PROJECT_LEAD]: {
        icon: MdSupervisorAccount,
        color: "text-cyan-400",
        bg: "bg-cyan-400/15",
        border: "border-cyan-400/30",
        description:
            "Pode criar e editar projetos, atribuir tarefas e ver relatórios.",
    },
    [ROLES.DEVELOPER]: {
        icon: MdCode,
        color: "text-purple-500",
        bg: "bg-purple-500/15",
        border: "border-purple-500/30",
        description: "Pode visualizar projetos e completar tarefas atribuídas.",
    },
};
/**
 * Mapa de permissões → quais cargos têm acesso.
 * Para adicionar uma nova regra, basta incluir aqui.
 * Os componentes/hooks lêem daqui — zero duplicação.
 */

export const PERMISSIONS = {
    // Usuários
    canManageUsers: [ROLES.MASTER, ROLES.ADMIN],
    canViewUsers: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Histórico de Atividades
    canViewActivityHistorys: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Projetos
    canCreateProjects: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canEditProjects: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canDeleteProjects: [ROLES.MASTER, ROLES.ADMIN],
    canViewReports: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Clientes
    canManageClients: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canViewClients: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Configurações (Apenas Master e Admin)
    canManageSystemSettings: [ROLES.MASTER, ROLES.ADMIN],
    
    // Financeiro
    canViewFinancials: [ROLES.MASTER, ROLES.ADMIN],

    // Agenda
    canViewAllUsersSchedule: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Tarefas
    canCreateTasks: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canEditTasks: [ROLES.MASTER, ROLES.ADMIN, ROLES.DEVELOPER, ROLES.PROJECT_LEAD],
    canCompleteTasks: [ROLES.MASTER, ROLES.ADMIN, ROLES.DEVELOPER, ROLES.PROJECT_LEAD],
    canDeleteTasks: [ROLES.MASTER, ROLES.ADMIN, ROLES.PROJECT_LEAD],
};
