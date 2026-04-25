"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { MdPerson, MdSecurity } from "react-icons/md";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import { useRole } from "@/hooks/useRole";
import ProfileSettings from "./sections/ProfileSettings";
import SecuritySettings from "./sections/SecuritySettings";
import SettingsHeader from "./sections/SettingsHeader";
import SystemSettings from "./sections/SystemSettings";

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

                <div className="bg-bg-card border border-border-main rounded-2xl overflow-hidden shadow-2xl">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        className="border-b border-border-main bg-bg-surface"
                        sx={{
                            "& .MuiTab-root": {
                                color: "var(--color-text-muted)",
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
