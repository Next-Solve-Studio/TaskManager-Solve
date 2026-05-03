"use client";
import { ClientsProvider } from "./ClientsContext";
import { ProjectsProvider } from "./ProjectsContext";
import { ScheduleProvider } from "./ScheduleContext";
import { TasksProvider } from "./TasksContext";
import { UsersProvider } from "./UsersContext";

export default function AppProviders({ children }) {
    return (
        <UsersProvider>
            <ProjectsProvider>
                <ClientsProvider>
                    <TasksProvider>
                        <ScheduleProvider>
                            {/* se houver mais, continue aninhando */}
                            {children}
                        </ScheduleProvider>
                    </TasksProvider>
                </ClientsProvider>
            </ProjectsProvider>
        </UsersProvider>
    );
}
