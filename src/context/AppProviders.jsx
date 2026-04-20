"use client";
import { ClientsProvider } from "./ClientsContext";
import { ProjectsProvider } from "./ProjectsContext";
import { ScheduleProvider } from "./ScheduleContext";
import { UsersProvider } from "./UsersContext";

export default function AppProviders({ children }) {
    return (
        <UsersProvider>
            <ProjectsProvider>
                <ClientsProvider>
                    <ScheduleProvider>
                        {/* se houver mais, continue aninhando */}
                        {children}
                    </ScheduleProvider>
                </ClientsProvider>
            </ProjectsProvider>
        </UsersProvider>
    );
}
