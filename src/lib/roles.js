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

/**
 * Mapa de permissões → quais cargos têm acesso.
 * Para adicionar uma nova regra, basta incluir aqui.
 * Os componentes/hooks lêem daqui — zero duplicação.
 */

export const PERMISSIONS = {
  // Usuários
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
  canDeleteProjects: [ROLES.ADMIN],
  canViewReports:    [ROLES.ADMIN, ROLES.PROJECT_LEAD],
}