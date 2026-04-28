export const muiDark = {
    "& .MuiOutlinedInput-root": {
        color: "var(--color-text-primary)",
        background: "var(--color-bg-surface)",
        "& fieldset": { borderColor: "var(--color-border-subtle)" },
        "&:hover fieldset": { borderColor: "var(--color-surface-green-md)" },
        "&.Mui-focused fieldset": { borderColor: "var(--color-brand-500)" },
        "& .MuiSelect-icon": { color: "var(--color-text-muted)" },
        "& .MuiChip-root": {
            background: "rgba(25,202,104,0.15)",
            color: "var(--color-brand-500)",
            fontSize: 11,
        },
    },
    "& .MuiInputLabel-root": { color: "var(--color-text-muted)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-brand-500)" },
    "& .MuiFormHelperText-root": { color: "var(--color-error)" },

    "& .MuiOutlinedInput-input": { 
        color: "var(--color-text-primary)",
        colorScheme: "var(--theme-scheme)",
        
        "&::-webkit-calendar-picker-indicator": {
            cursor: "pointer",

        }
    },
};

export const muiDark2 = {
    "& .MuiOutlinedInput-root": {
        color: "var(--color-text-primary)",
        background: "var(--color-border-subtle)",
        "& fieldset": { borderColor: "var(--color-border-main)" },
        "&:hover fieldset": { borderColor: "var(--color-border-main)" },
        "&.Mui-focused fieldset": { borderColor: "var(--color-brand-500)" },
        "& .MuiSelect-icon": { color: "var(--color-text-muted)" },
    },
    "& .MuiInputLabel-root": {
        color: "var(--color-text-muted)",
        "&.Mui-focused ": { color: "var(--color-text-primary)" },
    },
    "& .MuiFormHelperText-root": { color: "var(--color-error)" },
    "& .MuiOutlinedInput-input": { color: "var(--color-text-primary)" },
};

export const menuPaper = {
    PaperProps: {
        sx: {
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-main)",
            borderRadius: "12px",
            backgroundImage: "none",
            "& .MuiMenuItem-root": {
                color: "var(--color-text-primary)",
                fontSize: 13,
                "&:hover": {
                    background: "var(--color-border-subtle)",
                },
                "&.Mui-selected": {
                    background: "rgba(25,202,104,0.15)",
                    color: "var(--color-brand-500)",
                },
            },
        },
    },
};

export const menuPaper2 = {
    PaperProps: {
        sx: {
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-main)",
            borderRadius: 1,
            mt: 1,
            backgroundImage: "none",

            "& .MuiList-root": {
                padding: "0px",
            },

            "& .MuiMenuItem-root": {
                fontSize: 13,
                color: "var(--color-text-primary)",
                transition: "all 0.15s ease",

                "&:hover": {
                    background: "var(--color-border-subtle)",
                },

                "&.Mui-focusVisible": {
                    background: "var(--color-border-subtle)",
                },

                "&.Mui-selected": {
                    background: "rgba(25,202,104,0.15)",
                    color: "var(--color-brand-500)",
                },

                "&.Mui-selected:hover": {
                    background: "rgba(25,202,104,0.25)",
                },
            },
        },
    },
};
