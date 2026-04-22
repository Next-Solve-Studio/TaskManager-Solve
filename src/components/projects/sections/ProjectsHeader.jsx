import { MdOutlineRocketLaunch } from "react-icons/md";


export default function ProjectsHeader({ projectsCount }) {
    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <MdOutlineRocketLaunch className="text-brand-500 text-lg" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-bg-hover2">
                        Gestão de Projetos
                    </span>
                </div>
                <h1 className="text-[26px] font-extrabold text-white m-0">
                    Projetos
                </h1>
                <p className="text-[13px] text-font-gray2 mt-1">
                    {projectsCount} projeto{projectsCount !== 1 ? "s" : ""}{" "}
                    cadastrado
                    {projectsCount !== 1 ? "s" : ""}
                </p>
            </div>

        </div>
    );
}
