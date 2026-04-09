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
    return (

    )
}