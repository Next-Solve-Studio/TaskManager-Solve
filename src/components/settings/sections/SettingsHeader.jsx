import useIsMobile from "@/responsive/useIsMobile";
import { FiSettings } from "react-icons/fi";

export default function SettingsHeader({ title, description, icon: Icon }) {
    const isMobile = useIsMobile();

    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    {Icon ? (
                        <Icon className="text-brand-500 text-lg" />
                    ) : (
                        <FiSettings className="text-brand-500 text-lg" />
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-bg-hover2">
                        Configurações
                    </span>
                </div>
                <h1
                    className={`${isMobile ? "text-xl" : "text-[26px]"} font-extrabold text-white m-0`}
                >
                    {title}
                </h1>
                {description && (
                    <p
                        className={`${isMobile ? "text-xs" : "text-[13px]"} text-font-gray2 mt-1`}
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}