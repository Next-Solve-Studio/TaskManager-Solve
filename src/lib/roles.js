//Cargos
export const ROLES = {
    ADMIN:"administrador",
    DEVELOPER:"desenvolvedor",
    PROJECT_LEAD:"lider_de_projetos"
}
//Rótulo de cargos
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.DEVELOPER]: "Desenvolvedor",
  [ROLES.PROJECT_LEAD]: "Líder de Projetos",
}
export const ROLE_COLORS = {
  [ROLES.ADMIN]:        { bg: "bg-brand-500/15",   text: "text-brand-400",   border: "border-brand-500/30"   },
  [ROLES.PROJECT_LEAD]: { bg: "bg-cyan-500/15",    text: "text-cyan-400",    border: "border-cyan-500/30"    },
  [ROLES.DEVELOPER]:    { bg: "bg-bg-hover/60",    text: "text-bg-hover2",   border: "border-bg-hover/60"    },
}
/**
 * Mapa de permissões → quais cargos têm acesso.
 * Para adicionar uma nova regra, basta incluir aqui.
 * Os componentes/hooks lêem daqui — zero duplicação.
 */

export const PERMISSIONS = {
  // Usuárioscan Assign TaskscanEditProjects
  canManageUsers:    [ROLES.ADMIN],
  canViewUsers:      [ROLES.ADMIN, ROLES.PROJECT_LEAD],

  // Tarefas
  canCreateTasks:    [ROLES.ADMIN, ROLES.PROJECT_LEAD],
  canAssignTasks:    [ROLES.ADMIN, ROLES.PROJECT_LEAD],
  canDeleteTasks:    [ROLES.ADMIN],
  canViewAllTasks:   [ROLES.ADMIN, ROLES.PROJECT_LEAD],
  canCompleteTasks:  [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.PROJECT_LEAD],

  // Projetos
  canCreateProjects: [ROLES.ADMIN, ROLES.PROJECT_LEAD],
  canEditProjects:   [ROLES.ADMIN, ROLES.PROJECT_LEAD],
  canDeleteProjects: [ROLES.ADMIN],
  canViewReports:    [ROLES.ADMIN, ROLES.PROJECT_LEAD],
}