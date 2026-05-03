"use client";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";

export default function TaskDeleteModal({ open, onClose, task, onConfirm, loading }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border-main2)",
                    borderRadius: "18px",
                    backgroundImage: "none",
                    color: "var(--color-text-primary)",
                },
            }}
        >
            <DialogTitle>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-error/15 flex items-center justify-center">
                        <MdDeleteOutline className="text-error text-base" />
                    </div>
                    <p className="text-[16px] font-extrabold text-text-primary m-0">
                        Excluir Tarefa
                    </p>
                </div>
            </DialogTitle>
            <DialogContent>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                    Tem certeza que deseja excluir a tarefa{" "}
                    <span className="text-text-primary font-semibold">
                        &quot;{task?.title}&quot;
                    </span>
                    ? Esta ação não pode ser desfeita.
                </p>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-surface border border-border-main2 transition-all cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-5 py-2 rounded-xl text-[13px] font-bold bg-error hover:bg-error/80 text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <CircularProgress size={13} sx={{ color: "white" }} />}
                    Excluir
                </button>
            </DialogActions>
        </Dialog>
    );
}
