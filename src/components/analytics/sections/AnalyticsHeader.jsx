import { MdFilterList, MdTrendingUp } from "react-icons/md";
import { GLASS_CARD } from "@/styles/StylesCard";
import {
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import { muiDark } from "@/styles/StyleInputs";
import FilterSelect from "@/components/ui/FilterSelect";

const TIME_FILTER_OPTIONS = [
    { value: "year", label: "Este Ano" },
    { value: "month", label: "Este Mês" },
    { value: "week", label: "Esta Semana" }
];

export default function AnalyticsHeader({timeFilter, setTimeFilter}) {
    
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl"
            style={GLASS_CARD}>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MdTrendingUp className="text-brand-500" /> Dashboard Estratégico
                </h1>
                <p className="text-text-secondary text-sm">Visão analítica de finanças, projetos e capacidade da equipe.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <MdFilterList className="text-text-muted text-xl" />
                {/* <FormControl
                    size="small"
                    sx={muiDark}
                >
                    <Select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        sx={muiDark}
                    >
                        <MenuItem value="all">Todo o Período</MenuItem>
                        <MenuItem value="year">Este Ano</MenuItem>
                        <MenuItem value="month">Este Mês</MenuItem>
                        <MenuItem value="week">Esta Semana</MenuItem>
                    </Select>
                      
                </FormControl> */}
                <FilterSelect
                    value={timeFilter}
                    onChange={(value) => setTimeFilter(value)}
                    items={TIME_FILTER_OPTIONS}
                    allLabel="Todo o Período"
                    // isMobile={isMobile}
                    />
            </div>
        </div>
    )
}
