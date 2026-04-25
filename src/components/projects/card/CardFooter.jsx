import { Tooltip } from "@mui/material";
import { MdCalendarToday, MdComputer, MdOutlineTimer } from "react-icons/md";
import { RiGitBranchLine } from "react-icons/ri";
import { useProjectsDates } from "@/hooks/useProjectDates";

export default function CardFooter({ project }) {
    const {
        startDateInfo,
        expectedInfo,
        deliveryStatus,
        deliveredInfo,
        supportInfo,
    } = useProjectsDates(project);

    return (
        <div className="flex items-center justify-between pt-3 gap-2 flex-wrap border-t border-border-main">
            <div className="flex flex-col gap-0.75">
                {startDateInfo && (
                    <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                        <MdCalendarToday size={11} />
                        Início: {startDateInfo.formatted}
                    </span>
                )}

                {deliveredInfo ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-600">
                        <MdOutlineTimer size={11} />
                        Entregue em: {deliveredInfo.formatted}
                    </span>
                ) : supportInfo ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-500">
                        <MdOutlineTimer size={11} />
                        Final do suporte: {supportInfo.formatted}
                    </span>
                ) : (
                    expectedInfo && (
                        <span
                            className={`flex items-center gap-1 text-[11px] font-semibold`}
                            style={{ color: expectedInfo.color }}
                        >
                            <MdOutlineTimer size={11} />
                            {expectedInfo.text !== expectedInfo.formatted
                                ? `Previsão: ${expectedInfo.formatted} · ${expectedInfo.text}`
                                : `Previsão: ${expectedInfo.formatted}`}
                        </span>
                    )
                )}
                {deliveryStatus && deliveredInfo && (
                    <span
                        style={{
                            fontSize: 10,
                            color: deliveryStatus.color,
                        }}
                    >
                        {deliveryStatus.text}
                    </span>
                )}
            </div>

            <div style={{ display: "flex", gap: 6 }}>
                {project.repositoryUrl && (
                    <Tooltip title="Repositório" arrow>
                        <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center w-7 h-7 rounded-[7px] text-text-secondary bg-bg-surface
                                border border-border-main no-underline transition-all duration-150
                                sm:hover:text-brand-500 sm:hover:border-brand-500/30"
                        >
                            <RiGitBranchLine size={14} />
                        </a>
                    </Tooltip>
                )}
                {project.hosting && (
                    <Tooltip title={`Hosting: ${project.hosting}`} arrow>
                        <div
                            className="flex items-center gap-1 py-0.75 px-2.5 rounded-[7px] text-text-muted
                            bg-bg-surface border border-border-main text-[10px]"
                        >
                            <MdComputer size={12} />
                            {project.hosting}
                        </div>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}
