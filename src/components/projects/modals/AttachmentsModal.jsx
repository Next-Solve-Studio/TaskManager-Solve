"use client";
import { useRef, useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import {
    MdClose, MdUpload, MdDownload, MdDelete,
    MdPictureAsPdf, MdTableChart, MdDescription,
    MdTextSnippet, MdInsertDriveFile,
} from "react-icons/md";
import { useProjectAttachments } from "@/hooks/useProjectAttachments";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/roles";

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts) {
    if (!ts) return "";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function FileIcon({ type }) {
    if (type === "application/pdf")
        return <MdPictureAsPdf size={22} className="text-red-400 shrink-0" />;
    if (type?.includes("word") || type?.includes("rtf") || type?.includes("opendocument.text"))
        return <MdDescription size={22} className="text-blue-400 shrink-0" />;
    if (type?.includes("excel") || type?.includes("spreadsheet") || type === "text/csv")
        return <MdTableChart size={22} className="text-green-400 shrink-0" />;
    if (type?.includes("powerpoint") || type?.includes("presentation"))
        return <MdInsertDriveFile size={22} className="text-orange-400 shrink-0" />;
    return <MdTextSnippet size={22} className="text-text-muted shrink-0" />;
}

export default function AttachmentsModal({ project, open, onClose }) {
    const { currentUser } = useAuth();
    const { attachments, uploading, error, upload, download, remove, setError } =
        useProjectAttachments(project.id, project.companyId);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFiles = useCallback(async (files) => {
        for (const file of Array.from(files)) await upload(file);
    }, [upload]);

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const canDelete = (att) =>
        att.uploadedBy === currentUser?.uid || currentUser?.role === ROLES.ADMIN;

    return (
         <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            elevation={0}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(4px)",
                    },
                },
                paper: {
                    sx: {
                        background: "var(--color-bg-card)",
                        backgroundImage: "none",
                        border: "1px solid var(--color-border-main)",
                        borderRadius: "20px",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
                        maxHeight: "85vh",
                    },
                },
            }}
        >
            <DialogTitle sx={{ p: 0 }}>
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-text-primary m-0">Anexos</h2>
                        <p className="text-xs text-text-muted mt-0.5 truncate m-0">{project.title}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-text-muted">
                            {attachments.length} arquivo{attachments.length !== 1 ? "s" : ""}
                        </span>
                        <button type="button" onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                            <MdClose size={18} />
                        </button>
                    </div>
                </div>
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Upload zone */}
                <div className="p-4 border-b border-white/5">
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        onClick={() => !uploading && inputRef.current?.click()}
                        className="rounded-xl border-2 border-dashed flex flex-col items-center gap-1.5 py-6 transition-all"
                        style={{
                            borderColor: dragging ? "#19CA68" : "rgba(255,255,255,0.1)",
                            background: dragging ? "rgba(25,202,104,0.06)" : "rgba(255,255,255,0.02)",
                            cursor: uploading ? "not-allowed" : "pointer",
                        }}
                    >
                        <MdUpload size={28} style={{ color: dragging ? "#19CA68" : "var(--color-text-muted)" }} />
                        <p className="text-sm text-text-secondary m-0">
                            {uploading ? "Enviando..." : "Arraste ou clique para enviar"}
                        </p>
                        <p className="text-xs text-text-muted m-0">PDF, DOC, XLS, PPT, TXT, CSV · máx. 10 MB</p>
                        <input
                            ref={inputRef} type="file" className="hidden" multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.odt,.ods"
                            onChange={e => handleFiles(e.target.files)}
                        />
                    </div>
                    {error && (
                        <div className="text-xs text-red-400 mt-2 text-center"
                            onClick={() => setError(null)} style={{ cursor: "pointer" }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Lista de arquivos */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {attachments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                            <MdInsertDriveFile size={38} className="mb-2 opacity-25" />
                            <p className="text-sm m-0">Nenhum arquivo anexado</p>
                        </div>
                    ) : (
                        attachments.map(att => (
                            <div key={att.id}
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                }}>
                                <FileIcon type={att.type} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate m-0">{att.name}</p>
                                    <p className="text-xs text-text-muted m-0">
                                        {formatSize(att.size)} · {att.uploadedByName} · {formatDate(att.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <button type="button" onClick={() => download(att)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-brand-500 hover:bg-white/5 transition-colors">
                                        <MdDownload size={17} />
                                    </button>
                                    {canDelete(att) && (
                                        <button type="button" onClick={() => remove(att)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-white/5 transition-colors">
                                            <MdDelete size={17} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}