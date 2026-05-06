'use client'
import CanDo from "@/components/auth/CanDo";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { MdDelete, MdEdit, MdMoreVert } from "react-icons/md";


export default function CardHeader({task, onEdit, onDelete}) {
    const [anchorEl, setAnchorEl] = useState(false)
    return (
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
    )
}
