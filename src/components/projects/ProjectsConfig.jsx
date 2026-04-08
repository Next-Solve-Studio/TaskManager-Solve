'use client'
import * as yup from 'yup'
import {
    MdCheckCircle,
    MdPauseCircle,
    MdOutlineLoop,
    MdArchive,
    MdOutlineSupportAgent
} from 'react-icons/md'

export const STATUS_MAP = {
    em_andamento: {
        label: 'Em Andamento',
        color: 'var(--color-cyan-400)',
        bg: 'var(--color-surface-cyan-alt)',
        border: 'var(--color-surface-cyan-md)',
        icon: MdOutlineLoop,
    },
    concluido: {
        label: 'Concluído',
        color: 'var(--color-brand-500)',
        bg: 'var(--color-surface-green-alt)',
        border: 'var(--color-surface-green-md)',
        icon: MdCheckCircle,
    },
    pausado: {
        label: 'Pausado',
        color: 'var(--color-warning)',
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.25)',
        icon: MdPauseCircle,
    },
    arquivado: {
        label: 'Arquivado',
        color: '#6b7280',
        bg: 'rgba(107,114,128,0.12)',
        border: 'rgba(107,114,128,0.25)',
        icon: MdArchive,
    },
    suporte: {
        label: 'Suporte',
        color: '#a855f7', // Roxo (Tailwind purple-500)
        bg: 'rgba(168, 85, 247, 0.12)',
        border: 'rgba(168, 85, 247, 0.25)',
        icon: MdOutlineSupportAgent,
    }
}

export const PRIORITY_MAP = {
  baixa:   { label: 'Baixa',   color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  media:   { label: 'Média',   color: 'var(--color-cyan-400)', bg: 'var(--color-surface-cyan-alt)'  },
  alta:    { label: 'Alta',    color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.12)'  },
  critica: { label: 'Crítica', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.12)'   },
}

export const projectSchema = yup.object({ // define um esquema que valida um objeto
  title:         yup.string().min(3, 'Mínimo 3 caracteres').required('Título obrigatório'),
  description:   yup.string().optional(),
  client:        yup.string().optional(),
  status:        yup.string().oneOf(Object.keys(STATUS_MAP)).required(),
  priority:      yup.string().oneOf(Object.keys(PRIORITY_MAP)).required(),
  developers:    yup.array().of(yup.string()).min(1, 'Selecione ao menos um desenvolvedor'),
  startDate:     yup.string().optional(),
  deliveryDate:  yup.string().optional(),
  techStack:     yup.string().optional(),
  repositoryUrl: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .url('URL inválida')
    .nullable()
    .optional(),
  hosting:       yup.string().optional(),
})

export const AVATAR_COLORS = [
  '#19CA68','#22d3ee','#f59e0b','#a78bfa','#ef4444',
  '#fb923c','#34d399','#60a5fa','#f472b6','#facc15',
]

export function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('')
}

export function avatarColor(uid = '') {
  let hash = 0
  for (const c of uid) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
