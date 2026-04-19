"use client";

import { CircularProgress } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import ProjectCard from "@/components/projects/card/ProjectCard";
import ModalDelete from "@/components/projects/modals/ModalDelete";
import ProjectForm from "@/components/projects/modals/ProjectForm";
import { useProjects } from "@/context/ProjectsContext";
import { useDebounce } from "@/hooks/UseDebounce";
import ProjectsEmptyState from "./sections/ProjectsEmptyState";
import ProjectsFilters from "./sections/ProjectsFilters";
import ProjectsHeader from "./sections/ProjectsHeader";
import ProjectsStats from "./sections/ProjectsStats";

export default function ProjectsMain() {
    const {
        projects,
        users,
        usersMap,
        loadingProjects,
        createProject,
        updateProject,
        deleteProject,
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

    const stats = useMemo(
        // Conta quantos projetos existem em cada status
        () => ({
            total: projects.length,
            em_andamento: projects.filter((p) => p.status === "em_andamento")
                .length,
            concluido: projects.filter((p) => p.status === "concluido").length,
            pausado: projects.filter((p) => p.status === "pausado").length,
            suporte: projects.filter((p) => p.status === "suporte").length,
            arquivado: projects.filter((p) => p.status === "arquivado").length,
        }),
        [projects],
    );

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
            toast.error("Erro ao salvar projeto");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteProject(deletingProject.id); // exclui o projeto baseado no id dele
            toast.success("Projeto excluído!");
            setDeleteDialogOpen(false);
            setDeletingProject(null);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir projeto");
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
    const hasFilters = // se tiver ao menos um filtro ativo, mostra o botão para limpar
        filterStatus !== "all" ||
        filterPriority !== "all" ||
        filterDev !== "all" ||
        searchInput;

    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">
            <ProjectsHeader
                projectsCount={projects.length}
                onCreate={handleOpenCreate}
            />
            <ProjectsStats stats={stats} />
            <ProjectsFilters
                search={searchInput}
                onSearchChange={setSearchInput}
                filterStatus={filterStatus}
                onStatusChange={setFilterStatus}
                filterPriority={filterPriority}
                onPriorityChange={setFilterPriority}
                filterDev={filterDev}
                onDevChange={setFilterDev}
                users={users}
                onClearFilters={clearFilters}
                hasFilters={hasFilters}
            />

            {loadingProjects ? (
                <div className="flex items-center justify-center px-0 py-15 gap-3">
                    <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    <span className="text-font-gray2 text-sm">
                        Carregando projetos...
                    </span>
                </div>
            ) : filtered.length === 0 ? (
                <ProjectsEmptyState
                    projectsLength={projects.length}
                    onCreate={handleOpenCreate}
                />
            ) : (
                <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
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

            {/* Modals */}
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
