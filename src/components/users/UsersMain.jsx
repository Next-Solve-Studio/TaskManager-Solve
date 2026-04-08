'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { MdSearch, MdPeople, MdAdminPanelSettings, MdCode, MdSupervisorAccount, MdEdit, MdDelete } from 'react-icons/md'
import { AiOutlineClear } from 'react-icons/ai'
import RoleBadge from '@/components/auth/RoleBadge'
import { ROLES, ROLE_LABELS } from '@/lib/roles'
import { CircularProgress } from '@mui/material'
import { toast } from 'sonner'
import CanDo from '@/components/auth/CanDo'
import UserEditModal from '@/components/users/modals/UserEditModal'
import UserDeleteModal from '@/components/users/modals/UserDeleteModal'

// ── Avatar ──────────────────────────────────────────────────────────────────
function UserAvatar({ name, size = 40 }) {
    const initials = name
        ?.split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase() ?? '?'

    const colors = [
        { bg: 'rgba(25,202,104,0.15)',  text: '#19CA68', border: 'rgba(25,202,104,0.3)'  },
        { bg: 'rgba(34,211,238,0.15)',  text: '#22d3ee', border: 'rgba(34,211,238,0.3)'  },
        { bg: 'rgba(168,85,247,0.15)',  text: '#a855f7', border: 'rgba(168,85,247,0.3)'  },
        { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b', border: 'rgba(245,158,11,0.3)'  },
        { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444', border: 'rgba(239,68,68,0.3)'   },
    ]
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length]

    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: color.bg, border: `1.5px solid ${color.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.36, fontWeight: 700, color: color.text,
            flexShrink: 0, letterSpacing: '0.03em',
        }}>
            {initials}
        </div>
    )
}

// ── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color, bg, border }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 24,
            background: bg, border: `1px solid ${border}`,
            fontSize: 13, userSelect: 'none',
        }}>
            <Icon style={{ color, fontSize: 15 }} />
            <span style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>{label}</span>
        </div>
    )
}

// ── User Card ────────────────────────────────────────────────────────────────
function UserCard({ user, onEdit, onDelete }) {
    const formattedDate = useMemo(() => {
        if (!user.createdAt) return null
        const date = user.createdAt?.toDate?.() ?? new Date(user.createdAt)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    }, [user.createdAt])

    const authLabel = user.authMethod === 'google' ? 'Google' : 'E-mail'
    const authColor = user.authMethod === 'google' ? '#ea4335' : '#22d3ee'
    const authBg    = user.authMethod === 'google' ? 'rgba(234,67,53,0.1)' : 'rgba(34,211,238,0.1)'

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: <>
<div
            style={{
                background: '#121212',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 14,
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '44px 1fr 140px 90px 90px auto',
                gap: 16,
                alignItems: 'center',
                transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(25,202,104,0.2)'
                e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
            }}
        >
            {/* Avatar */}
            <UserAvatar name={user.name} size={44} />

            {/* Nome + Email */}
            <div style={{ minWidth: 0 }}>
                <p style={{
                    color: '#f1f5f9', fontWeight: 700, fontSize: 14,
                    margin: 0, marginBottom: 3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {user.name}
                </p>
                <p style={{
                    color: '#6b7280', fontSize: 12, margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {user.email}
                </p>
            </div>

            {/* Cargo */}
            <div>
                <RoleBadge role={user.role} />
            </div>

            {/* Auth method */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 6,
                background: authBg, fontSize: 11, fontWeight: 600,
                color: authColor,
            }}>
                {authLabel}
            </div>

            {/* Data de entrada */}
            {formattedDate && (
                <p style={{ fontSize: 11, color: '#4b4b4b', margin: 0 }}>
                    {formattedDate}
                </p>
            )}

            {/* Ações */}
            <CanDo permission="canManageUsers">
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Editar cargo"
                        style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: 'rgba(34,211,238,0.07)',
                            border: '1px solid rgba(34,211,238,0.15)',
                            color: '#22d3ee', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(34,211,238,0.15)'
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.35)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(34,211,238,0.07)'
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.15)'
                        }}
                    >
                        <MdEdit size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(user)}
                        title="Excluir usuário"
                        style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: 'rgba(239,68,68,0.07)',
                            border: '1px solid rgba(239,68,68,0.15)',
                            color: '#ef4444', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.07)'
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'
                        }}
                    >
                        <MdDelete size={14} />
                    </button>
                </div>
            </CanDo>
        </div>
    )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function UsersMain() {
    const [users, setUsers]     = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch]   = useState('')
    const [filterRole, setFilterRole] = useState('all')

    // Modais
    const [editingUser, setEditingUser]     = useState(null)
    const [deletingUser, setDeletingUser]   = useState(null)
    const [deleting, setDeleting]           = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'users'))
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
                setUsers(data)
            } catch (err) {
                console.error('Erro ao buscar usuários:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleOpenEdit   = useCallback((user) => setEditingUser(user), [])
    const handleOpenDelete = useCallback((user) => setDeletingUser(user), [])

    // Atualiza cargo localmente após salvar
    const handleUserUpdated = useCallback((userId, newRole) => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
    }, [])

    // Exclui usuário do Firestore e do estado local
    const handleConfirmDelete = async () => {
        if (!deletingUser) return
        setDeleting(true)
        try {
            await deleteDoc(doc(db, 'users', deletingUser.id))
            setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id))
            toast.success('Usuário excluído!')
            setDeletingUser(null)
        } catch (err) {
            console.error(err)
            toast.error('Erro ao excluir usuário')
        } finally {
            setDeleting(false)
        }
    }

    const filtered = useMemo(() => {
        return users.filter((u) => {
            if (filterRole !== 'all' && u.role !== filterRole) return false
            if (search) {
                const q = search.toLowerCase()
                return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
            }
            return true
        })
    }, [users, search, filterRole])

    const stats = useMemo(() => ({
        total:  users.length,
        admins: users.filter((u) => u.role === ROLES.ADMIN).length,
        leads:  users.filter((u) => u.role === ROLES.PROJECT_LEAD).length,
        devs:   users.filter((u) => u.role === ROLES.DEVELOPER).length,
    }), [users])

    const hasFilters = search || filterRole !== 'all'
    const clearFilters = () => { setSearch(''); setFilterRole('all') }

    const roleFilters = [
        { value: 'all',               label: 'Todos' },
        { value: ROLES.ADMIN,         label: ROLE_LABELS[ROLES.ADMIN] },
        { value: ROLES.PROJECT_LEAD,  label: ROLE_LABELS[ROLES.PROJECT_LEAD] },
        { value: ROLES.DEVELOPER,     label: ROLE_LABELS[ROLES.DEVELOPER] },
    ]

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-background-page)',
            color: '#fff',
            paddingTop: 24,
            paddingBottom: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
        }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <MdPeople style={{ color: '#19CA68', fontSize: 18 }} />
                        <span style={{
                            fontSize: 11, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4b4b4b',
                        }}>
                            Gestão de Usuários
                        </span>
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>Usuários</h1>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                        {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <StatPill icon={MdPeople}            label="Total"    value={stats.total}  color="#a78bfa" bg="rgba(167,139,250,0.1)"           border="rgba(167,139,250,0.2)" />
                <StatPill icon={MdAdminPanelSettings} label="Admins"  value={stats.admins} color="var(--color-brand-500)" bg="var(--color-surface-green-alt)" border="var(--color-surface-green-md)" />
                <StatPill icon={MdSupervisorAccount}  label="Líderes" value={stats.leads}  color="var(--color-cyan-400)"  bg="var(--color-surface-cyan-alt)"  border="var(--color-surface-cyan-md)" />
                <StatPill icon={MdCode}               label="Devs"    value={stats.devs}   color="#6b7280" bg="rgba(75,75,75,0.15)"              border="rgba(75,75,75,0.3)" />
            </div>

            {/* ── Filters ── */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 10,
                padding: '14px 16px',
                background: '#121212',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, alignItems: 'center',
            }}>
                {/* Busca */}
                <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
                    <MdSearch size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou e-mail..."
                        style={{
                            width: '100%', background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                            color: '#e5e7eb', padding: '7px 10px 7px 32px',
                            fontSize: 13, outline: 'none', boxSizing: 'border-box',
                        }}
                    />
                </div>

                {/* Filtro de cargo */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {roleFilters.map((rf) => {
                        const active = filterRole === rf.value
                        return (
                            <button
                                key={rf.value}
                                type="button"
                                onClick={() => setFilterRole(rf.value)}
                                style={{
                                    padding: '5px 14px', borderRadius: 20,
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    background: active ? 'rgba(25,202,104,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: active ? '1px solid rgba(25,202,104,0.35)' : '1px solid rgba(255,255,255,0.08)',
                                    color: active ? '#19CA68' : '#6b7280',
                                }}
                            >
                                {rf.label}
                            </button>
                        )
                    })}
                </div>

                {/* Limpar */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        type="button"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 8, color: '#ef4444', padding: '6px 8px',
                            cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        }}
                    >
                        <AiOutlineClear className="text-xl" />
                    </button>
                )}
            </div>

            {/* ── Lista ── */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
                    <CircularProgress size={24} style={{ color: '#19CA68' }} />
                    <span style={{ color: '#6b7280', fontSize: 14 }}>Carregando usuários...</span>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '60px 0', gap: 12, background: '#121212',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
                }}>
                    <MdPeople style={{ fontSize: 44, color: '#2D2D2D' }} />
                    <p style={{ color: '#4b4b4b', fontSize: 14, fontWeight: 600 }}>
                        {users.length === 0 ? 'Nenhum usuário cadastrado ainda' : 'Nenhum usuário encontrado'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Cabeçalho */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '44px 1fr 140px 90px 90px auto',
                        gap: 16, padding: '6px 20px',
                        fontSize: 11, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: '#4b4b4b', userSelect: 'none',
                    }}>
                        <span />
                        <span>Usuário</span>
                        <span>Cargo</span>
                        <span>Acesso</span>
                        <span>Entrada</span>
                        <span />
                    </div>

                    {filtered.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                        />
                    ))}
                </div>
            )}

            {/* ── Modais ── */}
            {/* <UserEditModal
                open={Boolean(editingUser)}
                onClose={() => setEditingUser(null)}
                user={editingUser}
                onUpdated={handleUserUpdated}
            />

            <UserDeleteModal
                open={Boolean(deletingUser)}
                onClose={() => setDeletingUser(null)}
                user={deletingUser}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            /> */}
        </div>
    )
}