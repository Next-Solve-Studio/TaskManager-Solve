'use client'
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import { useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { MdOutlineFilterList, MdSearch } from "react-icons/md";


export default function TasksFilters({projects, users, searchInput,filterStatus, filterPriority, filterAssignee, filterProject, setFilterStatus, setFilterPriority, setFilterProject, setFilterAssignee, setSearchInput }) {
    const [showFilters, setShowFilters] = useState(false);

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
                                onClick={clearFilters}
                                type="button"
                                className="flex items-center gap-1 bg-error/10 text-error cursor-pointer text-[12px] font-semibold border border-error/20 rounded-lg p-2"
                                aria-label="Limpar filtros"
                            >
                                <AiOutlineClear className="text-xl" />
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
    )
}
