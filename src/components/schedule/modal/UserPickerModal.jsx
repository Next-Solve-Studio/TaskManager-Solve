import { Avatar, avatarColor } from "@/components/ui/AvatarBadge";
import { ROLE_LABELS } from "@/lib/roles";
import { MdClose, MdCheck } from "react-icons/md";

export default function UserPickerModal({ users, filterUserId, onSelect, onClose }) {
    return (
        /* overlay */
        <div
            role="none"
            className="fixed inset-0 z-50 flex flex-col justify-center"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                role="none"
                className="rounded-3xl p-5 space-y-4 mx-2"
                style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* handle + cabeçalho */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-white font-semibold text-base">Ver agenda de</p>
                        <p className="text-xs text-font-gray2">Selecione um desenvolvedor</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                        <MdClose size={16} style={{ color: "#9ca3af" }} />
                    </button>
                </div>

                {/* lista de usuários */}
                <div className="flex flex-col gap-1">
                    {users.map((u) => {
                        const selected = filterUserId === u.id;
                        const color = avatarColor(u.id);
                        return (
                            <button
                                key={u.id}
                                type="button"
                                onClick={() => onSelect(u.id)}
                                className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-left transition-all duration-150"
                                style={{
                                    background: selected ? `${color}15` : "transparent",
                                    border: selected ? `1px solid ${color}35` : "1px solid transparent",
                                }}
                            >
                                <Avatar name={u.name} uid={u.id} src={u.photo} size={38} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {u.name}
                                    </p>
                                    <p className="text-xs truncate" style={{ color: selected ? color : "#6b7280" }}>
                                        {ROLE_LABELS[u.role] || u.role}
                                    </p>
                                </div>
                                {selected && (
                                    <MdCheck size={18} style={{ color, flexShrink: 0 }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}