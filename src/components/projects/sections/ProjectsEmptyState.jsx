import { MdAdd, MdOutlineRocketLaunch } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";

export default function ProjectsEmptyState({ projectsLength, onCreate }) {
    return (
        <div className="flex flex-col items-center justify-center py-15 px-0 gap-3 bg-bg-card border rounded-2xl border-[#ffffff0f]">
            <MdOutlineRocketLaunch className="text-[44px] text-bg-hover" />
            <p className="text-bg-hover2 text-[14px] font-semibold">
                {projectsLength === 0
                    ? "Nenhum projeto cadastrado ainda"
                    : "Nenhum projeto encontrado"}
            </p>
            {projectsLength === 0 && (
                <CanDo permission="canCreateProjects">
                    <button
                        onClick={onCreate}
                        type="button"
                        className="mt-1 bg-brand-500/10 text-brand-500 cursor-pointer text-[13px] font-semibold flex items-center gap-1.5 border border-brand-500/20 rounded-lg py-2 px-4.5"
                    >
                        <MdAdd size={16} /> Criar primeiro projeto
                    </button>
                </CanDo>
            )}
        </div>
    );
}
