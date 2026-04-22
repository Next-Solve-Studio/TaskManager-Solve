'use client'
import {memo} from "react"
import { CircularProgress } from "@mui/material"
import ProjectCard from "../card/ProjectCard"
import ProjectsEmptyState from "./ProjectsEmptyState"

export function ProjectsGrid({
    loadingProjects,
    projects,
    usersMap,
    onEdit,
    onDelete,
    onCreate,
    filtered

}) {
    return (
        <section>
            {loadingProjects ? (
                <div className="flex items-center justify-center px-0 py-15 gap-3">
                    <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    <span className="text-font-gray2 text-sm">
                        Carregando projetos...
                    </span>
                </div>
            ) : filtered.length === 0 ? (
                <ProjectsEmptyState
                    projectsLength={projects.length}
                    onCreate={onCreate}
                />
            ) : (
                <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                    {filtered.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            usersMap={usersMap}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default memo(ProjectsGrid);