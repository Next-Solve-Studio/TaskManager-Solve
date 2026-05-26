import { useState } from "react";
import { createPortal } from "react-dom";
import { MdFilterList, MdGroup, MdPerson } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { Avatar, avatarColor } from "@/components/ui/AvatarBadge";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import UserPickerModal from "../modals/UserPickerModal";

export default function UsersFiltersSchedule({
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
                    className={`
                        shadow-sm cursor-pointer flex items-center gap-1.5 px-3 py-1.5 
                        rounded-full text-sm font-medium transition-all duration-150
                        ${isViewingMe
                        ? "bg-green-500/15 border border-green-500/40 text-brand-500 hover:bg-brand-500/25 hover:border-brand-500/60"
                        : "bg-bg-card border border-border-main text-text-secondary hover:bg-gray-100"
                        }
                    `}
                >
                    <MdPerson size={15} />
                    Minha Agenda
                </button>

                <CanDo permission="canViewAllUsersSchedule">
                    <button
                        type="button"
                        onClick={() => setFilterUserId("all")}
                        className={`
                            shadow-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                            text-sm font-medium transition-all duration-150
                            ${isViewingAll
                            ? "bg-cyan-400/12 border border-cyan-400/35 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50"
                            : "bg-bg-card border border-border-main text-text-secondary hover:bg-gray-100"
                            }
                        `}
                    >
                        <MdGroup size={15} />
                        Todos
                    </button>
                    {isMobile ? (
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="shadow-sm flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 "
                            style={{
                                background: selectedUser
                                    ? `${avatarColor(selectedUser.id)}20`
                                    : "var(--color-bg-card)",
                                border: selectedUser
                                    ? `1px solid ${avatarColor(selectedUser.id)}60`
                                    : "1px solid var(--color-bg-surface)",
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
                                    className="shadow-sm flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                                    style={{
                                        background: selected
                                            ? `${color}20`
                                            : "var(--color-bg-card)",
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
