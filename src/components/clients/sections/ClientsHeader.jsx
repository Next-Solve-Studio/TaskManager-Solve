import { FiBriefcase } from "react-icons/fi";
import useIsMobile from "@/responsive/useIsMobile";

export default function ClientsHeader() {
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
                
            </div>
            
        </div>
    );
}
