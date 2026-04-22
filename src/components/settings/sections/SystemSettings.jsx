"use client";

import { Box, Switch } from "@mui/material";
import { useState } from "react";
import { MdWarningAmber } from "react-icons/md";
import { useSettings } from "@/context/SettingsContext";
import useIsMobile from "@/responsive/useIsMobile";
import { toast } from "sonner";
import { switchStyles } from "@/utils/StyleSwitch";
export default function SystemSettings() {
    const { systemSettings, updateSystemSettings } = useSettings();
    const isMobile = useIsMobile();
    const [loadingField, setLoadingField] = useState(null);

    const handleToggle = async (field, value) => {
        setLoadingField(field);
        try {
            await updateSystemSettings({ [field]: value });
        } catch (error) {
            console.error(`Erro ao atualizar ${field}:`, error);
            toast.error(`Erro ao atualizar ${field}:`, error)
        } finally {
            setLoadingField(null);
        }
    };

    return (
        <Box className={`space-y-8 w-full`}>
            <div
                className={`bg-orange-500/5 border border-orange-500/20 rounded-2xl ${isMobile ? "p-4 flex-col text-center" : "p-6"} flex items-center gap-4`}
            >
                <MdWarningAmber
                    className={`text-orange-400 ${isMobile ? "text-2xl" : "text-3xl"} shrink-0`}
                />
                <div
                    className={`space-y-1 ${isMobile ? "text-center" : "text-left"}`}
                >
                    <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">
                        Atenção: Configurações Globais
                    </h3>
                    <p className="text-orange-400/80 text-xs leading-relaxed">
                        Estas configurações afetam globalmente o comportamento
                        do sistema para todos os usuários.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-white font-bold text-lg">
                    Parâmetros de Controle
                </h3>

                <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}
                >
                    <div className="p-5 bg-white/2 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                        <div className="space-y-1">
                            <p className="text-white text-sm font-bold">
                                Modo de Manutenção
                            </p>
                            <p className="text-white/30 text-xs">
                                Bloquear acesso de não-admins.
                            </p>
                        </div>
                        <Switch
                            color="primary"
                            disabled={loadingField === "maintenanceMode"}
                            checked={systemSettings?.maintenanceMode || false}
                            onChange={(e) =>
                                handleToggle(
                                    "maintenanceMode",
                                    e.target.checked,
                                )
                            }
                            sx={switchStyles}
                        />
                    </div>

                    <div className="p-5 bg-white/2 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                        <div className="space-y-1">
                            <p className="text-white text-sm font-bold">
                                Novos Registros
                            </p>
                            <p className="text-white/30 text-xs">
                                Habilitar criação de novas contas.
                            </p>
                        </div>
                        <Switch
                            color="primary"
                            disabled={loadingField === "allowRegistration"}
                            checked={systemSettings?.allowRegistration ?? true}
                            onChange={(e) =>
                                handleToggle(
                                    "allowRegistration",
                                    e.target.checked,
                                )
                            }
                            sx={switchStyles}
                        />
                    </div>
                </div>
            </div>
        </Box>
    );
}
