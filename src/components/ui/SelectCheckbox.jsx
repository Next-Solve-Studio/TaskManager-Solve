"use client";
import { Checkbox } from "@mui/material";

export default function SelectCheckbox({
    checked,
    indeterminate = false,
    onChange,
    label,
    className,
}) {
    return (
        <Checkbox
            size="small"
            checked={checked}
            indeterminate={indeterminate}
            onChange={onChange}
            className={className}
            slotProps={{ input: { "aria-label": label } }}
            sx={{
                p: 0,
                color: "var(--color-text-muted)",
                "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                    color: "var(--color-brand-500)",
                },
            }}
        />
    );
}
