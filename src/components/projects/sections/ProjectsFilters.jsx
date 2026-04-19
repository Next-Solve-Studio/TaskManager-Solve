import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AiOutlineClear } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import useIsMobile from "@/responsive/useIsMobile";
import { menuPaper2, muiDark2 } from "@/utils/StyleInputs";
import { PRIORITY_MAP, STATUS_MAP } from "../ProjectsConfig";

export default function ProjectsFilters({
    search,
    onSearchChange,
    filterStatus,
    onStatusChange,
    filterPriority,
    onPriorityChange,
    filterDev,
    onDevChange,
    users,
    onClearFilters,
    hasFilters,
}) {
    const isMobile = useIsMobile();

    return (
        <div className="flex flex-wrap gap-4 md:gap-2.5 py-3.5 px-4 bg-bg-card border border-white/10 rounded-[14px] items-center">
            {/* Campo de busca */}
            <div className="relative min-w-45 flex-[1_1_200px]">
                <MdSearch
                    className="absolute left-2.5 top-[50%] -translate-y-1/2 text-font-gray2"
                    size={16}
                />
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar projetos, clientes, tecnologias..."
                    className="w-full bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-lg p-[7px_10px_7px_32px] outline-none text-[#e5e7eb] text-[13px]"
                />
            </div>

            {/* Select Status */}
            <FilterSelect
                label="Status"
                value={filterStatus}
                onChange={onStatusChange}
                options={STATUS_MAP}
                isMobile={isMobile}
            />

            {/* Select Prioridade */}
            <FilterSelect
                label="Prioridade"
                value={filterPriority}
                onChange={onPriorityChange}
                options={PRIORITY_MAP}
                isMobile={isMobile}
            />

            {/* Select Dev */}
            <FormControl
                size="small"
                sx={{ minWidth: isMobile ? "100%" : 160, ...muiDark2 }}
            >
                <InputLabel>Dev</InputLabel>
                <Select
                    value={filterDev}
                    label="Dev"
                    onChange={(e) => onDevChange(e.target.value)}
                    MenuProps={menuPaper2}
                >
                    <MenuItem value="all" style={{ color: "#e5e7eb" }}>
                        Todos devs
                    </MenuItem>
                    {users.map((u) => (
                        <MenuItem
                            key={u.id}
                            value={u.id}
                            style={{ color: "#e5e7eb" }}
                        >
                            {u.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Botão limpar filtros */}
            {hasFilters && (
                <button
                    onClick={onClearFilters}
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

// Componente interno para evitar repetição dos selects
function FilterSelect({ label, value, onChange, options, isMobile }) {
    return (
        <FormControl
            size="small"
            sx={{ minWidth: isMobile ? "100%" : 160, ...muiDark2 }}
        >
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={(e) => onChange(e.target.value)}
                MenuProps={menuPaper2}
            >
                <MenuItem value="all" style={{ color: "#e5e7eb" }}>
                    Todos {label.toLowerCase()}
                </MenuItem>
                {Object.entries(options).map(([val, cfg]) => (
                    <MenuItem
                        key={val}
                        value={val}
                        style={{ color: cfg.color }}
                    >
                        {cfg.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
