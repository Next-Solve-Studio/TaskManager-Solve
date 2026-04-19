"use client";

import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import RoleBadge from "@/components/auth/RoleBadge";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import useIsMobile from "@/responsive/useIsMobile";

export default function ProfileSettings() {
    const { currentUser } = useAuth();
    const { updateProfile } = useSettings();
    const isMobile = useIsMobile();

    // Controle manual de estado para garantir sincronia imediata
    const [name, setName] = useState("");
    const [baseName, setBaseName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Inicializa os estados quando o usuário for carregado
    useEffect(() => {
        if (currentUser?.name) {
            setName(currentUser.name);
            setBaseName(currentUser.name);
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("O nome é obrigatório");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await updateProfile({ name: name.trim() });
            // Atualiza o baseName manualmente para o botão bloquear na hora
            setBaseName(name.trim());
        } catch (_err) {
            // Erro já tratado no contexto (toast)
        } finally {
            setIsSubmitting(false);
        }
    };

    // Logica de bloqueio do botão
    const isDirty = name.trim() !== baseName;

    return (
        <Box component="form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                    <label
                        htmlFor="CargoAtual"
                        className="text-xs font-bold uppercase tracking-wider text-white/30"
                    >
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
                    <label
                        htmlFor="InfosAccountUser"
                        className="text-xs font-bold uppercase tracking-wider text-white/30"
                    >
                        E-mail da Conta
                    </label>
                    <div className="flex flex-col pt-1">
                        <span className="text-white font-medium">
                            {currentUser?.email}
                        </span>
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
                <label
                    htmlFor="UserName"
                    className="text-xs font-bold uppercase tracking-wider text-white/30"
                >
                    Nome de Exibição
                </label>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!error}
                    helperText={error}
                    fullWidth
                    variant="outlined"
                    placeholder="Seu nome completo"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            borderRadius: "12px",
                            "& fieldset": {
                                borderColor: "rgba(255,255,255,0.05)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255,255,255,0.1)",
                            },
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
                    className={`${isMobile ? "w-full" : ""} shadow-lg shadow-brand-500/20`}
                    sx={{
                        backgroundColor: "var(--color-brand-500)",
                        "&:hover": {
                            backgroundColor: "var(--color-brand-600)",
                        },
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
