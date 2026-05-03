"use client";
import { useCallback, useMemo, useState } from "react";
import {
    MdAdd,
    MdOutlineFilterList,
    MdOutlineTaskAlt,
    MdSearch,
} from "react-icons/md";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectsContext";
import { useTasks } from "@/context/TasksContext";
import { useDebounce } from "@/hooks/useDebounce";
import CanDo from "../auth/CanDo";
import { PRIORITY_MAP, STATUS_MAP } from "../ui/StatusBadge";
import TaskDeleteModal from "./modals/TaskDeleteModal";
import TaskForm from "./modals/TaskForm";

export default function TasksMain() {
    const { tasks, loadingTasks, createTask, updateTask, deleteTask } =
        useTasks();
    const { projects, projectMap, users, usersMap } = useProjects();
    const { currentUser } = useAuth();

    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingTask, setDeletingTask] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterProject, setFilterProject] = useState("all");
    const [filterAssignee, setFilterAssignee] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // atraso de 300ms para cada pesquisa após parar de digitar, melhora a performance
    const debouncedSearch = useDebounce(searchInput, 300);

    const filtered = useMemo(() => {
        return tasks.filter((t) => {
            //se o status nao for "all", e o status atual da task, for diferente do filtro, a task some
            if (filterStatus !== "all" && t.status !== filterStatus)
                return false;
            if (filterPriority !== "all" && t.priority !== filterPriority)
                return false;
            if (filterProject !== "all" && t.projectId !== filterProject)
                return false;
            if (
                filterAssignee === "mine" &&
                !(t.assigneTo || []).includes(currentUser.uid)
            )
                return false;
            if (
                filterAssignee !== "all" &&
                filterAssignee !== "mine" &&
                !(t.assigneTo || []).includes(filterAssignee)
            )
                return false;
            if (debouncedSearch) {
                const q = debouncedSearch.toLowerCase();
                return (
                    t.title?.toLowerCase().includes(q) ||
                    t.description?.toLowerCase().includes(q) ||
                    (t.assigneTo || []).some((uid) =>
                        usersMap[uid]?.name?.toLowerCase().includes(q),
                    ) ||
                    projectMap[t.projectId]?.title?.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [
        tasks,
        filterStatus,
        filterPriority,
        filterProject,
        filterAssignee,
        debouncedSearch,
        usersMap,
        projectMap,
        currentUser,
    ]);

    // calcula número de tarefas por status com base em todas as tarefas
    const stats = useMemo(
        () => ({
            total: tasks.length,
            done: tasks.filter((t) => t.status === "concluido").length,
            inProgress: tasks.filter((t) => t.status === "em_andamento").length,
            pending: tasks.filter((t) => t.status === "pausado").length,
        }),
        [tasks],
    );

    // agrupa as tarefas por projeto
    const groupedByProject = useMemo(() => {
        const map = {};
        filtered.forEach((t) => {
            const pid = t.projectId || "__sem_projeto__";
            if (!map[pid]) map[pid] = [];
            map[pid].push(t);
        });
        return Object.entries(map);
    }, [filtered]);

    // abre o form para criar task
    const handleOpenCreate = () => {
        setEditingTask(null);
        setFormOpen(true);
    };
    // recebe a task, abre o form, e indica que é edição
    const handleOpenEdit = useCallback((task) => {
        setEditingTask(task);
        setFormOpen(true);
    }, []);
    // recebe a task, indica que é delete e abre o pop-up de delete
    const handleOpenDelete = useCallback((task) => {
        setDeletingTask(task);
        setDeleteOpen(true);
    }, []);

    const handleSubmit = async (data) => {
        // recebe os dados do form
        setSubmitting(true);

        try {
            // se for edit
            if (editingTask) {
                await updateTask(editingTask.id, data, editingTask);
                toast.success("Tarefa atualizada!");
            } else {
                // se existe um filtro de projeto ativo, usa esse projeto
                const pid =
                    filterProject !== "all"
                        ? filterProject
                        : projects[0]?.id || "";
                await createTask({ ...data, projectId: pid });
                toast.success("Tarefa criada!");
            }
            setFormOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar tarefa");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);

        try {
            await deleteTask(deletingTask);
            toast.success("Tarefa excluída!");
            setDeleteOpen(false);
            setDeletingTask(null);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir tarefa");
        } finally {
            setSubmitting(false);
        }
    };

    const clearFilters = () => {
        // função para limpar filtros
        setFilterStatus("all");
        setFilterPriority("all");
        setFilterProject("all");
        setFilterAssignee("all");
        setSearchInput("");
    };

    const selectCls =
        "text-[12px] bg-bg-surface border border-border-main2 text-text-secondary rounded-lg px-3 py-1.5 outline-none focus:border-brand-500/50 cursor-pointer";

    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MdOutlineTaskAlt className="text-brand-500 text-lg" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                            Gestão de Tarefas
                        </span>
                    </div>
                    <h1 className="text-[26px] font-extrabold text-text-primary m-0">
                        Tarefas
                    </h1>
                    <p className="text-[13px] text-text-muted mt-1">
                        {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} no
                        sistema
                    </p>
                </div>
                <CanDo permission="canCreateTasks">
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
                    >
                        <MdAdd size={18} />
                        Nova Tarefa
                    </button>
                </CanDo>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    {
                        label: "Total",
                        value: stats.total,
                        color: "text-text-primary",
                    },
                    {
                        label: "Pendentes",
                        value: stats.pending,
                        color: "text-warning",
                    },
                    {
                        label: "Em Execução",
                        value: stats.inProgress,
                        color: "text-cyan-400",
                    },
                    {
                        label: "Concluídas",
                        value: stats.done,
                        color: "text-brand-500",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-bg-card border border-border-main2 rounded-xl px-4 py-3"
                    >
                        <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold">
                            {s.label}
                        </p>
                        <p className={"text-[24px] font-extrabold " + s.color}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Busca + Filtros */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-48">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar tarefa, responsável, projeto..."
                            className="w-full bg-bg-surface border border-border-main2 rounded-xl pl-9 pr-4 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-brand-500/50 transition-colors"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters((v) => !v)}
                        className={
                            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer " +
                            (showFilters
                                ? "bg-brand-500/15 border-brand-500/30 text-brand-500"
                                : "bg-bg-surface border-border-main2 text-text-secondary hover:text-text-primary")
                        }
                    >
                        <MdOutlineFilterList size={16} />
                        Filtros
                    </button>
                    {(filterStatus !== "all" ||
                        filterPriority !== "all" ||
                        filterProject !== "all" ||
                        filterAssignee !== "all") && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-[12px] text-error hover:underline cursor-pointer"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-bg-card border border-border-main2 rounded-xl">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Status
                            </span>
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="all">Todos</option>
                                {Object.entries(STATUS_MAP).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Prioridade
                            </span>
                            <select
                                value={filterPriority}
                                onChange={(e) =>
                                    setFilterPriority(e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="all">Todas</option>
                                {Object.entries(PRIORITY_MAP).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Projeto
                            </span>
                            <select
                                value={filterProject}
                                onChange={(e) =>
                                    setFilterProject(e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="all">Todos</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Responsável
                            </span>
                            <select
                                value={filterAssignee}
                                onChange={(e) =>
                                    setFilterAssignee(e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="all">Todos</option>
                                <option value="mine">Minhas tarefas</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            {loadingTasks ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border-main2 flex items-center justify-center">
                        <MdOutlineTaskAlt className="text-text-muted text-3xl" />
                    </div>
                    <div className="text-center">
                        <p className="text-[16px] font-bold text-text-primary">
                            Nenhuma tarefa encontrada
                        </p>
                        <p className="text-[13px] text-text-muted mt-1">
                            {tasks.length === 0
                                ? "Crie a primeira tarefa para começar."
                                : "Tente ajustar os filtros."}
                        </p>
                    </div>
                    <CanDo permission="canCreateTasks">
                        {tasks.length === 0 && (
                            <button
                                type="button"
                                onClick={handleOpenCreate}
                                className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                <MdAdd size={18} />
                                Criar primeira tarefa
                            </button>
                        )}
                    </CanDo>
                </div>
            ) : (
                <div className="space-y-8">
                    {groupedByProject.map(([pid, ptasks]) => {
                        const project = projectMap[pid];
                        return (
                            <div key={pid} className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-border-main2" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted px-2">
                                        {project?.title || "Sem projeto"}
                                    </span>
                                    <span className="text-[10px] text-text-muted bg-bg-surface border border-border-main2 px-2 py-0.5 rounded-full">
                                        {ptasks.length}
                                    </span>
                                    <div className="h-px flex-1 bg-border-main2" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {ptasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            usersMap={usersMap}
                                            onEdit={handleOpenEdit}
                                            onDelete={handleOpenDelete}
                                            canEdit={canEdit}
                                            canDelete={canDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <TaskForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                task={editingTask}
                users={users}
                usersMap={usersMap}
                onSubmit={handleSubmit}
                loading={submitting}
            />
            <TaskDeleteModal
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeletingTask(null);
                }}
                task={deletingTask}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </div>
    );
}
