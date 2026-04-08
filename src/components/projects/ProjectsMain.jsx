'use client'

import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { MdAdd, MdSearch, MdFilterList, MdOutlineRocketLaunch } from 'react-icons/md'
import { AiOutlineClear } from "react-icons/ai";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useProjects } from '@/context/ProjectsContext'
import { muiDark2, menuPaper2 } from '@/utils/Projects/StyleInputs'
import { STATUS_MAP, PRIORITY_MAP } from '@/components/projects/ProjectsConfig'
import ProjectCard from '@/components/projects/card/ProjectCard'
import ProjectForm from '@/components/projects/modals/ProjectForm'
import ModalDelete from '@/components/projects/modals/ModalDelete'
import CanDo from '@/components/auth/CanDo';

export default function ProjectsMain() {
  const { projects, users, usersMap, loadingProjects, createProject, updateProject, deleteProject } = useProjects()

  const [search, setSearch]               = useState('')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterDev, setFilterDev]         = useState('all')

  const [dialogOpen, setDialogOpen]       = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProject, setDeletingProject]   = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false
      if (filterPriority !== 'all' && p.priority !== filterPriority) return false
      if (filterDev !== 'all' && !(p.developers || []).includes(filterDev)) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.client?.toLowerCase().includes(q) ||
          (p.techStack || []).some((t) => t.toLowerCase().includes(q)) ||
          (p.developers || []).some((uid) => usersMap[uid]?.name?.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [projects, filterStatus, filterPriority, filterDev, search, usersMap])

  const stats = useMemo(() => ({
    total:       projects.length,
    em_andamento: projects.filter((p) => p.status === 'em_andamento').length,
    concluido:   projects.filter((p) => p.status === 'concluido').length,
    pausado:     projects.filter((p) => p.status === 'pausado').length,
    suporte: projects.filter((p)=> p.status === 'suporte').length,
  }), [projects])

  const handleOpenCreate = () => { setEditingProject(null); setDialogOpen(true) }
  const handleOpenEdit   = useCallback((p) => { setEditingProject(p); setDialogOpen(true) }, [])
  const handleOpenDelete = useCallback((p) => { setDeletingProject(p); setDeleteDialogOpen(true) }, [])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data, editingProject)
        toast.success('Projeto atualizado!')
      } else {
        await createProject(data)
        toast.success('Projeto criado!')
      }
      setDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar projeto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(deletingProject.id)
      toast.success('Projeto excluído!')
      setDeleteDialogOpen(false)
      setDeletingProject(null)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir projeto')
    } finally {
      setDeleting(false)
    }
  }

  const clearFilters = () => { setFilterStatus('all'); setFilterPriority('all'); setFilterDev('all'); setSearch('') }
  const hasFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterDev !== 'all' || search

  return (
    <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <MdOutlineRocketLaunch style={{ color: '#19CA68', fontSize: 18 }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4b4b4b' }}>
              Gestão de Projetos
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>Projetos</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            {projects.length} projeto{projects.length !== 1 ? 's' : ''} cadastrado{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CanDo permission="canCreateProjects">
            <button
                onClick={handleOpenCreate}
                type="button"
                className="
                    relative inline-flex items-center gap-1.5
                    px-4.5 h-9.5 rounded-[7px]
                    text-[13px] font-bold tracking-tight text-black
                    bg-linear-to-br from-brand-500 to-brand-600
                    overflow-hidden cursor-pointer
                    transition-all duration-150
                    hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(25,202,104,0.42)]
                    active:scale-[0.97]
                    shadow-[0_2px_10px_rgba(25,202,104,0.25)]
                "
            >
                <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-linear-to-b from-white/18 to-transparent" />


                <span className="relative z-10">Novo Projeto</span>
            </button>
        </CanDo>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, userSelect:'none' }}>
        {[
          { label: 'Total', value: stats.total,        color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
          { label: 'Em Andamento', value: stats.em_andamento, color: 'var(--color-cyan-400)', bg: 'var(--color-surface-cyan-alt)',  border: 'var(--color-surface-cyan-md)'  },
          { label: 'Concluídos', value: stats.concluido,    color: 'var(--color-brand-500)', bg: 'var(--color-surface-green-alt)', border: 'var(--color-surface-green-md)'},
          { label: 'Pausados', value: stats.pausado,      color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  },
          { label:'Suporte', value:stats.suporte, color:'#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)'},
        ].map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 24, background: s.bg, border: `1px solid ${s.border}`, fontSize: 13 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</span>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '14px 16px', background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <MdSearch size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar projetos, clientes, tecnologias..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e5e7eb', padding: '7px 10px 7px 32px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <MdFilterList size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
        <FormControl size="small" sx={{ minWidth: 160, ...muiDark2 }}>
            <InputLabel>Status</InputLabel>
            <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                MenuProps={menuPaper2}
            >
                <MenuItem value="all" style={{color: '#e5e7eb'}}>Todos status</MenuItem>
                {Object.entries(STATUS_MAP).map(([val, cfg]) => (
                    <MenuItem key={val} value={val} style={{ color: cfg.color }}>
                        {cfg.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160, ...muiDark2 }}>
            <InputLabel>Prioridade</InputLabel>
            <Select
                value={filterPriority}
                label="Prioridade"
                onChange={(e) => setFilterPriority(e.target.value)}
                MenuProps={menuPaper2}
            >
                <MenuItem value="all" style={{color: '#e5e7eb'}}>Todas prioridades</MenuItem>
                {Object.entries(PRIORITY_MAP).map(([val, cfg]) => (
                    <MenuItem key={val} value={val} style={{ color: cfg.color }}>
                        {cfg.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160, ...muiDark2 }}>
            <InputLabel>Dev</InputLabel>
            <Select
                value={filterDev}
                label="Dev"
                onChange={(e) => setFilterDev(e.target.value)}
                MenuProps={menuPaper2}
            >
                <MenuItem value="all" style={{color: '#e5e7eb'}}>Todos devs</MenuItem>
                {users.map((u) => (
                    <MenuItem key={u.id} value={u.id} style={{color: '#e5e7eb'}}>
                        {u.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        {hasFilters && (
          <button onClick={clearFilters} type='button' style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', padding: ' 8px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <AiOutlineClear className='text-xl'/>
          </button>
        )}
      </div>

      {/* GRID */}
      {loadingProjects ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <CircularProgress size={24} style={{ color: '#19CA68' }} />
          <span style={{ color: '#6b7280', fontSize: 14 }}>Carregando projetos...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12, background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <MdOutlineRocketLaunch style={{ fontSize: 44, color: '#2D2D2D' }} />
          <p style={{ color: '#4b4b4b', fontSize: 14, fontWeight: 600 }}>
            {projects.length === 0 ? 'Nenhum projeto cadastrado ainda' : 'Nenhum projeto encontrado'}
          </p>
          {projects.length === 0 && (
            <button onClick={handleOpenCreate} type='button' style={{ marginTop: 4, background: 'rgba(25,202,104,0.1)', border: '1px solid rgba(25,202,104,0.2)', borderRadius: 8, color: '#19CA68', padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MdAdd size={16} /> Criar primeiro projeto
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              usersMap={usersMap}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* DIALOGS */}
      <ProjectForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={editingProject}
        users={users}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <ModalDelete
        open={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setDeletingProject(null) }}
        project={deletingProject}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  )
}