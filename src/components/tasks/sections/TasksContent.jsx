'use client'

import { MdAdd, MdOutlineTaskAlt } from 'react-icons/md';
import TaskCard from '../card/TaskCard';
import { useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/AuthContext';
import CanDo from '@/components/auth/CanDo';

export default function TasksContent({loadingTasks, searchInput, filterStatus, filterPriority,
    usersMap, filterProject, filterAssignee, tasks, projectMap, onEdit, onDelete, onCreate}) {

    const { currentUser } = useAuth();

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
                    !(t.assignedTo || []).includes(currentUser.uid)
                )
                    return false;
                if (
                    filterAssignee !== "all" &&
                    filterAssignee !== "mine" &&
                    !(t.assignedTo || []).includes(filterAssignee)
                )
                    return false;
                if (debouncedSearch) {
                    const q = debouncedSearch.toLowerCase();
                    return (
                        t.title?.toLowerCase().includes(q) ||
                        t.description?.toLowerCase().includes(q) ||
                        (t.assignedTo || []).some((uid) =>
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


    return (
        <>
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
                                onClick={onCreate}
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
                                <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {ptasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            usersMap={usersMap}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    )
}
