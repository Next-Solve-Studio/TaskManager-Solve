"use client";
import { memo, useState } from "react";
import {
    MdCheckCircleOutline,
    MdEdit,
    MdMoreVert,
    MdOutlineChecklist,
    MdOutlineCalendarToday,
    MdPerson,
    MdDelete,
} from "react-icons/md";
import { useTasks } from "@/context/TasksContext";
import { Avatar } from "@/components/ui/AvatarBadge";
import { StatusBadge, PriorityBadge } from "@/components/ui/StatusBadge";
import { formatDateInput } from "@/utils/FormatDateProjects";
import CanDo from "@/components/auth/CanDo";
import { Menu, MenuItem } from "@mui/material";

function TaskCard({ task, usersMap, onEdit, onDelete}) {
    const { updateChecklist } = useTasks()
    const [anchorEl, setAnchorEl] = useState(false)

    const checklist = task.checklist || [];
    const doneCount = checklist.filter((i) => i.done).length;
    const progress = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

    const assignedUsers = (task.assignedTo || [])
        .map((uid) => usersMap[uid])
        .filter(Boolean)

    const toggleItem = async (id) => {
        const updated = checklist.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item,
        );
        await updateChecklist(task.id, updated);
    };

    const isOverdue =
        task.endDate &&
        task.status !== "concluido" &&
        new Date((task.endDate?.toDate ? task.endDate.toDate() : new Date(task.endDate))) < new Date();

    return (
        <div className="bg-bg-card border border-border-main2 rounded-xl p-4 flex flex-col gap-3 
        hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 select-none
        max-w-130 ">
            {/* Header */}
            <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                    </div>
                    <h3 className="text-[14px] font-bold text-text-primary leading-snug truncate">
                        {task.title}
                    </h3>
                </div>

                {/* Actions menu */}
                    <div className="relative">
                            <button
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                type="button"
                                className="bg-none border-none cursor-pointer p-1 flex shrink-0 rounded-md text-text-muted hover:text-text-primary transition-colors"
                            >
                                <MdMoreVert size={18} />
                            </button>
            
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{
                                sx: {
                                    background: "var(--color-bg-card)",
                                    backgroundImage: "none",
                                    border: "1px solid var(--color-border-main)",
                                    borderRadius: "10px",
                                    boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                                    minWidth: 140,
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    onEdit(task);
                                }}
                                sx={{
                                    color: "var(--color-text-primary)",
                                    fontSize: 13,
                                    gap: "8px",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "var(--color-border-subtle)",
                                    },
                                }}
                            >
                                <MdEdit size={15} className="text-cyan-400" /> Editar
                            </MenuItem>
                            <CanDo permission="canDeleteTasks">
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        onDelete(task);
                                    }}
                                    sx={{
                                        color: "var(--color-error)",
                                        fontSize: 13,
                                        gap: "8px",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: "var(--color-border-subtle)",
                                        },
                                    }}
                                >
                                    <MdDelete size={15} /> Excluir
                                </MenuItem>
                            </CanDo>
                        </Menu>
                    </div>
            </div>

            {/* Descrição */}
            {task.description && (
                <p className="text-[12px] text-text-secondary leading-relaxed">
                    {task.description.length > 90
                        ? `${task.description.slice(0, 90)}…`
                        : task.description}
                </p>
            )}

            {/* Checklist progress */}
            {checklist.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MdOutlineChecklist className="text-text-muted text-sm" />
                            <span className="text-[11px] text-text-muted">
                                {doneCount}/{checklist.length}
                            </span>
                        </div>
                        <span className="text-[10px] text-text-muted">{progress}%</span>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {/* Items do checklist (máx 3 visíveis) */}
                    <div className="flex flex-col gap-1">
                        {checklist.slice(0, 3).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className="flex items-center gap-2 text-left group cursor-pointer"
                            >
                                <MdCheckCircleOutline
                                    size={14}
                                    className={`shrink-0 transition-colors ${
                                        item.done
                                            ? "text-brand-500"
                                            : "text-text-muted group-hover:text-text-secondary"
                                    }`}
                                />
                                <span
                                    className={`text-[11px] ${
                                        item.done
                                            ? "line-through text-text-muted"
                                            : "text-text-secondary group-hover:text-text-primary"
                                    }`}
                                >
                                    {item.text}
                                </span>
                            </button>
                        ))}
                        {checklist.length > 3 && (
                            <span className="text-[10px] text-text-muted pl-5">
                                +{checklist.length - 3} itens...
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Footer: responsáveis + datas */}
            <div className="flex items-center justify-between pt-1 border-t border-border-main2/50">
                {/* Avatares dos responsáveis */}
                <div className="flex items-center -space-x-1.5">
                    {assignedUsers.length === 0 ? (
                        <div className="flex items-center gap-1 text-text-muted">
                            <MdPerson size={13} />
                            <span className="text-[11px]">Sem responsável</span>
                        </div>
                    ) : (
                        assignedUsers.slice(0, 3).map((u) => (
                            <div key={u.id} title={u.name}>
                                <Avatar
                                    name={u.name}
                                    uid={u.id}
                                    size={26}
                                    src={u.photo}
                                />
                            </div>
                        ))
                    )}
                    {assignedUsers.length > 3 && (
                        <span className="text-[10px] text-text-muted ml-2">
                            +{assignedUsers.length - 3}
                        </span>
                    )}
                </div>

                {/* Datas */}
                {(task.startDate || task.endDate) && (
                    <div
                        className={`flex items-center gap-1 text-[10px] ${
                            isOverdue ? "text-error" : "text-text-muted"
                        }`}
                    >
                        <MdOutlineCalendarToday size={11} />
                        <span>
                            {formatDateInput(task.startDate)}
                            {task.startDate && task.endDate && " → "}
                            {formatDateInput(task.endDate)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(TaskCard);