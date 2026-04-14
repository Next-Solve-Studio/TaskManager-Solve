"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import * as yup from "yup";
import { useClients } from "@/context/ClientsContext";

const schema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("E-mail inválido").nullable(),
  contato: yup.string().nullable(),
  documento: yup.string().nullable(),
  status: yup.string().oneOf(["active", "inactive"]).required(),
});

export default function ClientForm({ isOpen, onClose, client }) {
  const { createClient, updateClient } = useClients();
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      contato: client?.contato || "",
      documento: client?.documento || "",
      status: client?.status || "active",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateClient(client.id, data);
      } else {
        await createClient(data);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#ffffff !important",
      backgroundColor: "rgba(255,255,255,0.02)",
      borderRadius: "12px",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
      "&.Mui-focused fieldset": { borderColor: "var(--color-brand-500)" },
    },
    "& label": {
      color: "rgba(255,255,255,0.5)",
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    "& label.Mui-focused": { color: "var(--color-brand-500)" },
    "& .MuiFormHelperText-root": { color: "#ef4444", fontWeight: 600 },
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#121212 !important",
          backgroundImage: "none !important",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px",
          color: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle className="flex justify-between items-center py-6 px-8 border-b border-white/5">
        <span className="text-xl font-black uppercase tracking-tight text-white">
          {isEditing ? "Editar Cliente" : "Novo Cliente"}
        </span>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.2)",
            "&:hover": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          <MdClose />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 8, py: "40px !important" }}>
        <Box
          component="form"
          className="flex flex-col gap-6" // Garante um abaixo do outro com espaçamento
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            {...register("name")}
            label="Nome do Cliente ou Empresa"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            variant="outlined"
            sx={inputStyle}
          />

          <TextField
            {...register("documento")}
            label="CPF ou CNPJ (Opcional)"
            fullWidth
            error={!!errors.documento}
            helperText={errors.documento?.message}
            variant="outlined"
            sx={inputStyle}
          />

          <TextField
            {...register("email")}
            label="E-mail de Contato"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="outlined"
            sx={inputStyle}
          />

          <TextField
            {...register("contato")}
            label="Telefone / WhatsApp"
            fullWidth
            error={!!errors.contato}
            helperText={errors.contato?.message}
            variant="outlined"
            sx={inputStyle}
          />

          <TextField
            {...register("status")}
            select
            label="Status da Parceria"
            fullWidth
            defaultValue={client?.status || "active"}
            variant="outlined"
            sx={{
              ...inputStyle,
              "& .MuiSelect-icon": { color: "rgba(255,255,255,0.3)" },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: "#171717",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.875rem",
                      "&:hover": {
                        backgroundColor: "rgba(25,202,104,0.1)",
                        color: "var(--color-brand-500)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(25,202,104,0.2)",
                        color: "var(--color-brand-500)",
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="active">Ativo</MenuItem>
            <MenuItem value="inactive">Inativo</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions className="py-6 px-8 border-t border-white/5">
        <Button
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.4)",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            "&:hover": { color: "white" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          variant="contained"
          className="shadow-xl shadow-brand-500/20"
          sx={{
            backgroundColor: "var(--color-brand-500)",
            "&:hover": { backgroundColor: "var(--color-brand-600)" },
            textTransform: "none",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "0.875rem",
            px: 4,
            py: 1.5,
            color: "black",
          }}
        >
          {isSubmitting
            ? "Processando..."
            : isEditing
              ? "Salvar Alterações"
              : "Criar Cliente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
