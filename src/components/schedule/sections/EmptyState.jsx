import { FiCalendar } from "react-icons/fi";

export default function EmptyState({ weekLabel }) {
    return (
        <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl gap-4"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.06)",
            }}
        >
            <FiCalendar size={40} style={{ color: "#374151" }} />
            <div className="text-center">
                <p className="text-white font-semibold">
                    Nenhuma agenda registrada
                </p>
                <p className="text-font-gray2 text-sm mt-1">
                    Nenhum dev preencheu a semana {weekLabel} ainda.
                </p>
            </div>
        </div>
    );
}
