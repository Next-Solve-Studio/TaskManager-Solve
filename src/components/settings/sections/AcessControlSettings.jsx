"use client"
import { Checkbox, CircularProgress } from "@mui/material"
import { toast } from "sonner"
import { useRolePermissions } from "@/context/RolePermissionsContext"
import {ROLES} from "@/lib/roles"

const PERMISSION_ROWS = [

    { group: "Projetos", key: "canCreateProjects", label: "Criar projetos" },
    { group: "Projetos", key: "canEditProjects", label: "Editar projetos" },
    { group: "Projetos", key: "canDeleteProjects", label: "Excluir projetos" },
    { group: "Tarefas", key: "canCreateTasks", label: "Criar tarefas" },
    { group: "Tarefas", key: "canEditTasks", label: "Editar/concluir tarefas" },
    { group: "Tarefas", key: "canDeleteTasks", label: "Excluir tarefas" },
    { group: "Tarefas", key: "canViewAllUsersTasks", label: "Ver tarefas de todos os usuários"} ,
    { group: "Clientes", key: "canManageClients", label: "Criar/editar/excluir clientes" },
    { group: "Usuários", key: "canManageUsers", label: "Editar/excluir funcionários" },
    { group: "Usuários", key: "canCreateUsers", label: "Criar novos funcionários" },
    { group: "Atividades", key: "canViewActivityHistorys", label: "Ver histórico de atividades" },
    { group: "Agenda", key: "canViewAllUsersSchedule", label: "Ver e editar agenda de outros usuários" },
    { group: "Sistema", key: "canManageSystemSettings", label: "Gerenciar configurações do sistema" },
    {group: "Visualização", key: "canManageProjectCardView", label: "Personalizar Visualização de campos" },

];

const EDITABLE_ROLES = [
    {value: ROLES.ADMIN, label: "Administrador"},
    {value: ROLES.PROJECT_LEAD, label: "Líder de Projetos"},
    {value: ROLES.DEVELOPER, label: "Desenvolvedor"},
]

export default function AcessControlSettings() {
    const { permissions, loadingPermissions, updatePermission } = useRolePermissions()

    const isChecked = (key, roleValue) => permissions?.[key]?.includes(roleValue) ?? false

    const toggle = async (key, roleValue) => {
        const current = permissions?.[key] ?? []
        const next = current.includes(roleValue)
            ? current.filter((r) => r !== roleValue)
            : [...current, roleValue]
        
        try {
            await updatePermission(key, next)
        } catch (error) {
            console.error("Erro ao atualizar permissão:", error)
            toast.error(error.message || "Erro ao atualizar permissão")
        }
    }

    if (loadingPermissions) {
        return (
            <div className="py-10 flex justify-center">
                <CircularProgress size={24}/>
            </div>
        )
    }

    const groups = [...new Set(PERMISSION_ROWS.map((r) => r.group))]

    return (
        <div className="space-y-8">
            <p className="text-text-secondary text-sm">
                Controle o que cada cargo pode acessar nesta empresa. O cargo
                Master sempre tem acesso total e não aparece aqui.
            </p>

            {groups.map((group) => (
                <div key={group} className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        {group}
                    </span>
                    <div className="bg-bg-card border border-border-main rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border-main bg-bg-surface">
                                        <th className="text-left p-3 text-text-secondary font-semibold">
                                            Permissão
                                        </th>
                                        {EDITABLE_ROLES.map((r) => (
                                            <th
                                                key={r.value}
                                                className="p-3 text-text-secondary font-semibold text-center"
                                            >
                                                {r.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PERMISSION_ROWS.filter((row) => row.group === group).map((row) => (
                                        <tr key={row.key} className="border-b border-border-main last:border-0">
                                            <td className="p-3 text-text-primary">{row.label}</td>
                                            {EDITABLE_ROLES.map((r) => (
                                                <td key={r.value} className="p-3 text-center">
                                                    <Checkbox
                                                        checked={isChecked(row.key, r.value)}
                                                        onChange={() => toggle(row.key, r.value)}
                                                        sx={{
                                                            color: "var(--color-border-main)",
                                                            "&.Mui-checked": { color: "var(--color-brand-500)" },
                                                        }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}