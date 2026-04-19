import { FiBriefcase } from "react-icons/fi";
import useIsMobile from "@/responsive/useIsMobile";

export default function ClientsHeader({ onCreate }) {
    const isMobile = useIsMobile();

    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <FiBriefcase className="text-brand-500 text-lg" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-bg-hover2">
                        Gestão de Clientes
                    </span>
                </div>
                <h1
                    className={`${isMobile ? "text-xl" : "text-[26px]"} font-extrabold text-white m-0`}
                >
                    Clientes
                </h1>
                {/* <p
                    className={`${isMobile ? "text-xs" : "text-[13px]"} text-font-gray2 mt-1`}
                >
                    {clientsCount} cliente{clientsCount !== 1 ? "s" : ""}{" "}
                    cadastrado
                    {clientsCount !== 1 ? "s" : ""}
                </p> */}
            </div>
            {onCreate && (
                <button
                    onClick={onCreate}
                    type="button"
                    className="
                        relative inline-flex items-center gap-1.5
                        px-4.5 h-9.5 rounded-[7px]
                        text-[13px] font-bold tracking-tight text-black
                        bg-linear-to-br from-brand-500 to-brand-600
                        overflow-hidden cursor-pointer
                        transition-all duration-150
                        hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(25, 202, 104, 0.42)]
                        active:scale-[0.97]
                        shadow-[0_2px_10px_rgba(25,202,104,0.25)]
                    "
                >
                    <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-linear-to-b from-white/18 to-transparent" />
                    <span className="relative z-10">Novo Cliente</span>
                </button>
            )}
        </div>
    );
}
