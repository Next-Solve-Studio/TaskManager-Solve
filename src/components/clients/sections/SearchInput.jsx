"use client";
import { InputAdornment, TextField } from "@mui/material";
import { MdSearch } from "react-icons/md";
import useIsMobile from "@/hooks/responsive/useIsMobile";

export default function SearchInput({ setSearchTerm, searchTerm }) {
    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TextField
                placeholder="Buscar parceiros ou clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                className={isMobile ? "w-full" : "w-full md:max-w-md"}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MdSearch className="text-white/20 text-xl" />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        color: "var(--color-text-primary)",
                        backgroundColor: "var(--color-border-subtle)",
                        borderRadius: "12px",
                        "& fieldset": {
                            borderColor: "var(--color-border-main)",
                        },
                        "&:hover fieldset": {
                            borderColor:
                                "rgba(var(--color-brand-500-rgb), 0.3)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "var(--color-brand-500)",
                        },
                    },
                }}
            />
        </div>
    );
}
