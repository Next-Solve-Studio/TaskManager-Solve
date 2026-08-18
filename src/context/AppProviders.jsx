"use client";
import { ClientsProvider } from "./ClientsContext";
import { CompanyProvider } from "./CompanyContext";
import { LicenseProvider } from "./LicenseApiContext";
import { ProjectsProvider } from "./ProjectsContext";
import { RolePermissionsProvider } from "./RolePermissionsContext";
import { ScheduleProvider } from "./ScheduleContext";
import { TasksProvider } from "./TasksContext";
import { UsersProvider } from "./UsersContext";

export default function AppProviders({ children }) {
    return (
        <RolePermissionsProvider>
            <LicenseProvider>
                <CompanyProvider>
                    <UsersProvider>
                        <ProjectsProvider>
                            <ClientsProvider>
                                <TasksProvider>
                                    <ScheduleProvider>
                                        {children}
                                    </ScheduleProvider>
                                </TasksProvider>
                            </ClientsProvider>
                        </ProjectsProvider>
                    </UsersProvider>
                </CompanyProvider>
            </LicenseProvider>
        </RolePermissionsProvider>
    );
}
