import CanDo from "@/components/auth/CanDo";
import { Avatar, avatarColor } from "@/utils/AvatarBadge"
import { MdFilterList, MdGroup, MdPerson } from "react-icons/md";

export default function UsersFilter({ users, isViewingAll,isViewingMe, filterUserId, setFilterUserId, loadingUsers, currentUser }) {

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <MdFilterList size={16} style={{ color: "#4b5563" }} />

            {/* Botão: Minha agenda */}
            <button
                type="button"
                onClick={() => setFilterUserId("me")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                style={{
                    background: isViewingMe ? "rgba(25,202,104,0.15)" : "rgba(255,255,255,0.04)",
                    border: isViewingMe ? "1px solid rgba(25,202,104,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    color: isViewingMe ? "#19CA68" : "#9ca3af",
                }}
            >
                <MdPerson size={15} />
                Minha Agenda
            </button>
            <CanDo permission="canViewAllUsersSchedule">
                {/* Botão: Todos */}
                <button
                    type="button"
                    onClick={() => setFilterUserId("all")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                    style={{
                        background: isViewingAll ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)",
                        border: isViewingAll ? "1px solid rgba(34,211,238,0.35)" : "1px solid rgba(255,255,255,0.08)",
                        color: isViewingAll ? "#22d3ee" : "#9ca3af",
                    }}
                >
                    <MdGroup size={15} />
                    Todos
                </button>

                {/* Chips de usuários individualmente */}
            
                {!loadingUsers && users
                    .filter((u) => u.id !== currentUser?.uid)
                    .map((u) => {
                        const selected = filterUserId === u.id;
                        const color = avatarColor(u.id);

                        return (
                            <button
                                key={u.id}
                                user={u}
                                selected={filterUserId === u.id}
                                onClick={() =>
                                    setFilterUserId(
                                        filterUserId === u.id ? "me" : u.id,
                                    )
                                }
                                type="button"

                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                                style={{
                                    background: selected ? `${color}20` : "rgba(255,255,255,0.04)",
                                    border: selected
                                        ? `1px solid ${color}60`
                                        : "1px solid rgba(255,255,255,0.08)",
                                    color: selected ? color : "#9ca3af",
                                }}
                            >
                                <Avatar name={u.name} uid={u.id} />
                                <span>{u.name.split(" ")[0]}</span>
                            </button>
                        )
                    })
                }
            </CanDo>
        </div>
    );
}
