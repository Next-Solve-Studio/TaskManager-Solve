"use client";

// Importações do Material UI
import {
    Box,
    Button,
    Collapse,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import { useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { MdOutlineFilterList, MdSearch } from "react-icons/md";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import { menuPaper, muiDark } from "@/styles/StyleInputs";

export default function TasksFilters({
    projects,
    users,
    searchInput,
    filterStatus,
    filterPriority,
    filterAssignee,
    filterProject,
    filterMonth,
    setFilterStatus,
    setFilterPriority,
    setFilterProject,
    setFilterAssignee,
    setSearchInput,
    setFilterMonth,
}) {
    const [showFilters, setShowFilters] = useState(false);

    const clearFilters = () => {
        setFilterStatus("all");
        setFilterPriority("all");
        setFilterProject("all");
        setFilterAssignee("all");
        setFilterMonth("all");
        setSearchInput("");
    };

    const hasActiveFilters =
        filterStatus !== "all" ||
        filterPriority !== "all" ||
        filterProject !== "all" ||
        filterAssignee !== "all" ||
        filterMonth !== "all";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Barra de Pesquisa e Botões Superiores */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <TextField
                    size="small"
                    value={searchInput}
                    
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar tarefa, responsável, projeto..."
                    sx={{ ...muiDark, flex: 1, minWidth: 250 }}

                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdSearch size={20} className="text-text-primary"/>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3 },
                    }}
                />

                <Button
                    variant={showFilters ? "contained" : "outlined"}
                    color="primary"
                    disableElevation
                    onClick={() => setShowFilters((v) => !v)}
                    startIcon={<MdOutlineFilterList />}
                    sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        height: 40,
                    }}
                >
                    Filtros
                </Button>

                {hasActiveFilters && (
                    <Tooltip title="Limpar filtros" arrow>
                        <IconButton
                            color="error"
                            onClick={clearFilters}
                            sx={{
                                border: "1px solid",
                                borderColor: "error.light",
                                borderRadius: 3,
                                bgcolor: "error.main",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "error.dark",
                                },
                            }}
                        >
                            <AiOutlineClear size={20} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Painel de Filtros Avançados (com animação Collapse do MUI) */}
            <Collapse in={showFilters}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(5, 1fr)",
                        },
                        gap: 2,
                        p: 2,
                        bgcolor: "var(--color-bg-card)",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        boxShadow: 1,
                    }}
                >
                    <FormControl size="small" fullWidth sx={muiDark}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            label="Status"
                            MenuProps={menuPaper}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            {Object.entries(STATUS_MAP).map(([k, v]) => (
                                <MenuItem key={k} value={k}>
                                    {v.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth sx={muiDark}>
                        <InputLabel id="priority-label">Prioridade</InputLabel>
                        <Select
                            labelId="priority-label"
                            label="Prioridade"
                            value={filterPriority}
                            MenuProps={menuPaper}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <MenuItem value="all">Todas</MenuItem>
                            {Object.entries(PRIORITY_MAP).map(([k, v]) => (
                                <MenuItem key={k} value={k}>
                                    {v.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth sx={muiDark}>
                        <InputLabel id="project-label">Projeto</InputLabel>
                        <Select
                            labelId="project-label"
                            label="Projeto"
                            value={filterProject}
                            MenuProps={menuPaper}
                            onChange={(e) => setFilterProject(e.target.value)}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            {projects.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth sx={muiDark}>
                        <InputLabel id="assignee-label">Responsável</InputLabel>
                        <Select
                            labelId="assignee-label"
                            label="Responsável"
                            value={filterAssignee}
                            MenuProps={menuPaper}
                            onChange={(e) => setFilterAssignee(e.target.value)}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value="mine">Minhas tarefas</MenuItem>
                            {users.map((u) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="month"
                        label="Mês"
                        size="small"
                        fullWidth
                        sx={muiDark}
                        InputLabelProps={{ shrink: true }}
                        value={filterMonth === "all" ? "" : filterMonth}
                        onChange={(e) =>
                            setFilterMonth(e.target.value || "all")
                        }
                    />
                </Box>
            </Collapse>
        </Box>
    );
}
