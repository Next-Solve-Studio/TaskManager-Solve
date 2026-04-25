import { Menu, MenuItem } from "@mui/material";
import { MdDelete, MdEdit, MdMoreVert } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";

export default function CardHeader({
    project,
    onEdit,
    setAnchorEl,
    anchorEl,
    onDelete,
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
            }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <p className="text-text-primary font-bold text-[15px] leading-tight mb-2">
                    {project.title}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                </div>
            </div>

            <CanDo permission="canEditProjects">
                <button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    type="button"
                    className="bg-none border-none cursor-pointer p-1 flex shrink-0 rounded-md text-text-muted hover:text-text-primary transition-colors"
                >
                    <MdMoreVert size={18} />
                </button>
            </CanDo>

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
                        onEdit(project);
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
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        onDelete(project);
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
            </Menu>
        </div>
    );
}
