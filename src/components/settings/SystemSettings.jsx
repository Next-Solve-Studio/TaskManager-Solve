"use client";

import { Box, Switch } from "@mui/material";
import { MdWarningAmber } from "react-icons/md";
import { useSettings } from "@/context/SettingsContext";

export default function SystemSettings() {
  const { systemSettings } = useSettings();

  return (
    <Box className="space-y-8">
      <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 flex gap-4 items-center">
        <MdWarningAmber className="text-orange-400 text-2xl shrink-0" />
        <p className="text-orange-400/80 text-sm font-medium">
          Atenção: Estas configurações afetam globalmente o comportamento do
          sistema para todos os usuários.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-white font-bold text-lg">Parâmetros de Controle</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
            <div className="space-y-1">
              <p className="text-white text-sm font-bold">Modo de Manutenção</p>
              <p className="text-white/30 text-xs">
                Bloquear acesso de não-admins.
              </p>
            </div>
            <Switch
              color="primary"
              disabled
              checked={systemSettings?.maintenanceMode || false}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--color-brand-500)",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--color-brand-500)",
                },
              }}
            />
          </div>

          <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
            <div className="space-y-1">
              <p className="text-white text-sm font-bold">Novos Registros</p>
              <p className="text-white/30 text-xs">
                Habilitar criação de novas contas.
              </p>
            </div>
            <Switch
              color="primary"
              disabled
              checked={systemSettings?.allowRegistration || true}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--color-brand-500)",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--color-brand-500)",
                },
              }}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}
