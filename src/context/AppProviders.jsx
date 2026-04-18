"use client";
import { ClientsProvider } from "./ClientsContext";
import { ProjectsProvider } from "./ProjectsContext";
import { ScheduleProvider } from "./ScheduleContext";
import { SettingsProvider } from "./SettingsContext";
import { UsersProvider } from "./UsersContext";

export default function AppProviders({ children }) {
    return (
        <UsersProvider>
            <ProjectsProvider>
                <ClientsProvider>
                    <SettingsProvider>
                        <ScheduleProvider>
                            {/* se houver mais, continue aninhando */}
                            {children}
                        </ScheduleProvider>
                    </SettingsProvider>
                </ClientsProvider>
            </ProjectsProvider>
        </UsersProvider>
    );
}
