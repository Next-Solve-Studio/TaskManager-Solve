"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { MdInfoOutline, MdLock } from "react-icons/md";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Senha atual é obrigatória"),
  newPassword: yup
    .string()
    .min(6, "Mínimo de 6 caracteres")
    .required("Nova senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
    .required("Confirme a nova senha"),
});

export default function SecuritySettings() {
  const { currentUser } = useAuth();
  const { changePassword } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      reset();
    } catch (err) {
      // Erro já tratado no contexto (toast)
    }
  };

  if (currentUser?.authMethod === "google") {
    return (
      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 flex gap-4 items-start">
        <MdInfoOutline className="text-cyan-400 text-2xl shrink-0" />
        <div className="space-y-1">
          <h3 className="text-cyan-400 font-bold">Autenticação Social Ativa</h3>
          <p className="text-cyan-400/70 text-sm leading-relaxed">
            Você está autenticado através do Google. Para sua segurança, a senha
            deve ser gerenciada diretamente nas configurações da sua conta
            Google.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md"
    >
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-white/30 ml-1">
          Senha Atual
        </label>
        <TextField
          {...register("currentPassword")}
          type="password"
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.05)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-brand-500)",
              },
            },
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-white/30 ml-1">
          Nova Senha
        </label>
        <TextField
          {...register("newPassword")}
          type="password"
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.05)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-brand-500)",
              },
            },
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-white/30 ml-1">
          Confirmar Nova Senha
        </label>
        <TextField
          {...register("confirmPassword")}
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.05)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-brand-500)",
              },
            },
          }}
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={<MdLock />}
          className="shadow-lg shadow-brand-500/20"
          sx={{
            backgroundColor: "var(--color-brand-500)",
            "&:hover": { backgroundColor: "var(--color-brand-600)" },
            textTransform: "none",
            borderRadius: "12px",
            fontWeight: 700,
            py: 1.5,
            px: 4,
          }}
        >
          {isSubmitting ? "Alterando..." : "Alterar Senha"}
        </Button>
      </div>
    </Box>
  );
}
