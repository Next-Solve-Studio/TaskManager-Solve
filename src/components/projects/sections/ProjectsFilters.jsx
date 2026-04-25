import { AiOutlineClear } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import FilterSelect from "@/components/ui/FilterSelect";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import useIsMobile from "@/hooks/responsive/useIsMobile";

export default function ProjectsFilters({
    onSearchChange,
    filterStatus,
    onStatusChange,
    filterPriority,
    onPriorityChange,
    filterDev,
    onDevChange,
    users,
    clearFilters,
    searchInput,
}) {
    const isMobile = useIsMobile();

    // se tiver ao menos um filtro ativo, mostra o botão para limpar(searchInput)
    const hasFilters =
        filterStatus !== "all" ||
        filterPriority !== "all" ||
        filterDev !== "all" ||
        searchInput;

    return (
        <div className="flex flex-wrap gap-4 md:gap-2.5 py-3.5 px-4 bg-bg-card border border-border-main rounded-[14px] items-center">
            {/* Campo de busca */}
            <div className="relative min-w-45 flex-[1_1_200px]">
                <MdSearch
                    className="absolute left-2.5 top-[50%] -translate-y-1/2 text-text-muted"
                    size={16}
                />
                <input
                    value={searchInput}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar projetos, clientes, tecnologias..."
                    className="w-full bg-bg-surface border border-border-main rounded-lg p-[7px_10px_7px_32px] outline-none text-text-primary text-[13px] focus:border-brand-500 transition-colors"
                />
            </div>

            {/* Select Status */}
            <FilterSelect
                label="Status"
                value={filterStatus}
                onChange={onStatusChange}
                items={STATUS_MAP}
                isMobile={isMobile}
            />

            {/* Select Prioridade */}
            <FilterSelect
                label="Prioridade"
                value={filterPriority}
                onChange={onPriorityChange}
                items={PRIORITY_MAP}
                isMobile={isMobile}
            />

            {/* Select Devs */}
            <FilterSelect
                label="Dev"
                value={filterDev}
                onChange={onDevChange}
                items={users}
                valueKey="id"
                labelKey="name"
                isMobile={isMobile}
            />

            {/* Botão limpar filtros */}
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    type="button"
                    className="flex items-center gap-1 bg-error/10 text-error cursor-pointer text-[12px] font-semibold border border-error/20 rounded-lg p-2"
                    aria-label="Limpar filtros"
                >
                    <AiOutlineClear className="text-xl" />
                </button>
            )}
        </div>
    );
}
