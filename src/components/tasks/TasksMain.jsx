"use client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useProjects } from "@/context/ProjectsContext";
import { useTasks } from "@/context/TasksContext";
import TaskDeleteModal from "./modals/TaskDeleteModal";
import TaskForm from "./modals/TaskForm";
import TaskCardSettingsModal from "./modals/TaskCardSettingsModal";
import TasksImportModal from "./modals/TasksImportModal";
import TasksBulkBar from "./sections/TasksBulkBar";
import TasksContent from "./sections/TasksContent";
import TasksFilters from "./sections/TasksFilters";
import TasksHeader from "./sections/TasksHeader";
import TasksStats from "./sections/TasksStats";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useSettings } from "@/context/SettingsContext";
import { useRole } from "@/hooks/useRole";
import CustomFieldFormModal from "@/components/ui/modals/CustomFieldFormModal";
import { downloadTasksTemplate, parseTasksSpreadsheet } from "@/utils/TasksSpreadsheet";

const IMPORT_CHUNK_SIZE = 10;

export default function TasksMain() {
    const {
        tasks,
        loadingTasks,
        createTask,
        updateTask,
        deleteTask,
        visibleTasksCount,
        loadMoreTasks,
        bulkUpdateTasks,
    } = useTasks();
    const { projects, projectMap, users, usersMap } = useProjects();
    const { can } = useRole();
    const canEditTasks = can("canEditTasks");

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
    const [filterMonth, setFilterMonth] = useState("all");
    const [importResult, setImportResult] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const [bulkApplying, setBulkApplying] = useState(false);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [customFieldsModalOpen, setCustomFieldsModalOpen] = useState(false);
    const { systemSettings, updateSystemSettings } = useSettings();
    
    const defaultSettings = {
        showDescription: true,
        showChecklist: true,
        showAssignees: true,
        showDates: true,
    };
    const settings = systemSettings?.taskCardSettings || defaultSettings;

    // abre o form para criar task
    const handleOpenCreate = () => {
        setEditingTask(null);
        setFormOpen(true);
    };

    const handleSubmit = async (data) => {
        // recebe os dados do form
        setSubmitting(true);

        try {
            // se for edit
            if (editingTask) {
                await updateTask(editingTask.id, data, editingTask);
                toast.success("Tarefa atualizada!");
            } else {
                // data.projectId já vem preenchido pelo form
                await createTask(data);
                toast.success("Tarefa criada!");
            }
            setFormOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(getErrorMessage(err, "Erro ao salvar tarefa"));
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
            toast.error(getErrorMessage(err, "Erro ao excluir tarefa"));
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleSelect = useCallback((id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const handleToggleSelectMany = useCallback((ids, select) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            for (const id of ids) {
                if (select) next.add(id);
                else next.delete(id);
            }
            return next;
        });
    }, []);

    const handleBulkApply = async (changes) => {
        setBulkApplying(true);
        try {
            const updated = await bulkUpdateTasks([...selectedIds], changes);
            if (updated > 0) {
                toast.success(
                    `${updated} tarefa${updated === 1 ? "" : "s"} atualizada${updated === 1 ? "" : "s"}!`,
                );
            } else {
                toast.info("As tarefas selecionadas já estavam assim.");
            }
            setSelectedIds(new Set());
        } catch (err) {
            console.error(err);
            toast.error(getErrorMessage(err, "Erro ao atualizar tarefas"));
        } finally {
            setBulkApplying(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await downloadTasksTemplate({ projects });
        } catch (err) {
            console.error(err);
            toast.error("Erro ao gerar o modelo de planilha");
        }
    };

    const handleImportFile = async (file) => {
        try {
            const result = await parseTasksSpreadsheet(file, { projects, users });
            if (result.tasks.length === 0 && result.errors.length === 0) {
                toast.error("A planilha não tem nenhuma tarefa preenchida.");
                return;
            }
            setImportProgress(0);
            setImportResult(result);
        } catch (err) {
            toast.error(err.message || "Não foi possível ler a planilha");
        }
    };

    const handleConfirmImport = async () => {
        setImporting(true);
        let created = 0;
        let failed = 0;

        for (let i = 0; i < importResult.tasks.length; i += IMPORT_CHUNK_SIZE) {
            const chunk = importResult.tasks.slice(i, i + IMPORT_CHUNK_SIZE);
            const results = await Promise.allSettled(chunk.map(({ data }) => createTask(data)));
            for (const r of results) {
                if (r.status === "fulfilled") created++;
                else failed++;
            }
            setImportProgress(created + failed);
        }

        setImporting(false);
        setImportResult(null);

        if (failed > 0) {
            toast.error(`${created} tarefa(s) importada(s), ${failed} falharam`);
        } else {
            toast.success(`${created} tarefa${created === 1 ? "" : "s"} importada${created === 1 ? "" : "s"}!`);
        }
    };

    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">
            <TasksHeader 
                handleOpenCreate={handleOpenCreate} 
                handleOpenSettings={() => setSettingsOpen(true)} 
                handleOpenCustomFields={() => setCustomFieldsModalOpen(true)}
                handleDownloadTemplate={handleDownloadTemplate}
                handleImportFile={handleImportFile}
                tasks={tasks}
            />

            {/* Stats */}
            <TasksStats tasks={tasks} />

            {/* Busca + Filtros */}
            <TasksFilters
                projects={projects}
                users={users}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterAssignee={filterAssignee}
                setFilterAssignee={setFilterAssignee}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterProject={filterProject}
                setFilterProject={setFilterProject}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
            />

            {/* Conteúdo */}
            <TasksContent
                loadingTasks={loadingTasks}
                searchInput={searchInput}
                filterStatus={filterStatus}
                filterPriority={filterPriority}
                usersMap={usersMap}
                filterProject={filterProject}
                filterAssignee={filterAssignee}
                filterMonth={filterMonth}
                tasks={tasks}
                projectMap={projectMap}
                onEdit={(task) => {
                    setEditingTask(task);
                    setFormOpen(true);
                }}
                onDelete={(task) => {
                    setDeletingTask(task);
                    setDeleteOpen(true);
                }}
                onCreate={handleOpenCreate}
                visibleTasksCount={visibleTasksCount}
                loadMoreTasks={loadMoreTasks}
                settings={settings}
                selectable={canEditTasks}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectMany={handleToggleSelectMany}
            />

            <TaskCardSettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={settings}
                updateSystemSettings={updateSystemSettings}
            />

            <CustomFieldFormModal
                open={customFieldsModalOpen}
                onClose={() => setCustomFieldsModalOpen(false)}
                entity="task"
                entityLabel="Tarefas"
            />

            <TaskForm
                open={formOpen}
                projects={projects}
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

            {canEditTasks && selectedIds.size > 0 && (
                <TasksBulkBar
                    count={selectedIds.size}
                    users={users}
                    applying={bulkApplying}
                    onApply={handleBulkApply}
                    onClear={() => setSelectedIds(new Set())}
                />
            )}

            <TasksImportModal
                result={importResult}
                importing={importing}
                progress={importProgress}
                onClose={() => setImportResult(null)}
                onConfirm={handleConfirmImport}
            />
        </div>
    );
}
