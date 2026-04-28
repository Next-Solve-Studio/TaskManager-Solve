'use client'
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    MdAdd,
    MdOutlineFilterList,
    MdOutlineTaskAlt,
    MdSearch,
} from "react-icons/md";
import { TasksProvider, useTasks } from "@/context/TasksContext";
import { STATUS_MAP, PRIORITY_MAP } from "../ui/StatusBadge"
import { useDebounce } from "@/hooks/useDebounce";
import { useProjects } from "@/context/ProjectsContext";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import CanDo from "../auth/CanDo";

export default function TasksMain() {
    const {tasks, loadingTasks, createTask, updateTask, deleteTask} = useTasks()
    const {projects, projectMap, users, usersMap} = useProjects()
    const {currentUser} = useAuth()
    const {role} = useRole()

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
    const debouncedSearch = useDebounce(searchInput, 300)

    const filtered = useMemo(() => {
        return tasks.filter((t)=> {
            //se o status nao for "all", e o status atual da task, for diferente do filtro, a task some
            if (filterStatus !== "all" && t.status !== filterStatus) return false
            if (filterPriority !== "all" && t.priority !== filterPriority) return false
            if (filterProject !== "all" && t.projectId !== filterProject) return false
            if (filterAssignee ===  "mine" && !(t.assigneTo || []).includes(currentUser.uid)) return false
            if (filterAssignee !== "all" && filterAssignee !== "mine" && !(t.assigneTo || []).includes(filterAssignee)) return false
            if (debouncedSearch) {
                const q = debouncedSearch.toLowerCase()
                return (
                    t.title?.toLowerCase().includes(q) ||
                    t.description?.toLowerCase().includes(q) ||
                    (t.assigneTo || []).some((uid) => usersMap[uid]?.name?.toLowerCase().includes(q)) ||
                    projectMap[t.projectId]?.title?.toLowerCase().includes(q)
                )
            }
            return true
        })
    }, [tasks, filterStatus, filterPriority, filterProject, filterAssignee, debouncedSearch, usersMap, projectMap, currentUser]);

    const stats = useMemo(() => ({
        total: tasks.length,
        done: tasks.filter((t) => t.status === "concluido").length,
        inProgress: tasks.filter((t) => t.status === "em_andamento").length,
        pending: tasks.filter((t) => t.status === "pendente").length,
    }), [tasks])

    const groupedByProject = useMemo(() => {
        const map = {}
        filtered.forEach((t) => {
            const pid = t.projectId || "__sem_projeto__"
            if (!map[pid]) map[pid] = []
            map[pid].push(t)
        })
        return Object.entries(map)
    }, [filtered])

    return (
        <div>TasksMain</div>
    )
}
