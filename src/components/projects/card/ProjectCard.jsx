'use client'
import { useState, useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { 
  MdMoreVert, MdEdit, MdDelete, MdPerson, 
  MdGroup, MdCalendarToday, MdOutlineTimer, MdComputer 
} from 'react-icons/md'
import { RiGitBranchLine } from 'react-icons/ri'
import { Menu, MenuItem, Tooltip } from '@mui/material'
import { Avatar, StatusBadge, PriorityBadge } from "../ProjectBadges";
import { parseDate } from "@/utils/Projects/FormatDateProjects";
import CanDo from "@/components/auth/CanDo";
export default function ProjectCard({project, usersMap, onEdit, onDelete}){
    //guarda o elemento HTML que servirá de “âncora” para o menu (que começa fechado)
    const [anchorEl, setAnchorEl] = useState(null)

    // busca o objeto do usuário correspondendo pelo usersMap
    const developers = (project.developers || [])
    .map((uid)=> usersMap[uid])
    .filter(Boolean)//remove os itens que são undefined ou falsos, fica só os users que existem no banco

    const createdBy = usersMap[project.createdBy] // pega o objeto do usuário que criou o projeto (usando o createdBy que veio do Firebase)
    const lastModifiedBy = usersMap[project.lastModifiedBy] // agora pega quem editou pela última vez

    // executa essa função apenas quando project.expectedDeliveryDate mudar. Se não mudar, reutiliza o valor antigo
    const expectedInfo = useMemo(()=>{
        //se não houver previsão de entrega, retorna null
        if (!project.expectedDeliveryDate) return null

        const due = parseDate(project.expectedDeliveryDate) 
        if (!due) return null

        const diff = differenceInDays(due, new Date()) // calcula quantos dias faltam para a entrega, se for negativa, ja passou
        const formatted = format(due, 'dd/MM/yyyy')

        if (diff < 0) return { text: `${Math.abs(diff)}d atrasado`, color: 'var(--color-error)', formatted }
        if (diff <= 7) return { text: `${diff}d restantes`,          color: 'var(--color-warning)', formatted }

        return {
            text: formatted,
            color: '#6b7280',
            formatted 
        }
    }, [project.expectedDeliveryDate])

    // executa essa função apenas quando project.deliveryDate mudar. Se não mudar, reutiliza o valor antigo
    const deliveredInfo = useMemo(() => {
        if (!project.deliveryDate) return null

        const delivered = parseDate(project.deliveryDate)
        if (!delivered) return null

        return {
            formatted: format(delivered, 'dd/MM/yyyy')
        }
    }, [project.deliveryDate])

    const expected = parseDate(project.expectedDeliveryDate)
    const delivered = parseDate(project.deliveryDate)

    const deliveryStatus = useMemo(()=>{
        if (!expected || !delivered) return null

        const diff = differenceInDays(delivered, expected)

        if (diff > 0) return { text: `${diff}d atrasado`, color: 'var(--color-error)' }
        if (diff < 0) return { text: `${Math.abs(diff)}d adiantado`, color: 'var(--color-success)' }

        return { text: 'No prazo', color: 'var(--color-cyan-500)' }
    },[expected, delivered])
    const techStack = Array.isArray(project.techStack) ?  project.techStack : [] // Verifica se techkStack é um array, se for, usa ele.
        
    return (
        <div
            className="bg-bg-card border border-white/5 rounded-xl p-4 flex flex-col gap-3
                transition-all duration-200
                hover:border-green-400/20 hover:-translate-y-0.5 select-none"
        >

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 8 }}>
                    {project.title}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                </div> 
            </div>

            <CanDo permission="canEditProjects">
                <button
                    onClick={(e) => setAnchorEl(e.currentTarget)} type='button'
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#6b7280', padding: 4, borderRadius: 6, display: 'flex', flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {e.currentTarget.style.color = '#e5e7eb'}}
                    onMouseLeave={(e) => {e.currentTarget.style.color = '#6b7280'}}
                >
                    <MdMoreVert size={18} />
                </button>
            </CanDo>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                PaperProps={{ style: { background: 'var(--color-bg-selected)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', minWidth: 140 }}}
            >
                <MenuItem
                    onClick={() => { setAnchorEl(null); onEdit(project) }}
                    sx={{ 
                        color: '#e5e7eb', 
                        fontSize: 13, 
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'var(--color-bg-hover)', 
                        }
                    }}
                >
                    <MdEdit size={15} style={{ color: '#22d3ee' }} /> Editar
                </MenuItem>
                <MenuItem
                    onClick={() => { setAnchorEl(null); onDelete(project) }}
                    sx={{ 
                        color: 'var(--color-error)', 
                        fontSize: 13, 
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'var(--color-bg-hover)',
                        }
                    }}
                >
                    <MdDelete size={15} /> Excluir
                </MenuItem>
            </Menu>
        </div>

        {project.client && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MdPerson size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{project.client}</span>
            </div>
        )}

        {project.description && (
            <p style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            {project.description.length > 100 ? project.description.slice(0, 100) + '…' : project.description}
            </p>
        )}

        {techStack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {techStack.map((tech) => (
                <span key={tech} style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(34,211,238,0.08)', color: '#22d3ee',
                border: '1px solid rgba(34,211,238,0.15)', letterSpacing: '0.03em',
                }}>
                {tech}
                </span>
            ))}
            </div>
        )}
    
        {developers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MdGroup size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {developers.slice(0, 4).map((dev, i) => (
                <Tooltip key={dev.id} title={dev.name} arrow>
                    <div style={{ marginLeft: i === 0 ? 0 : -8, zIndex: developers.length - i }}>
                    <Avatar name={dev.name} uid={dev.id} size={26} />
                    </div>
                </Tooltip>
                ))}
                {developers.length > 4 && (
                <span style={{
                    marginLeft: -8, width: 26, height: 26, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)', border: '2px solid #121212',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#9ca3af',
                }}>
                    +{developers.length - 4}
                </span>
                )}
            </div>
            <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 4 }}>
                {developers.length} dev{developers.length !== 1 ? 's' : ''}
            </span>
            </div>
        )}

        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 8,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(() => {
                    const start = parseDate(project.startDate)
                    if (!start) return null

                    return (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#4b4b4b' }}>
                            <MdCalendarToday size={11} />
                            Início: {format(start, 'dd/MM/yyyy')}
                        </span>
                    )
                })()}
                {expectedInfo && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: expectedInfo.color,
                        fontWeight: 600
                    }}>
                        <MdOutlineTimer size={11} />
                        {expectedInfo.text !== expectedInfo.formatted
                        ? `Previsão: ${expectedInfo.formatted} · ${expectedInfo.text}`
                        : `Previsão: ${expectedInfo.formatted}`}
                    </span>
                )}
                {deliveredInfo && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: '#22c55e',
                        fontWeight: 600
                    }}>
                        <MdOutlineTimer size={11} />
                        Entregue em: {deliveredInfo.formatted}
                    </span>
                )}
                {deliveryStatus && (
                    <span style={{ fontSize: 10, color: deliveryStatus.color }}>
                        {deliveryStatus.text}
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
            {project.repositoryUrl && (
                <Tooltip title="Repositório" arrow>
                <a href={project.repositoryUrl} target="_blank" rel="noreferrer"
                    style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 7,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9ca3af', textDecoration: 'none', transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#19CA68'; e.currentTarget.style.borderColor = 'rgba(25,202,104,0.3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                    <RiGitBranchLine size={14} />
                </a>
                </Tooltip>
            )}
            {project.hosting && (
                <Tooltip title={`Hosting: ${project.hosting}`} arrow>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 7,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 10, color: '#6b7280',
                }}>
                    <MdComputer size={12} />{project.hosting}
                </div>
                </Tooltip>
            )}
            </div>
        </div>

        {/* ── Meta ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            {createdBy && (
            <span style={{ fontSize: 10, color: '#4b4b4b' }}>
                Criado por <span style={{ color: '#6b7280', fontWeight: 600 }}>{createdBy.name}</span>
            </span>
            )}
            {lastModifiedBy && project.lastModified && (
            <span style={{ fontSize: 10, color: '#4b4b4b' }}>
                Últ. Edição por <span style={{ color: '#6b7280', fontWeight: 600 }}>{lastModifiedBy.name}</span>
            </span>
            )}
        </div>
        </div>
    )
}