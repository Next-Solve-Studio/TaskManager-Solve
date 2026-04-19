import { Menu, MenuItem } from "@mui/material";
import { MdDelete, MdEdit, MdMoreVert } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { PriorityBadge, StatusBadge } from "../ProjectBadges";

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
                <p
                    style={{
                        color: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: 15,
                        lineHeight: 1.3,
                        marginBottom: 8,
                    }}
                >
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
                    className="bg-none border-none cursor-pointer p-1 flex shrink-0 rounded-md text-font-gray2 "
                >
                    <MdMoreVert size={18} className="sm:hover:text-[#e5e7eb]" />
                </button>
            </CanDo>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        background: "var(--color-bg-selected)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
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
                        color: "#e5e7eb",
                        fontSize: 13,
                        gap: "8px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            backgroundColor: "var(--color-bg-hover)",
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
                            backgroundColor: "var(--color-bg-hover)",
                        },
                    }}
                >
                    <MdDelete size={15} /> Excluir
                </MenuItem>
            </Menu>
        </div>
    );
}
