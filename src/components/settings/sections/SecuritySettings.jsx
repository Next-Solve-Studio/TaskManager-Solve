"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { MdInfoOutline, MdLock } from "react-icons/md";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import { muiDark } from "@/styles/StyleInputs";
import { useState } from "react";
import ShowPassword from "@/components/ui/Buttons/ShowPassword";

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
    const [seePassword, setSeePassword] = useState(false)
    const [seePassword2, setSeePassword2] = useState(false)
    const [seePassword3, setSeePassword3] = useState(false)
    const { currentUser } = useAuth();
    const { changePassword } = useSettings();
    const isMobile = useIsMobile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await changePassword(data.currentPassword, data.newPassword);
            reset();
        } catch (err) {
            console.error("erro ao mudar de senha: ", err);
        }
    };

    if (currentUser?.authMethod === "google") {
        return (
            <div
                className={`bg-cyan-500/5 border border-cyan-500/20 rounded-2xl ${isMobile ? "p-4 flex-col text-center" : "p-6"} flex items-center gap-4`}
            >
                <MdInfoOutline
                    className={`text-cyan-400 ${isMobile ? "text-2xl" : "text-3xl"} shrink-0`}
                />
                <div
                    className={`space-y-1 ${isMobile ? "text-center" : "text-left"}`}
                >
                    <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">
                        Autenticação Social Ativa
                    </h3>
                    <p className="text-cyan-400/70 text-xs leading-relaxed">
                        Você está autenticado através do Google. Para sua
                        segurança, a senha deve ser gerenciada diretamente nas
                        configurações da sua conta Google.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-6 ${isMobile ? "w-full" : "max-w-md"}`}
        >
            <div className="space-y-1.5">
                <label
                    htmlFor="currentPassword"
                    className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1"
                >
                    Senha Atual
                </label>
                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("currentPassword")}
                        type={seePassword ? "text" : "password"}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword?.message}
                        fullWidth
                        variant="outlined"
                        sx={muiDark}
                    />
                    <ShowPassword setSeePassword={setSeePassword} seePassword={seePassword}/>
                </div>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="newPassword"
                    className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1"
                >
                    Nova Senha
                </label>
                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("newPassword")}
                        type={seePassword2 ? "text" : "password"}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                        fullWidth
                        variant="outlined"
                        sx={muiDark}
                    />
                    <ShowPassword setSeePassword={setSeePassword2} seePassword={seePassword2}/>
                </div>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1"
                >
                    Confirmar Nova Senha
                </label>
                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("confirmPassword")}
                        type={seePassword3 ? "text" : "password"}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        fullWidth
                        variant="outlined"
                        sx={muiDark}
                    />
                    <ShowPassword setSeePassword={setSeePassword3} seePassword={seePassword3}/>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isDirty}
                    startIcon={<MdLock />}
                    className={`${isMobile ? "w-full" : ""} shadow-lg shadow-brand-500/20`}
                    sx={{
                        height: "44px",
                        px: 3,
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        color: "white",
                        background: "linear-gradient(to right, var(--color-brand-700), var(--color-brand-600))",
                        boxShadow: "0 4px 20px rgba(26, 215, 111, 0.3)",
                        transition: "all 150ms ease-in-out",
                        cursor: "pointer",
                        "&:hover": {
                            background: "linear-gradient(to right, var(--color-brand-700), var(--color-brand-600))",
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 24px rgba(26, 215, 111, 0.4)",
                        },

                        "&:active": {
                            transform: "scale(0.97)",
                        },

                        "&.Mui-disabled": {
                            opacity: 0.5,
                            color: "white",
                            cursor: "not-allowed",
                            pointerEvents: "auto",
                            boxShadow: "none", 
                        }
                    }}
                >
                    {isSubmitting ? "Alterando..." : "Alterar Senha"}
                </Button>
            </div>
        </Box>
    );
}
