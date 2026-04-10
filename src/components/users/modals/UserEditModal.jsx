'use client'
import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material'
import { MdClose, MdEdit, MdAdminPanelSettings, MdSupervisorAccount, MdCode } from 'react-icons/md'
import { ROLES, ROLE_LABELS } from '@/lib/roles'
import { useUsers } from '@/context/UsersContext'
import { Avatar } from '@/components/projects/ProjectBadges'
import { muiDark, menuPaper } from '@/utils/Projects/StyleInputs'
import { toast } from 'sonner'

const ROLE_META = {
    [ROLES.ADMIN]: {
        icon: MdAdminPanelSettings,
        color: '#19CA68',
        bg: 'rgba(25,202,104,0.1)',
        border: 'rgba(25,202,104,0.2)',
        description: 'Acesso total ao sistema, pode gerenciar usuários e projetos.',
    },
    [ROLES.PROJECT_LEAD]: {
        icon: MdSupervisorAccount,
        color: '#22d3ee',
        bg: 'rgba(34,211,238,0.1)',
        border: 'rgba(34,211,238,0.2)',
        description: 'Pode criar e editar projetos, atribuir tarefas e ver relatórios.',
    },
    [ROLES.DEVELOPER]: {
        icon: MdCode,
        color: '#9ca3af',
        bg: 'rgba(156,163,175,0.1)',
        border: 'rgba(156,163,175,0.2)',
        description: 'Pode visualizar projetos e completar tarefas atribuídas.',
    },
}

export default function UserEditModal({ open, onClose, user }) {
    const { updateUserRole } = useUsers()
    const [selectedRole, setSelectedRole] = useState('')
    const [loading, setLoading]           = useState(false)
 
    useEffect(() => {
        if (open && user) setSelectedRole(user.role || '')
    }, [open, user])
 
    const handleClose = () => { if (!loading) onClose() }
 
    const handleSave = async () => {
        if (!user || selectedRole === user.role) { onClose(); return }
        setLoading(true)
        try {
            await updateUserRole(user.id, selectedRole)
            toast.success(`Cargo de ${user.name} atualizado!`)
            onClose()
        } catch (err) {
            console.error(err)
            toast.error('Erro ao atualizar cargo')
        } finally {
            setLoading(false)
        }
    }
 
    const meta = ROLE_META[selectedRole]
    const changed = selectedRole !== user?.role
 
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    background: '#171C23',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
                },
            }}
        >
            {/* Header */}
            <DialogTitle style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(34,211,238,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <MdEdit style={{ color: '#22d3ee', fontSize: 17 }} />
                    </div>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Editar Cargo</span>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#6b7280', padding: 4, borderRadius: 6, display: 'flex',
                    }}
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>
 
            <DialogContent style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* User info */}
                {user && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                        <Avatar name={user.name} uid={user.id} size={40} />
                        <div style={{ minWidth: 0 }}>
                            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14, margin: 0, marginBottom: 2 }}>
                                {user.name}
                            </p>
                            <p style={{ color: '#6b7280', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
 
                {/* Role selector */}
                <FormControl size="small" fullWidth sx={muiDark}>
                    <InputLabel>Cargo</InputLabel>
                    <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        label="Cargo"
                        MenuProps={menuPaper}
                    >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => {
                            const m = ROLE_META[value]
                            const Icon = m?.icon
                            return (
                                <MenuItem key={value} value={value} style={{ fontSize: 13 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {Icon && <Icon style={{ color: m.color, fontSize: 15 }} />}
                                        <span style={{ color: '#e5e7eb' }}>{label}</span>
                                    </div>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
 
                {/* Role description */}
                {meta && (
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 14px', borderRadius: 10,
                        background: meta.bg, border: `1px solid ${meta.border}`,
                    }}>
                        <meta.icon style={{ color: meta.color, fontSize: 16, flexShrink: 0, marginTop: 1 }} />
                        <p style={{ color: meta.color, fontSize: 12, margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                            {meta.description}
                        </p>
                    </div>
                )}
            </DialogContent>
 
            <DialogActions style={{ padding: '8px 24px 20px', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, color: '#9ca3af', padding: '8px 20px',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    }}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading || !changed}
                    style={{
                        background: changed && !loading
                            ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
                            : 'rgba(34,211,238,0.2)',
                        border: 'none', borderRadius: 8, color: changed ? '#000' : '#6b7280',
                        padding: '8px 24px', cursor: (loading || !changed) ? 'not-allowed' : 'pointer',
                        fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: changed && !loading ? '0 4px 14px rgba(34,211,238,0.3)' : 'none',
                        transition: 'all 0.2s',
                    }}
                >
                    {loading && <CircularProgress size={13} style={{ color: '#000' }} />}
                    Salvar Cargo
                </button>
            </DialogActions>
        </Dialog>
    )
}