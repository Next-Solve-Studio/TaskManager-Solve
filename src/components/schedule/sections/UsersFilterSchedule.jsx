import { useState } from "react";
import { createPortal } from "react-dom";
import {MdGroup, MdPerson } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { Avatar, avatarColor } from "@/components/ui/AvatarBadge";
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
                <button
                    type="button"
                    onClick={() => setFilterUserId("me")}
                    className={`
                        shadow-sm cursor-pointer flex items-center gap-1.5 px-3 py-1.5 
                        rounded-full text-sm font-medium transition-all duration-150
                        ${isViewingMe
                        ? "bg-green-500/15 border border-green-500/40 text-brand-500 hover:bg-brand-500/25 hover:border-brand-500/60"
                        : "bg-bg-card border border-border-main text-text-secondary hover:bg-bg-card/50"
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
                            shadow-sm cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                            text-sm font-medium transition-all duration-150
                            ${isViewingAll
                            ? "bg-cyan-400/12 border border-cyan-400/35 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50"
                            : "bg-bg-card border border-border-main text-text-secondary hover:bg-bg-card/50"
                            }
                        `}
                    >
                        <MdGroup size={15} />
                        Todos
                    </button>
     
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className={`
                                shadow-sm flex items-center gap-2 px-3 py-1.5 cursor-pointer 
                                rounded-full text-sm font-medium transition-all duration-150 
                                bg-(--btn-bg) border-(--btn-border) text-(--btn-color)
                                hover:bg-(--btn-hover)
                            `}
                        style={{
                            '--btn-bg': selectedUser ? `${avatarColor(selectedUser.id)}20` : 'var(--color-bg-card)',
                            '--btn-border': selectedUser ? `1px solid ${avatarColor(selectedUser.id)}60` : '1px solid var(--color-bg-surface)',
                            '--btn-color': selectedUser ? avatarColor(selectedUser.id) : 'var(--color-text-secondary)',
                            '--btn-hover': selectedUser ? `${avatarColor(selectedUser.id)}40` : 'color-mix(in srgb, var(--color-bg-card) 50%, transparent)'
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
                    
                </CanDo>
            </div>

            {
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
