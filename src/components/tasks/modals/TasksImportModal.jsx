"use client";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { MdCheckCircle, MdClose, MdErrorOutline, MdFileUpload } from "react-icons/md";

export default function TasksImportModal({ result, importing, progress, onClose, onConfirm }) {
    const validCount = result?.tasks.length ?? 0;
    const errorCount = result?.errors.length ?? 0;

    return (
        <Dialog
            open={Boolean(result)}
            onClose={importing ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        background: "var(--color-bg-card)",
                        border: "1px solid var(--color-border-main2)",
                        borderRadius: "18px",
                        backgroundImage: "none",
                        color: "var(--color-text-primary)",
                    },
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
                            <MdFileUpload className="text-brand-500 text-base" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary m-0">
                                Importar planilha
                            </p>
                            <p className="text-[16px] font-extrabold text-text-primary m-0 leading-tight truncate">
                                {result?.fileName}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={importing}
                        className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg-surface cursor-pointer disabled:opacity-50"
                    >
                        <MdClose size={18} />
                    </button>
                </div>
            </DialogTitle>

            <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <div className="flex items-center gap-2 text-[13px] text-text-primary">
                    <MdCheckCircle className="text-brand-500" size={18} />
                    {validCount} tarefa{validCount === 1 ? "" : "s"} pronta{validCount === 1 ? "" : "s"} para importar
                </div>

                {errorCount > 0 && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[13px] text-error">
                            <MdErrorOutline size={18} />
                            {errorCount} linha{errorCount === 1 ? "" : "s"} com erro (serão ignoradas)
                        </div>
                        <ul className="max-h-60 overflow-y-auto m-0 pl-0 list-none flex flex-col gap-1.5 rounded-xl border border-border-main bg-bg-surface p-3">
                            {result.errors.map((err) => (
                                <li key={err.row} className="text-[12px] text-text-secondary">
                                    <span className="font-bold text-text-primary">
                                        Linha {err.row}
                                        {err.title ? ` — ${err.title}` : ""}:
                                    </span>{" "}
                                    {err.messages.join("; ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: "8px 24px 20px", gap: 1 }}>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={importing}
                    className="text-[13px] font-semibold cursor-pointer rounded-lg py-2 px-5 text-text-secondary border border-border-main bg-bg-surface hover:bg-bg-surface/60 transition-all disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={importing || validCount === 0}
                    className="text-[13px] font-bold cursor-pointer rounded-lg py-2 px-6 text-black bg-brand-500 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {importing && <CircularProgress size={13} style={{ color: "#000" }} />}
                    {importing
                        ? `Importando ${progress}/${validCount}`
                        : `Importar ${validCount} tarefa${validCount === 1 ? "" : "s"}`}
                </button>
            </DialogActions>
        </Dialog>
    );
}
