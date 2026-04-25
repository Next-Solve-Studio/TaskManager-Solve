import { MdCheck, MdClose } from "react-icons/md";
import { Avatar, avatarColor } from "@/components/ui/AvatarBadge";
import { ROLE_LABELS } from "@/lib/roles";

export default function UserPickerModal({
    users,
    filterUserId,
    onSelect,
    onClose,
}) {
    return (
        /* overlay */
        <div
            role="none"
            className="fixed inset-0 z-50 flex flex-col justify-center"
            style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
        >
            <div
                role="none"
                className="rounded-3xl p-5 space-y-4 mx-2 bg-bg-card border border-border-main shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* handle + cabeçalho */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-text-primary font-semibold text-base">
                            Ver agenda de
                        </p>
                        <p className="text-xs text-text-secondary">
                            Selecione um desenvolvedor
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors bg-bg-surface text-text-muted"
                    >
                        <MdClose size={16} />
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
                                    background: selected
                                        ? `${color}15`
                                        : "transparent",
                                    border: selected
                                        ? `1px solid ${color}35`
                                        : "1px solid transparent",
                                }}
                            >
                                <Avatar
                                    name={u.name}
                                    uid={u.id}
                                    src={u.photo}
                                    size={38}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text-primary truncate">
                                        {u.name}
                                    </p>
                                    <p
                                        className="text-xs truncate"
                                        style={{
                                            color: selected
                                                ? color
                                                : "var(--color-text-muted)",
                                        }}
                                    >
                                        {ROLE_LABELS[u.role] || u.role}
                                    </p>
                                </div>
                                {selected && (
                                    <MdCheck
                                        size={18}
                                        style={{ color, flexShrink: 0 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
