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
      PaperProps={{
        style: {
          background: "#171C23",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 16,
        },
      }}
    >
      <DialogTitle
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          paddingBottom: 8,
        }}
      >
        Excluir Projeto
      </DialogTitle>
      <DialogContent style={{ paddingTop: 0 }}>
        <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>
          Tem certeza que deseja excluir{" "}
          <span style={{ color: "#fff", fontWeight: 600 }}>
            "{project?.title}"
          </span>
          ? Esta ação não pode ser desfeita.
        </p>
      </DialogContent>
      <DialogActions style={{ padding: "8px 24px 20px", gap: 8 }}>
        <button
          onClick={onClose}
          disabled={loading}
          type="button"
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
