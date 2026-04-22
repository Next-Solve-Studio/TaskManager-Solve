import { menuPaper2, muiDark2 } from "@/utils/StyleInputs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// Componente interno para evitar repetição dos selects
export default function FilterSelect({
    label,
    value,
    onChange,
    items, 
    isMobile,
    valueKey = "value",
    labelKey = "label",
    colorKey = "color",
    allLabel = `Todos ${label.toLowerCase()}`,
}) {
    const options = Array.isArray(items)
    ? items
    : Object.entries(items).map(([val, cfg]) => ({
        [valueKey]: val,
        [labelKey]: cfg.label,
        [colorKey]: cfg.color,
    }))

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
                    {allLabel}
                </MenuItem>

                {options.map((item)=> (
                    <MenuItem
                        key={item[valueKey]}
                        value={item[valueKey]}
                        style={{ color: item[colorKey] || "#e5e7eb" }}
                    >
                        {item[labelKey]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
