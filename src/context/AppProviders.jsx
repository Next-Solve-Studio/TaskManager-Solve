'use client'
import { UsersProvider } from "./UsersContext"
import { ProjectsProvider } from "./ProjectsContext"

export default function AppProviders({children}){
    return (
        <UsersProvider>
            <ProjectsProvider>
                {/* se houver mais, continue aninhando */}
                {children}
            </ProjectsProvider>
        </UsersProvider>
    )
}