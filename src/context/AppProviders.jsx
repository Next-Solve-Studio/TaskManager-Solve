"use client";
import { ClientsProvider } from "./ClientsContext";
import { CompanyProvider } from "./CompanyContext";
import { LicenseProvider } from "./LicenseApiContext";
import { ProjectsProvider } from "./ProjectsContext";
import { RolePermissionsProvider } from "./RolePermissionsContext";
import { ScheduleProvider } from "./ScheduleContext";
import { TasksProvider } from "./TasksContext";
import { UsersProvider } from "./UsersContext";
import { BillingProvider } from "./BillingContext";
import { CustomFieldsProvider } from "./CustomFieldsContext";
export default function AppProviders({ children }) {
    return (
        <RolePermissionsProvider>
            <LicenseProvider>
                <CompanyProvider>
                    <BillingProvider>
                        <UsersProvider>
                            <ClientsProvider>
                                <ProjectsProvider>
                                    <TasksProvider>
                                        <ScheduleProvider>
                                            <CustomFieldsProvider>
                                                {children}
                                            </CustomFieldsProvider>
                                        </ScheduleProvider>
                                    </TasksProvider>
                                </ProjectsProvider>
                            </ClientsProvider>
                        </UsersProvider>
                    </BillingProvider>
                </CompanyProvider>
            </LicenseProvider>
        </RolePermissionsProvider>
    );
}
