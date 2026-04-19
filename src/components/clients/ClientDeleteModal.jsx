"use client";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { MdClose, MdDelete, MdWarning } from "react-icons/md";
import { toast } from "sonner";
import { useClients } from "@/context/ClientsContext";

export default function ClientDeleteModal({ open, onClose, client }) {
    const { deleteClient } = useClients();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (!loading) onClose();
    };

    const handleConfirm = async () => {
        if (!client) return;
        setLoading(true);

        try {
            await deleteClient(client.id);
            toast.success(`${client.name} foi removido!`);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir cliente");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    background: "#171C23",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 16,
                    boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(239,68,68,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MdDelete style={{ color: "#ef4444", fontSize: 17 }} />
                    </div>
                    <span
                        style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}
                    >
                        Excluir Cliente
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    className="hover:brightness-150"
                    disabled={loading}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: 4,
                        borderRadius: 6,
                        display: "flex",
                    }}
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>

            <DialogContent
                style={{
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                {/* Client preview */}
                {client && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 14px",
                            borderRadius: 10,
                            background: "rgba(239,68,68,0.05)",
                            border: "1px solid rgba(239,68,68,0.12)",
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "rgba(25, 202, 104, 0.1)",
                                border: "1px solid rgba(25, 202, 104, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#19CA68",
                                fontWeight: 700,
                                fontSize: 16,
                            }}
                        >
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p
                                style={{
                                    color: "#f1f5f9",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    margin: 0,
                                    marginBottom: 2,
                                }}
                            >
                                {client.name}
                            </p>
                            <p
                                style={{
                                    color: "#6b7280",
                                    fontSize: 12,
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {client.email}
                            </p>
                        </div>
                    </div>
                )}

                {/* Warning */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.2)",
                    }}
                >
                    <MdWarning
                        style={{
                            color: "#f59e0b",
                            fontSize: 16,
                            flexShrink: 0,
                            marginTop: 1,
                        }}
                    />
                    <p
                        style={{
                            color: "#fbbf24",
                            fontSize: 12,
                            margin: 0,
                            lineHeight: 1.55,
                        }}
                    >
                        Esta ação é <strong>irreversível</strong>. Todos os
                        dados da parceria com este cliente serão removidos
                        permanentemente do sistema.
                    </p>
                </div>
            </DialogContent>

            <DialogActions
                style={{
                    padding: "8px 24px 20px",
                    gap: 8,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#9ca3af",
                        padding: "8px 20px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                    style={{
                        background: loading
                            ? "rgba(239,68,68,0.4)"
                            : "linear-gradient(135deg, #ef4444, #dc2626)",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        padding: "8px 24px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: loading
                            ? "none"
                            : "0 4px 14px rgba(239,68,68,0.35)",
                        opacity: loading ? 0.7 : 1,
                        transition: "all 0.2s",
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
