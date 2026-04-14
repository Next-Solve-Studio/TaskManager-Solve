"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { MdPerson, MdSecurity, MdSettings } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useRole } from "@/hooks/useRole";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import SystemSettings from "./SystemSettings";

export default function SettingsMain() {
  const [activeTab, setActiveTab] = useState(0);
  const { can } = useRole();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="w-full max-w-4xl">
      <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          className="border-b border-white/5 bg-white/[0.02]"
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255,255,255,0.4)",
              minHeight: 64,
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              gap: "8px",
            },
            "& .Mui-selected": { color: "var(--color-brand-500) !important" },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--color-brand-500)",
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab
            icon={<MdPerson className="text-xl" />}
            label="Perfil"
            iconPosition="start"
          />
          <Tab
            icon={<MdSecurity className="text-xl" />}
            label="Segurança"
            iconPosition="start"
          />
          {can("canManageSystemSettings") && (
            <Tab
              icon={<MdSettings className="text-xl" />}
              label="Sistema"
              iconPosition="start"
            />
          )}
        </Tabs>

        <Box className="p-8">
          {activeTab === 0 && <ProfileSettings />}
          {activeTab === 1 && <SecuritySettings />}
          {activeTab === 2 && can("canManageSystemSettings") && (
            <SystemSettings />
          )}
        </Box>
      </div>
    </Box>
  );
}
