"use client";
import { ClientsProvider } from "./ClientsContext";
import { ProjectsProvider } from "./ProjectsContext";
import { SettingsProvider } from "./SettingsContext";
import { UsersProvider } from "./UsersContext";

export default function AppProviders({ children }) {
  return (
    <UsersProvider>
      <ProjectsProvider>
        <ClientsProvider>
          <SettingsProvider>
            {/* se houver mais, continue aninhando */}
            {children}
          </SettingsProvider>
        </ClientsProvider>
      </ProjectsProvider>
    </UsersProvider>
  );
}
