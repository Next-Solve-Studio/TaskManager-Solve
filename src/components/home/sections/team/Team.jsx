import { MdGroup } from "react-icons/md";
import { Avatar } from "@/components/ui/AvatarBadge";
import { DashboardHeader } from "@/components/ui/DashboardHeader/DashboardHeader";
import { ROLE_LABELS } from "@/lib/roles";

export default function Team({ users, projects }) {
    return (
        <section
            className="p-5 rounded-2xl flex flex-col gap-3 bg-bg-card border border-border-main"
                style={{
                    boxShadow: `
                        inset 0 0 40px rgba(0,0,0,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.06),
                        0 0 10px rgba(34,211,238,0.07),
                        0 4px 20px rgba(0,0,0,0.06)
                    `
                }}
        >
            <DashboardHeader
                title="Equipe"
                subtitle={`${users.length} membros`}
                icon={MdGroup}
                iconColor="#19ca68"
            />

            <div className="flex flex-col gap-2 overflow-y-auto max-h-64 pr-1 scroll-hidden">
                {users.length === 0 && (
                    <p className="text-xs text-text-secondary text-center py-4">
                        Nenhum membro encontrado
                    </p>
                )}
                {users.map((u) => {
                    const activeCount = projects.filter(
                        (p) =>
                            p.status === "em_andamento" &&
                            p.developers?.includes(u.id),
                    ).length;
                    return (
                        <div
                            key={u.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-150 hover:bg-bg-side"
                        >
                            <Avatar
                                name={u.name}
                                uid={u.id}
                                src={u.photo}
                                size={32}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-text-primary truncate">
                                        {u.name}
                                    </p>
                                    {activeCount > 0 && (
                                        <span className="text-[10px] text-cyan-400 font-semibold shrink-0">
                                            {activeCount} ativo
                                            {activeCount > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-text-muted truncate mt-0.5">
                                    {ROLE_LABELS[u.role] || u.role}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
