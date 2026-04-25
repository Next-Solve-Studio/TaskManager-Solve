"use client";

import { Box, Button, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MdDarkMode, MdEdit, MdLightMode } from "react-icons/md";
import RoleBadge from "@/components/auth/RoleBadge";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import useIsTablet from "@/hooks/responsive/useIsTablet";
import { switchStyles } from "@/styles/StyleSwitch";

export default function ProfileSettings() {
    const { currentUser } = useAuth();
    const { updateProfile } = useSettings();
    const { theme, toggleTheme } = useTheme();
    const isMobile = useIsMobile();
    const isTablet = useIsTablet(1024);

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
            {/* Preferências de Tema */}
            <div className="space-y-4">
                <label
                    htmlFor="theme-color"
                    className="text-xs font-bold uppercase tracking-wider text-text-muted"
                >
                    Preferências de Exibição
                </label>
                <div
                    className={`p-5 bg-bg-card rounded-2xl border border-border-main flex items-center justify-between group hover:border-brand-500/30 transition-colors ${isTablet ? "flex-col gap-4" : "flex-row"}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                            {theme === "dark" ? (
                                <MdDarkMode className="text-brand-500 text-xl" />
                            ) : (
                                <MdLightMode className="text-brand-500 text-xl" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-text-primary text-sm font-bold">
                                Tema do Sistema
                            </p>
                            <p className="text-text-secondary text-xs">
                                Alternar entre modo claro e escuro.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-text-secondary text-sm">Escuro</p>
                        <Switch
                            color="primary"
                            checked={theme === "light"}
                            onChange={toggleTheme}
                            sx={switchStyles}
                        />
                        <p className="text-text-secondary text-sm">Claro</p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border-main w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                    <label
                        htmlFor="CargoAtual"
                        className="text-xs font-bold uppercase tracking-wider text-text-muted"
                    >
                        Cargo Atual
                    </label>
                    <div className="pt-1">
                        <RoleBadge role={currentUser?.role} />
                    </div>
                    <p className="text-[11px] text-text-muted mt-2">
                        Suas permissões são definidas pelo administrador.
                    </p>
                </div>

                <div className="space-y-1">
                    <label
                        htmlFor="InfosAccountUser"
                        className="text-xs font-bold uppercase tracking-wider text-text-muted"
                    >
                        E-mail da Conta
                    </label>
                    <div className="flex flex-col pt-1">
                        <span className="text-text-primary font-medium">
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

            <div className="h-px bg-border-main w-full" />

            <div className="max-w-md space-y-2">
                <label
                    htmlFor="UserName"
                    className="text-xs font-bold uppercase tracking-wider text-text-muted"
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
                            color: "var(--color-text-primary)",
                            backgroundColor: "var(--color-border-subtle)",
                            borderRadius: "12px",
                            "& fieldset": {
                                borderColor: "var(--color-border-main)",
                            },
                            "&:hover fieldset": {
                                borderColor:
                                    "rgba(var(--color-brand-500-rgb), 0.3)",
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
                            backgroundColor: "var(--color-border-subtle)",
                            color: "var(--color-text-muted)",
                            border: "1px solid var(--color-border-main)",
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
