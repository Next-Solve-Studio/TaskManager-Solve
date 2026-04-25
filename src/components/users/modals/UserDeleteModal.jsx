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
import { Avatar } from "@/components/ui/AvatarBadge";
import { useUsers } from "@/context/UsersContext";

export default function UserDeleteModal({ open, onClose, user }) {
    const { deleteUser } = useUsers(); // função para excluir user
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (!loading) onClose();
    };

    const handleConfirm = async () => {
        if (!user) return;
        setLoading(true);

        try {
            await deleteUser(user.id); // Chama a função do contexto deletar o user
            toast.success(`${user.name} foi removido!`);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir usuário: ", err);
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
                sx: {
                    background: "var(--color-bg-card)",
                    backgroundImage: "none",
                    border: "1px solid var(--color-border-main)",
                    borderRadius: "16px",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px 12px",
                    borderBottom: "1px solid var(--color-border-main)",
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
                    <span className="text-text-primary font-bold text-base">
                        Excluir Usuário
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        borderRadius: 6,
                        display: "flex",
                    }}
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                {/* User preview */}
                {user && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-surface border border-border-main">
                        <Avatar
                            name={user.name}
                            uid={user.id}
                            size={40}
                            src={user.photo}
                        />
                        <div style={{ minWidth: 0 }}>
                            <p className="text-text-primary font-bold text-sm m-0 mb-0.5">
                                {user.name}
                            </p>
                            <p className="text-text-secondary text-xs m-0 truncate">
                                {user.email}
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
                        Esta ação é <strong>irreversível</strong>. O usuário
                        perderá acesso imediato ao sistema e seus dados serão
                        removidos permanentemente.
                    </p>
                </div>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: "8px 24px 20px",
                    gap: 1,
                    borderTop: "1px solid var(--color-border-main)",
                }}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="bg-bg-surface border border-border-main text-text-secondary py-2 px-5 rounded-lg font-semibold text-xs cursor-pointer hover:bg-bg-card transition-colors"
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
