"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { MdPerson, MdSecurity } from "react-icons/md";
import { useRole } from "@/hooks/useRole";
import useIsMobile from "@/responsive/useIsMobile";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import SystemSettings from "./SystemSettings";

// Sub-componente de Header interno para evitar fragmentação
function SettingsHeader({ title, description, icon: Icon }) {
    const isMobile = useIsMobile();

    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    {Icon ? (
                        <Icon className="text-brand-500 text-lg" />
                    ) : (
                        <FiSettings className="text-brand-500 text-lg" />
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-bg-hover2">
                        Configurações
                    </span>
                </div>
                <h1
                    className={`${isMobile ? "text-xl" : "text-[26px]"} font-extrabold text-white m-0`}
                >
                    {title}
                </h1>
                {description && (
                    <p
                        className={`${isMobile ? "text-xs" : "text-[13px]"} text-font-gray2 mt-1`}
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function SettingsMain() {
    const [activeTab, setActiveTab] = useState(0);
    const { can } = useRole();
    const isMobile = useIsMobile();

    const handleTabChange = (_event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box className={isMobile ? "w-full" : "w-full max-w-4xl"}>
            <div className="space-y-6">
                <SettingsHeader
                    title="Configurações"
                    description="Gerencie suas preferências pessoais e seguranças"
                    icon={FiSettings}
                />

                <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        className="border-b border-white/5 bg-white/2"
                        sx={{
                            "& .MuiTab-root": {
                                color: "rgba(255,255,255,0.4)",
                                minHeight: isMobile ? 48 : 64,
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                                fontWeight: 600,
                                textTransform: "none",
                                gap: isMobile ? "4px" : "8px",
                                padding: isMobile ? "8px 12px" : "12px 16px",
                            },
                            "& .Mui-selected": {
                                color: "var(--color-brand-500) !important",
                            },
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
                                icon={<FiSettings className="text-xl" />}
                                label="Sistema"
                                iconPosition="start"
                            />
                        )}
                    </Tabs>

                    <Box className={isMobile ? "p-4" : "p-8"}>
                        {activeTab === 0 && <ProfileSettings />}
                        {activeTab === 1 && <SecuritySettings />}
                        {activeTab === 2 && can("canManageSystemSettings") && (
                            <SystemSettings />
                        )}
                    </Box>
                </div>
            </div>
        </Box>
    );
}
