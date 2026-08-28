"use client";

import { useCallback, useMemo, useState } from "react";
import { MdVisibility, MdExtension } from "react-icons/md";
import { toast } from "sonner";
import CanDo from "@/components/auth/CanDo";
import ModalDelete from "@/components/projects/modals/ModalDelete";
import ProjectForm from "@/components/projects/modals/ProjectForm";
import ProjectCardSettingsModal from "@/components/projects/modals/ProjectCardSettingsModal";
import CustomFieldFormModal from "@/components/ui/modals/CustomFieldFormModal";
import { useProjects } from "@/context/ProjectsContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useSettings } from "@/context/SettingsContext";
import NewProject from "./button/NewProject";
import ProjectsFilters from "./sections/ProjectsFilters";
import ProjectsGrid from "./sections/ProjectsGrid";
import ProjectsHeader from "./sections/ProjectsHeader";
import ProjectsStats from "./sections/ProjectsStats";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ProjectsMain() {
    const {
        projects,
        users,
        usersMap,
        clients,
        clientMap,
        loadingProjects,
        createProject,
        updateProject,
        deleteProject,
        visibleProjects,
        loadMoreProjects,
    } = useProjects();

    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterDev, setFilterDev] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingProject, setDeletingProject] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [customFieldsModalOpen, setCustomFieldsModalOpen] = useState(false);
    const { systemSettings, updateSystemSettings } = useSettings();
    
    const defaultSettings = {
        showClient: true,
        showDescription: true,
        showTechStack: true,
        showDevelopers: true,
        showDates: true,
        showRepository: true,
        showCreatedModifiedBy: true,
    };
    const settings = systemSettings?.projectCardSettings || defaultSettings;

    const debouncedSearch = useDebounce(searchInput, 300);

    const filtered = useMemo(() => {
        // Só recalcula a lista quando as dependências mudarem, evita processamento desnecessário.
        return projects.filter((p) => {
            // percorre todos os projetos e mantém apenas os que passam nas validações
            if (filterStatus !== "all" && p.status !== filterStatus)
                return false;
            if (filterPriority !== "all" && p.priority !== filterPriority)
                return false;
            if (
                filterDev !== "all" &&
                !(p.developers || []).includes(filterDev)
            )
                return false;
            if (debouncedSearch) {
                const q = debouncedSearch.toLowerCase(); // Converte tudo para minúsculo
                return (
                    p.title?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.client?.toLowerCase().includes(q) ||
                    (p.techStack || []).some((t) =>
                        t.toLowerCase().includes(q),
                    ) ||
                    (p.developers || []).some((uid) =>
                        usersMap[uid]?.name?.toLowerCase().includes(q),
                    )
                ); // verifica se o título, descrição, cliente, tech stack ou nome do desenvolvedor contém o termo digitado
            }
            return true;
        });
    }, [
        projects,
        filterStatus,
        filterPriority,
        filterDev,
        debouncedSearch,
        usersMap,
    ]);

    const handleOpenCreate = () => {
        // abre modal de criação
        setEditingProject(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = useCallback((p) => {
        // Abre o modal de edição, recebendo o projeto p e guardando em editingProject
        setEditingProject(p);
        setDialogOpen(true);
    }, []);

    const handleOpenDelete = useCallback((p) => {
        // Abre o modal de exclusão
        setDeletingProject(p);
        setDeleteDialogOpen(true);
    }, []);

    const handleSubmit = async (data) => {
        setSubmitting(true);
        try {
            if (editingProject) {
                await updateProject(editingProject.id, data, editingProject); // edita o projeto
                toast.success("Projeto atualizado!");
            } else {
                await createProject(data); // cria um projeto novo
                toast.success("Projeto criado!");
            }
            setDialogOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(getErrorMessage(err, "Erro ao salvar projeto"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteProject(deletingProject); // exclui o projeto baseado no objeto dele
            toast.success("Projeto excluído!");
            setDeleteDialogOpen(false);
            setDeletingProject(null);
        } catch (err) {
            console.error(err);
            toast.error(getErrorMessage(err, "Erro ao excluir projeto"));
        } finally {
            setDeleting(false);
        }
    };

    const clearFilters = () => {
        // função para limpar filtros
        setFilterStatus("all");
        setFilterPriority("all");
        setFilterDev("all");
        setSearchInput("");
    };

    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">
            <ProjectsHeader projectsCount={projects.length} />

            <div className="flex justify-between flex-col gap-5 sm:flex-row">
                <ProjectsStats projects={projects} />
                <div className="flex gap-2 items-center justify-end">
                    <CanDo permission="canManageProjectCardView">
                        <button
                            type="button"
                            onClick={() => setSettingsOpen(true)}
                            className="h-10 px-3 bg-bg-surface border border-border-main2 rounded-xl text-text-muted hover:text-brand-500 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-center"
                            title="Configurar visualização global"
                        >
                            <MdVisibility size={20} />
                        </button>
                    </CanDo>
                    <CanDo permission="canManageCustomFields">
                        <button
                            type="button"
                            onClick={() => setCustomFieldsModalOpen(true)}
                            className="h-10 px-3 bg-bg-surface border border-border-main2 rounded-xl text-text-muted hover:text-brand-500 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-center"
                            title="Gerenciar campos personalizados"
                        >
                            <MdExtension size={20} />
                        </button>
                    </CanDo>
                    <NewProject onCreate={handleOpenCreate} />
                </div>
            </div>

            <ProjectsFilters
                onSearchChange={setSearchInput}
                filterStatus={filterStatus}
                onStatusChange={setFilterStatus}
                filterPriority={filterPriority}
                onPriorityChange={setFilterPriority}
                filterDev={filterDev}
                onDevChange={setFilterDev}
                users={users}
                searchInput={searchInput}
                clearFilters={clearFilters}
            />

            <ProjectsGrid
                loadingProjects={loadingProjects}
                projects={projects}
                usersMap={usersMap}
                clientMap={clientMap}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                filtered={filtered.slice(0, visibleProjects.length)}
                onCreate={handleOpenCreate}
                settings={settings}
            />

            {filtered.length > visibleProjects.length && (
                <div className="flex justify-center pt-4">
                    <button
                        type="button"
                        onClick={loadMoreProjects}
                        className="px-6 py-2 bg-bg-card border border-border-main2 hover:border-brand-500/50 text-text-secondary hover:text-brand-500 text-[13px] font-bold rounded-xl transition-all cursor-pointer"
                    >
                        Carregar mais projetos (
                        {filtered.length - visibleProjects.length} restantes)
                    </button>
                </div>
            )}

            {/* Modals */}
            <ProjectCardSettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={settings}
                updateSystemSettings={updateSystemSettings}
            />

            <CustomFieldFormModal
                open={customFieldsModalOpen}
                onClose={() => setCustomFieldsModalOpen(false)}
                entity="project"
                entityLabel="Projetos"
            />

            <ProjectForm
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                project={editingProject}
                users={users}
                usersMap={usersMap}
                clients={clients}
                onSubmit={handleSubmit}
                loading={submitting}
            />

            <ModalDelete
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingProject(null);
                }}
                project={deletingProject}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </div>
    );
}
