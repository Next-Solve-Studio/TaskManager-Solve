"use client";

import { CircularProgress } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import {
    MdAdminPanelSettings,
    MdCode,
    MdPeople,
    MdSearch,
    MdSupervisorAccount,
} from "react-icons/md";
import UserDeleteModal from "@/components/users/modals/UserDeleteModal";
import UserEditModal from "@/components/users/modals/UserEditModal";
import { useUsers } from "@/context/UsersContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import { StatPill } from "../ui/StatPill";
import UserRow from "./UserRow";
import UsersCards from "./usersCards/UsersCards";

export default function UsersMain() {
    const { users, loading } = useUsers();
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [editingUser, setEditingUser] = useState(null);
    const isMobile = useIsMobile();
    const [deletingUser, setDeletingUser] = useState(null);

    const handleOpenEdit = useCallback((user) => setEditingUser(user), []);
    const handleOpenDelete = useCallback((user) => setDeletingUser(user), []);

    const filtered = useMemo(() => {
        return users.filter((u) => {
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
    }, [users, search, filterRole]);

    const stats = useMemo(
        () => ({
            total: users.length,
            admins: users.filter((u) => u.role === ROLES.ADMIN).length,
            leads: users.filter((u) => u.role === ROLES.PROJECT_LEAD).length,
            devs: users.filter((u) => u.role === ROLES.DEVELOPER).length,
        }),
        [users],
    );

    const hasFilters = search || filterRole !== "all";
    const clearFilters = () => {
        setSearch("");
        setFilterRole("all");
    };

    const roleFilters = [
        { value: "all", label: "Todos" },
        { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
        { value: ROLES.PROJECT_LEAD, label: ROLE_LABELS[ROLES.PROJECT_LEAD] },
        { value: ROLES.DEVELOPER, label: ROLE_LABELS[ROLES.DEVELOPER] },
    ];

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans flex flex-col">
            {/* ── Header ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                }}
                className="mb-5"
            >
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                        }}
                    >
                        <MdPeople
                            style={{
                                color: "var(--color-brand-500)",
                                fontSize: 18,
                            }}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                            Gestão de Usuários
                        </span>
                    </div>
                    <h1 className="text-[26px] font-extrabold text-text-primary mt-2">
                        Usuários
                    </h1>
                    <p className="text-[13px] text-text-muted mt-1">
                        {users.length} usuário{users.length !== 1 ? "s" : ""}{" "}
                        cadastrado
                        {users.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
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

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-2.5 p-3.5 bg-bg-card border border-border-main rounded-[14px] items-center">
                <div
                    style={{
                        position: "relative",
                        flex: "1 1 200px",
                        minWidth: 180,
                    }}
                >
                    <MdSearch
                        size={16}
                        style={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--color-text-muted)",
                        }}
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou e-mail..."
                        className="w-full bg-bg-surface border border-border-main rounded-lg p-[7px_10px_7px_32px] outline-none text-text-primary text-[13px] focus:border-brand-500 transition-colors"
                    />
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {roleFilters.map((rf) => {
                        const active = filterRole === rf.value;
                        return (
                            <button
                                key={rf.value}
                                type="button"
                                onClick={() => setFilterRole(rf.value)}
                                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer"
                                style={{
                                    background: active
                                        ? "rgba(25,202,104,0.15)"
                                        : "var(--color-bg-surface)",
                                    border: active
                                        ? "1px solid rgba(25,202,104,0.35)"
                                        : "1px solid var(--color-border-main)",
                                    color: active
                                        ? "var(--color-brand-500)"
                                        : "var(--color-text-muted)",
                                }}
                            >
                                {rf.label}
                            </button>
                        );
                    })}
                </div>

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        type="button"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            borderRadius: 8,
                            color: "#ef4444",
                            padding: "6px 8px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        <AiOutlineClear className="text-xl" />
                    </button>
                )}
            </div>

            {/* ── Lista ── */}
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "60px 0",
                        gap: 12,
                    }}
                >
                    <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    <span style={{ color: "#6b7280", fontSize: 14 }}>
                        Carregando usuários... <br />
                        {users.length === 0
                            ? "Nenhum usuário cadastrado ainda"
                            : "Nenhum usuário encontrado"}
                    </span>
                </div>
            ) : isMobile ? (
                <UsersCards
                    users={filtered}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            ) : (
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    {/* Cabeçalho */}
                    <div className="grid grid-cols-[48px_1fr_160px_100px_100px_72px] gap-4 px-5 mb-2">
                        {/* Espaço vazio para alinhar com o Avatar */}
                        <div></div> 
                        
                        <div>
                            <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                                Usuário
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                                Cargo
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                                Acesso
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                                Entrada
                            </p>
                        </div>
                        {/* Alinhado à direita para bater com o flex-end dos botões */}
                        <div className="text-center">
                            <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                                Ações
                            </p>
                        </div>
                    </div>

                    {/* Lista de Usuários */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {filtered.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                onEdit={handleOpenEdit}
                                onDelete={handleOpenDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

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
        </div>
    );
}
