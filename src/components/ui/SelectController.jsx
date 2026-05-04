import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

export const SelectController = ({ name, control, label, map }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl fullWidth size="small" sx={muiDark}>
        <InputLabel>{label}</InputLabel>
        <Select {...field} label={label} MenuProps={menuPaper}>
          {Object.entries(map).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              <span style={{ color: val.color, fontWeight: 600, fontSize: 13 }}>
                {val.label}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
);