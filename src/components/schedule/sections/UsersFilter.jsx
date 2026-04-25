import { useState } from "react";
import { createPortal } from "react-dom";
import { MdFilterList, MdGroup, MdPerson } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { Avatar, avatarColor } from "@/components/ui/AvatarBadge";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import UserPickerModal from "../modals/UserPickerModal";

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

    const otherUsers = loadingUsers
        ? []
        : users.filter((u) => u.id !== currentUser?.uid);

    // usuário selecionado atualmente (se for um dev específico)
    const selectedUser =
        !isViewingMe && !isViewingAll
            ? otherUsers.find((u) => u.id === filterUserId)
            : null;

    function handleSelectUser(id) {
        setFilterUserId(id);
        setModalOpen(false);
    }

    return (
        <>
            <div className="flex items-center gap-2 flex-wrap">
                <MdFilterList size={16} className="text-text-muted" />
                <button
                    type="button"
                    onClick={() => setFilterUserId("me")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                    style={{
                        background: isViewingMe
                            ? "rgba(25,202,104,0.15)"
                            : "var(--color-bg-surface)",
                        border: isViewingMe
                            ? "1px solid rgba(25,202,104,0.4)"
                            : "1px solid var(--color-border-main)",
                        color: isViewingMe
                            ? "#19CA68"
                            : "var(--color-text-secondary)",
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
                            background: isViewingAll
                                ? "rgba(34,211,238,0.12)"
                                : "var(--color-bg-surface)",
                            border: isViewingAll
                                ? "1px solid rgba(34,211,238,0.35)"
                                : "1px solid var(--color-border-main)",
                            color: isViewingAll
                                ? "#22d3ee"
                                : "var(--color-text-secondary)",
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
                                background: selectedUser
                                    ? `${avatarColor(selectedUser.id)}20`
                                    : "var(--color-bg-surface)",
                                border: selectedUser
                                    ? `1px solid ${avatarColor(selectedUser.id)}60`
                                    : "1px solid var(--color-border-main)",
                                color: selectedUser
                                    ? avatarColor(selectedUser.id)
                                    : "var(--color-text-secondary)",
                            }}
                        >
                            {selectedUser ? (
                                <>
                                    <Avatar
                                        name={selectedUser.name}
                                        uid={selectedUser.id}
                                        src={selectedUser.photo}
                                        size={18}
                                    />
                                    <span>
                                        {selectedUser.name.split(" ")[0]}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <MdGroup size={15} />
                                    <span>Devs…</span>
                                </>
                            )}
                        </button>
                    ) : (
                        !loadingUsers &&
                        otherUsers.map((u) => {
                            const selected = filterUserId === u.id;
                            const color = avatarColor(u.id);
                            return (
                                <button
                                    key={u.id}
                                    type="button"
                                    onClick={() =>
                                        setFilterUserId(
                                            filterUserId === u.id ? "me" : u.id,
                                        )
                                    }
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                                    style={{
                                        background: selected
                                            ? `${color}20`
                                            : "var(--color-bg-surface)",
                                        border: selected
                                            ? `1px solid ${color}60`
                                            : "1px solid var(--color-border-main)",
                                        color: selected
                                            ? color
                                            : "var(--color-text-secondary)",
                                    }}
                                >
                                    <Avatar
                                        name={u.name}
                                        uid={u.id}
                                        src={u.photo}
                                    />
                                    <span>{u.name.split(" ")[0]}</span>
                                </button>
                            );
                        })
                    )}
                </CanDo>
            </div>

            {isMobile &&
                modalOpen &&
                createPortal(
                    <UserPickerModal
                        users={otherUsers}
                        filterUserId={filterUserId}
                        onSelect={handleSelectUser}
                        onClose={() => setModalOpen(false)}
                    />,
                    document.body,
                )}
        </>
    );
}
