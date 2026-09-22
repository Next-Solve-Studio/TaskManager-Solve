import { ClientsProvider } from "./ClientsContext";
import { CompanyProvider } from "./CompanyContext";
import { LicenseProvider } from "./LicenseApiContext";
import { ProjectsProvider } from "./ProjectsContext";
import { RolePermissionsProvider } from "./RolePermissionsContext";
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
                                        <CustomFieldsProvider>
                                            {children}
                                        </CustomFieldsProvider>
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