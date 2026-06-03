"use client";

import { CircularProgress, Menu, MenuItem, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
    MdAdminPanelSettings,
    MdCode,
    MdDelete,
    MdEdit,
    MdPeople,
    MdSupervisorAccount,
    MdAdd,
} from "react-icons/md";
import UserDeleteModal from "@/components/users/modals/UserDeleteModal";
import UserEditModal from "@/components/users/modals/UserEditModal";
import UserAddModal from "@/components/users/modals/UserAddModal";
import { useUsers } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";
import useIsTablet from "@/hooks/responsive/useIsTablet";
import { ROLES } from "@/lib/roles";
import { StatPill } from "../ui/StatPill";
import UsersCards from "./usersCards/UsersCards";
import UserFilters from "./sections/UserFilters";
import UserTable from "./sections/UserTable";
import UsersHeader from "./sections/UsersHeader";
import CanDo from "../auth/CanDo";

export default function UsersMain() {
    const { users, loadingUsers } = useUsers();
    const { currentUser } = useAuth();
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [editingUser, setEditingUser] = useState(null);
    const isTablet = useIsTablet();
    const [deletingUser, setDeletingUser] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuUser, setMenuUser] = useState(null);

    const handleOpenMenu = useCallback((event, user) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuUser(user);
    }, []);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const filtered = useMemo(() => {
        const result = users.filter((u) => {
            if (filterRole !== "all" && u.role !== filterRole) return false;
            if (search) {
                const q = search.toLowerCase();
                return (
                    u.name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
                );
            }
            return true;
        });

        if (sortKey) {
            result.sort((a,b) =>{
                let valA, valB;
                if (sortKey === "name") {
                    valA =  a.name?.toLowerCase() ?? "";
                    valB = b.name?.toLowerCase() ?? "";
                } else if (sortKey === "role") {
                    valA = a.role ?? "";
                    valB = b.role ?? "";
                } else if (sortKey === "createdAt") {
                    valA = a.createdAt ?? "";
                    valB = b.createdAt ?? "";
                } else if (sortKey  === "lastLoginAt") {
                    valA = a.lastLoginAt ?? "";
                    valB = b.lastLoginAt ?? "";
                }
                if (valA < valB) return sortDir === "asc" ? -1 : 1;
                if (valA > valB) return sortDir === "asc" ?  1 : -1;
                return  0;
            });
        }
        return result;
    }, [users, search, filterRole, sortKey, sortDir]);

    const stats = useMemo(
        () => ({
            total: users.length,
            admins: users.filter((u) => u.role === ROLES.ADMIN).length,
            leads: users.filter((u) => u.role === ROLES.PROJECT_LEAD).length,
            devs: users.filter((u) => u.role === ROLES.DEVELOPER).length,
        }),
        [users],
    );

    const handleUserList = () => {
        if (loadingUsers){
            return(
                <div className="flex items-center justify-center py-15 gap-3">
                    <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    <span className="text-text-muted text-sm">
                        Carregando usuários...
                    </span>
                </div>
            );
        }

        if (isTablet){
            return (
                <UsersCards
                    users={filtered}
                    onOpenMenu ={handleOpenMenu}
                />
            );
        }

        return (
            <UserTable
                filtered={filtered}
                sortKey={sortKey}
                sortDir={sortDir}
                handleOpenMenu={handleOpenMenu}
                handleSort={handleSort}
            />
        );
    };

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans flex flex-col">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <UsersHeader users={users}/>
                {currentUser?.role === ROLES.ADMIN && (
                    <Button
                        variant="contained"
                        startIcon={<MdAdd />}
                        onClick={() => setIsAddModalOpen(true)}
                        sx={{
                            bgcolor: "var(--color-brand-500)",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: "bold",
                            px: 3,
                            py: 1.2,
                            "&:hover": { bgcolor: "var(--color-brand-600)" }
                        }}
                    >
                        Cadastrar Usuário
                    </Button>
                )}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex flex-wrap gap-2.5">
                    <StatPill
                        icon={MdPeople}
                        label="Total"
                        value={stats.total}
                        color="#a78bfa"
                        bg="rgba(167,139,250,0.1)"
                        border="rgba(167,139,250,0.2)"
                    />
                    <StatPill
                        icon={MdAdminPanelSettings}
                        label="Admins"
                        value={stats.admins}
                        color="var(--color-brand-500)"
                        bg="var(--color-surface-green-alt)"
                        border="var(--color-surface-green-md)"
                    />
                    <StatPill
                        icon={MdSupervisorAccount}
                        label="Líderes"
                        value={stats.leads}
                        color="var(--color-cyan-400)"
                        bg="var(--color-surface-cyan-alt)"
                        border="var(--color-surface-cyan-md)"
                    />
                    <StatPill
                        icon={MdCode}
                        label="Devs"
                        value={stats.devs}
                        color="#6b7280"
                        bg="rgba(75,75,75,0.15)"
                        border="rgba(75,75,75,0.3)"
                    />
                </div>
                <CanDo permission="canCreateUsers">
                    <button
                        variant="contained"
                        onClick={() => setIsAddModalOpen(true)}
                        type="button"
                        className="
                            relative inline-flex items-center gap-1.5
                            px-4.5 h-9.5 rounded-[7px]
                            text-[13px] font-bold tracking-tight text-white text-shadow-sm
                            bg-linear-to-br from-brand-500 to-brand-600
                            overflow-hidden cursor-pointer
                            transition-all duration-150
                            hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(25, 202, 104, 0.42)]
                            active:scale-[0.97]
                            shadow-[0_2px_10px_rgba(25,202,104,0.25)]
                            max-w-50
                        "
                    >
                        Cadastrar Usuário
                    </button>
                </CanDo>
            </div>

            <UserFilters
                search={search}
                setSearch={setSearch}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
            />

            {handleUserList()}

            <UserAddModal 
                open={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />

            <UserEditModal
                open={Boolean(editingUser)}
                onClose={() => setEditingUser(null)}
                user={editingUser}
            />

            <UserDeleteModal
                open={Boolean(deletingUser)}
                onClose={() => setDeletingUser(null)}
                user={deletingUser}
            />

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                slotProps={{
                    paper: {
                        sx: {
                        background: "var(--color-bg-card)",
                        backgroundImage: "none",
                        border: "1px solid var(--color-border-main)",
                        borderRadius: "10px",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                        minWidth: 140,
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setMenuAnchorEl(null);
                        setEditingUser(menuUser);
                    }}
                    sx={{
                        color: "var(--color-text-primary)",
                        fontSize: 13,
                        gap: "8px",
                        "&:hover": { backgroundColor: "var(--color-border-subtle)" },
                    }}
                >
                <MdEdit size={15} className="text-cyan-400" /> Editar
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setMenuAnchorEl(null);
                        setDeletingUser(menuUser);
                    }}
                    sx={{
                        color: "var(--color-error)",
                        fontSize: 13,
                        gap: "8px",
                        "&:hover": { backgroundColor: "var(--color-border-subtle)" },
                    }}
                >
                <MdDelete size={15} /> Excluir
                </MenuItem>
            </Menu>
        </div>
    );
}
