"use client";
import { memo, useMemo, useState } from "react";
import { MdPerson } from "react-icons/md";
import CardDevs from "./CardDevs";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import CreatedModifiedBy from "./CreatedModifiedBy";

function ProjectCard({ project, usersMap, clientMap, onEdit, onDelete }) {
    //guarda o elemento HTML que servirá de “âncora” para o menu (que começa fechado)
    const [anchorEl, setAnchorEl] = useState(null);

    const techStack = useMemo(
        () => (Array.isArray(project.techStack) ? project.techStack : []), // Verifica se techkStack é um array, se for, usa ele.
        [project.techStack],
        // evita renderizamentos desnecessários com useMemo, agora so renderiza se as dependencias mudarem
    );

    return (
        <div
            className="bg-bg-card border border-white/5 rounded-xl p-4 flex flex-col gap-3
                transition-all duration-200
                hover:border-green-400/20 hover:-translate-y-0.5 select-none"
        >
            <CardHeader
                project={project}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                onEdit={onEdit}
                onDelete={onDelete}
            />

            {project.client && (
                <div className="flex items-center gap-1.5">
                    <MdPerson size={13} className="text-font-gray2 shrink-0" />
                    <span className="text-font-gray text-[12px]">
                        {clientMap[project.client]?.name || "Cliente não encontrado"}
                    </span>
                </div>
            )}

            {project.description && (
                <p className="text-font-gray2 text-[12px] m-0 leading-[1.6]">
                    {project.description.length > 100
                        ? `${project.description.slice(0, 100)}…`
                        : project.description
                        || "Sem descrição"    
                    }
                </p>
            )}

            {techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {techStack.map((tech) => (
                        <span
                            key={tech}
                            className="text-[10px] font-semibold rounded-sm tracking-[0.03em] py-0.5 px-2 border text-cyan-400
                                bg-cyan-400/8 border-cyan-400/15"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            <CardDevs project={project} usersMap={usersMap} />

            <CardFooter project={project} />

            <CreatedModifiedBy usersMap={usersMap} project={project} />
        </div>
    );
}

export default memo(ProjectCard);
/** Suponha que você digite algo no campo de busca. O estado searchInput muda → filtered é recalculado → todo o componente ProjectsMain re-renderiza.
 * Sem memo, todos os ProjectCard (dezenas ou centenas) também re-renderizam,
 * mesmo que seus dados (project, usersMap, onEdit, onDelete) sejam exatamente os mesmos de antes.
 * Com React.memo(ProjectCard), cada ProjectCard só re-renderiza se o project mudar.
 * */
