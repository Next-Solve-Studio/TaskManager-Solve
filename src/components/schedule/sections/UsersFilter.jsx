import { useState } from "react";
import { createPortal } from "react-dom";
import { MdFilterList, MdGroup, MdPerson, MdClose, MdCheck } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { Avatar, avatarColor } from "@/components/ui/AvatarBadge";
import { ROLE_LABELS } from "@/lib/roles";
import useIsMobile from "@/responsive/useIsMobile";

export default function UsersFilter({
    users,
    isViewingAll,
    isViewingMe,
    filterUserId,
    setFilterUserId,
    loadingUsers,
    currentUser,
}) {
    const isMobile = useIsMobile();
    const [modalOpen, setModalOpen] = useState(false);

    const otherUsers = loadingUsers ? [] : users.filter((u) => u.id !== currentUser?.uid);

    // usuário selecionado atualmente (se for um dev específico)
    const selectedUser = !isViewingMe && !isViewingAll
        ? otherUsers.find((u) => u.id === filterUserId)
        : null;

    function handleSelectUser(id) {
        setFilterUserId(id);
        setModalOpen(false);
    }

    return (
        <>
            <div className="flex items-center gap-2 flex-wrap">
                <MdFilterList size={16} style={{ color: "#4b5563" }} />
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
                    {isMobile ? (
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                            style={{
                                background: selectedUser ? `${avatarColor(selectedUser.id)}20` : "rgba(255,255,255,0.04)",
                                border: selectedUser ? `1px solid ${avatarColor(selectedUser.id)}60` : "1px solid rgba(255,255,255,0.08)",
                                color: selectedUser ? avatarColor(selectedUser.id) : "#9ca3af",
                            }}
                        >
                            {selectedUser ? (
                                <>
                                    <Avatar name={selectedUser.name} uid={selectedUser.id} src={selectedUser.photo} size={18} />
                                    <span>{selectedUser.name.split(" ")[0]}</span>
                                </>
                            ) : (
                                <>
                                    <MdGroup size={15} />
                                    <span>Devs…</span>
                                </>
                            )}
                        </button>
                    ) : (
                        !loadingUsers && otherUsers.map((u) => {
                            const selected = filterUserId === u.id;
                            const color = avatarColor(u.id);
                            return (
                                <button
                                    key={u.id}
                                    type="button"
                                    onClick={() => setFilterUserId(filterUserId === u.id ? "me" : u.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                                    style={{
                                        background: selected ? `${color}20` : "rgba(255,255,255,0.04)",
                                        border: selected ? `1px solid ${color}60` : "1px solid rgba(255,255,255,0.08)",
                                        color: selected ? color : "#9ca3af",
                                    }}
                                >
                                    <Avatar name={u.name} uid={u.id} src={u.photo} />
                                    <span>{u.name.split(" ")[0]}</span>
                                </button>
                            );
                        })
                    )}
                </CanDo>
            </div>

            {isMobile && modalOpen && createPortal(
                <UserPickerModal
                    users={otherUsers}
                    filterUserId={filterUserId}
                    onSelect={handleSelectUser}
                    onClose={() => setModalOpen(false)}
                />,
                document.body
            )}
        </>
    );
}

function UserPickerModal({ users, filterUserId, onSelect, onClose }) {
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