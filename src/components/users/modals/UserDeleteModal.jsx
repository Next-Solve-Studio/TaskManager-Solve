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
import { Avatar } from "@/components/projects/ProjectBadges";
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
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            Excluir Usuário
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
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
        {/* User preview */}
        {user && (
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
            <Avatar name={user.name} uid={user.id} size={40} />
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
                {user.name}
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
            Esta ação é <strong>irreversível</strong>. O usuário perderá acesso
            imediato ao sistema e seus dados serão removidos permanentemente.
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
            boxShadow: loading ? "none" : "0 4px 14px rgba(239,68,68,0.35)",
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
