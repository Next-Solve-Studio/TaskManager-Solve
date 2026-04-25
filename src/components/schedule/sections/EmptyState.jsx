import { FiCalendar } from "react-icons/fi";

export default function EmptyState({ weekLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl gap-4 bg-bg-surface border border-dashed border-border-main">
            <FiCalendar size={40} className="text-text-muted opacity-20" />
            <div className="text-center">
                <p className="text-text-primary font-semibold">
                    Nenhuma agenda registrada
                </p>
                <p className="text-text-secondary text-sm mt-1">
                    Nenhum dev preencheu a semana {weekLabel} ainda.
                </p>
            </div>
        </div>
    );
}
