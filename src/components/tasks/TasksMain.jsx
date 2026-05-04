"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useProjects } from "@/context/ProjectsContext";
import { useTasks } from "@/context/TasksContext";
import TaskDeleteModal from "./modals/TaskDeleteModal";
import TaskForm from "./modals/TaskForm";
import TasksHeader from "./sections/TasksHeader";
import TasksStats from "./sections/TasksStats";
import TasksFilters from "./sections/TasksFilters";
import TasksContent from "./sections/TasksContent";

export default function TasksMain() {
    const { tasks, loadingTasks, createTask, updateTask, deleteTask } =
        useTasks();
    const { projects, projectMap, users, usersMap } = useProjects();

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

    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">

            <TasksHeader handleOpenCreate={handleOpenCreate} tasks={tasks}/>

            {/* Stats */}
            <TasksStats tasks={tasks}/>

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
                tasks={tasks}
                projectMap={projectMap}
                onEdit={(task) => { setEditingTask(task); setFormOpen(true); }}
                onDelete={(task) => { setDeletingTask(task); setDeleteOpen(true); }}
                onCreate={handleOpenCreate}
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
        </div>
    );
}
