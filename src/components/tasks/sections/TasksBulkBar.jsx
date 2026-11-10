"use client";
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { STATUS_MAP } from "@/components/ui/badges/StatusBadge";
import { menuPaper, muiDark } from "@/styles/StyleInputs";

const CLEAR_ASSIGNEES = "__clear__";

export default function TasksBulkBar({ count, users, applying, onApply, onClear }) {
    const [status, setStatus] = useState("");
    const [assignee, setAssignee] = useState("");
    const hasChange = Boolean(status || assignee);

    const handleApply = () => {
        onApply({
            status: status || undefined,
            addAssignee:
                assignee && assignee !== CLEAR_ASSIGNEES ? assignee : undefined,
            clearAssignees: assignee === CLEAR_ASSIGNEES,
        });
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] bg-bg-card border border-border-main2 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap justify-center">
            <span className="text-[13px] font-bold text-text-primary whitespace-nowrap">
                {count} selecionada{count === 1 ? "" : "s"}
            </span>

            <FormControl size="small" sx={{ ...muiDark, minWidth: 170 }}>
                <InputLabel id="bulk-status-label">Alterar status</InputLabel>
                <Select
                    labelId="bulk-status-label"
                    label="Alterar status"
                    MenuProps={menuPaper}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={applying}
                >
                    <MenuItem value="">Não alterar</MenuItem>
                    {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ ...muiDark, minWidth: 210 }}>
                <InputLabel id="bulk-assignee-label">Adicionar responsável</InputLabel>
                <Select
                    labelId="bulk-assignee-label"
                    label="Adicionar responsável"
                    MenuProps={menuPaper}
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    disabled={applying}
                >
                    <MenuItem value="">Não alterar</MenuItem>
                    {users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                            {u.name}
                        </MenuItem>
                    ))}
                    <MenuItem
                        value={CLEAR_ASSIGNEES}
                        sx={{ color: "var(--color-error)" }}
                    >
                        Remover todos os responsáveis
                    </MenuItem>
                </Select>
            </FormControl>

            <button
                type="button"
                onClick={handleApply}
                disabled={!hasChange || applying}
                className="text-[13px] font-bold cursor-pointer rounded-lg py-2 px-5 text-black bg-brand-500 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {applying && <CircularProgress size={13} style={{ color: "#000" }} />}
                Aplicar
            </button>

            <button
                type="button"
                onClick={onClear}
                disabled={applying}
                className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg-surface cursor-pointer disabled:opacity-50"
                title="Limpar seleção"
            >
                <MdClose size={18} />
            </button>
        </div>
    );
}
