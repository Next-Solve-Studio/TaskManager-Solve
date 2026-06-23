"use client";
import { ClientsProvider } from "./ClientsContext";
import { CompanyProvider } from "./CompanyContext";
import { LicenseProvider } from "./licenseApi";
import { ProjectsProvider } from "./ProjectsContext";
import { ScheduleProvider } from "./ScheduleContext";
import { TasksProvider } from "./TasksContext";
import { UsersProvider } from "./UsersContext";

export default function AppProviders({ children }) {
    return (
        <LicenseProvider>
            <CompanyProvider>
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
            </CompanyProvider>
        </LicenseProvider>
    );
}
