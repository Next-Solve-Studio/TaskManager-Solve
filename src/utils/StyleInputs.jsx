export const muiDark = {
  "& .MuiOutlinedInput-root": {
    color: "#e5e7eb",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "#19CA68" },
    "& .MuiSelect-icon": { color: "#9ca3af" },
    "& .MuiChip-root": {
      background: "rgba(25,202,104,0.15)",
      color: "#19CA68",
      fontSize: 11,
    },
  },
  "& .MuiInputLabel-root": { color: "#9ca3af" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#19CA68" },
  "& .MuiFormHelperText-root": { color: "#ef4444" },
  "& .MuiOutlinedInput-input": { color: "#e5e7eb" },
};

export const muiDark2 = {
  "& .MuiOutlinedInput-root": {
    color: "#e5e7eb",
    background: "#FFFFFF0A",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-bg-hover2)" },
    "& .MuiSelect-icon": { color: "#9ca3af" },
  },
  "& .MuiInputLabel-root": {
    color: "#9ca3af",
    "&.Mui-focused ": { color: "#9ca3af" },
  },
  "& .MuiFormHelperText-root": { color: "#ef4444" },
  "& .MuiOutlinedInput-input": { color: "#e5e7eb" },
};

export const menuPaper = {
  PaperProps: {
    style: {
      background: "#171C23",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
    },
  },
};

export const menuPaper2 = {
  PaperProps: {
    sx: {
      background: "var(--color-bg-card)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 1,
      mt: 1,

      "& .MuiList-root": {
        padding: "0px",
      },

      "& .MuiMenuItem-root": {
        fontSize: 13,
        color: "#e5e7eb",
        transition: "all 0.15s ease",

        "&:hover": {
          background: "var(--color-bg-hover)",
        },

        "&.Mui-focusVisible": {
          background: "var(--color-bg-hover)",
        },

        "&.Mui-selected": {
          background: "var(--color-bg-selected)",
        },

        "&.Mui-selected:hover": {
          background: "var(--color-bg-hover)",
        },
      },
    },
  },
};
