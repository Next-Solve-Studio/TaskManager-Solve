
import { MdGroup } from 'react-icons/md';
import { ROLE_LABELS } from '@/lib/roles';
import { Avatar } from '@/components/ui/AvatarBadge';

export default function Team({users, projects }) {
    return (
        <section
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h2 className="text-base font-bold text-white">
                        Equipe
                    </h2>
                    <p className="text-xs text-font-gray2 mt-0.5">
                        {users.length} membros
                    </p>
                </div>
                <MdGroup className="text-bg-hover2 text-xl" />
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-64 pr-1 scroll-hidden">
                {users.length === 0 && (
                    <p className="text-xs text-font-gray2 text-center py-4">
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
                            className="flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-150 hover:bg-white/3"
                        >
                            <Avatar
                                name={u.name}
                                uid={u.id}
                                src={u.photo}
                                size={32}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {u.name}
                                    </p>
                                    {activeCount > 0 && (
                                        <span className="text-[10px] text-cyan-400 font-semibold shrink-0">
                                            {activeCount} ativo
                                            {activeCount > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-font-gray2 truncate mt-0.5">
                                    {ROLE_LABELS[u.role] || u.role}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
