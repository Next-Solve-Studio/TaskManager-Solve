import {
    MdAdminPanelSettings,
    MdCode,
    MdSupervisorAccount,
} from "react-icons/md";

//Cargos
export const ROLES = {
    ADMIN: "administrador",
    DEVELOPER: "desenvolvedor",
    PROJECT_LEAD: "lider_de_projetos",
};
//Rótulo de cargos
export const ROLE_LABELS = {
    [ROLES.ADMIN]: "Administrador",
    [ROLES.DEVELOPER]: "Desenvolvedor",
    [ROLES.PROJECT_LEAD]: "Líder de Projetos",
};

export const ROLES_STYLES = {
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
    // Usuárioscan Assign TaskscanEditProjects
    canManageUsers: [ROLES.ADMIN],
    canViewUsers: [ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Tarefas
    canCreateTasks: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canAssignTasks: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canDeleteTasks: [ROLES.ADMIN],
    canViewAllTasks: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canCompleteTasks: [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.PROJECT_LEAD],

    // Projetos
    canCreateProjects: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canEditProjects: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canDeleteProjects: [ROLES.ADMIN],
    canViewReports: [ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Clientes
    canManageClients: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
    canViewClients: [ROLES.ADMIN, ROLES.PROJECT_LEAD],

    // Configurações
    canManageSystemSettings: [ROLES.ADMIN],
};
