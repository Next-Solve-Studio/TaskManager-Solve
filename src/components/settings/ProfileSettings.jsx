"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import * as yup from "yup";
import RoleBadge from "@/components/auth/RoleBadge";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

const schema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
});

export default function ProfileSettings() {
  const { currentUser } = useAuth();
  const { updateProfile } = useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: currentUser?.name || "",
    },
  });

  const onSubmit = async (data) => {
    await updateProfile(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-white/30">
            Cargo Atual
          </label>
          <div className="pt-1">
            <RoleBadge role={currentUser?.role} />
          </div>
          <p className="text-[11px] text-white/20 mt-2">
            Suas permissões são definidas pelo administrador.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-white/30">
            E-mail da Conta
          </label>
          <div className="flex flex-col pt-1">
            <span className="text-white font-medium">{currentUser?.email}</span>
            {currentUser?.authMethod === "google" && (
              <span className="text-[10px] text-brand-500 font-bold uppercase mt-1">
                Autenticado via Google
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      <div className="max-w-md space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-white/30">
          Nome de Exibição
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          variant="outlined"
          placeholder="Seu nome completo"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.05)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-brand-500)",
              },
            },
            "& .MuiFormHelperText-root": { color: "#ef4444" },
          }}
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !isDirty}
          startIcon={<MdEdit />}
          className="shadow-lg shadow-brand-500/20"
          sx={{
            backgroundColor: "var(--color-brand-500)",
            "&:hover": { backgroundColor: "var(--color-brand-600)" },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.05)",
            },
            textTransform: "none",
            borderRadius: "12px",
            color: "black",
            fontWeight: 700,
            fontSize: "0.875rem",
            py: 1.5,
            px: 4,
          }}
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </Box>
  );
}
