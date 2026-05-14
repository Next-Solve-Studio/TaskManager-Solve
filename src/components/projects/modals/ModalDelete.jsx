"use client";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { MdDelete } from "react-icons/md";

export default function ModalDelete({
    open,
    onClose,
    project,
    onConfirm,
    loading,
}) {
    return (
        <Dialog
            open={open}
            onClose={() => !loading && onClose()}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        background: "var(--color-bg-card)",
                        backgroundImage: "none",
                        border: "1px solid var(--color-border-main)",
                        borderRadius: "16px",
                    },
                }
            }}
        >
            <DialogTitle
                sx={{
                    color: "var(--color-text-primary)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    paddingBottom: 1,
                }}
            >
                Excluir Projeto
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <p className="text-text-secondary text-sm leading-relaxed m-0">
                    {`Tem certeza que deseja excluir `}
                    <span className="text-text-primary font-bold">
                        "{project?.title}"
                    </span>
                    {`? Esta ação não pode ser desfeita.`}
                </p>
            </DialogContent>
            <DialogActions sx={{ padding: "8px 24px 20px", gap: 1 }}>
                <button
                    onClick={onClose}
                    disabled={loading}
                    type="button"
                    className="bg-bg-surface border border-border-main text-text-secondary py-2 px-5 rounded-lg font-semibold text-xs cursor-pointer hover:bg-bg-card transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    type="button"
                    style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        padding: "8px 20px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? (
                        <CircularProgress size={13} style={{ color: "#fff" }} />
                    ) : (
                        <MdDelete size={15} />
                    )}
                    Excluir
                </button>
            </DialogActions>
        </Dialog>
    );
}
