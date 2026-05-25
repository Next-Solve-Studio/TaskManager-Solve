"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");

    // Inicializar tema
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", newTheme);
            document.documentElement.dataset.theme = newTheme;
            return newTheme;
        });
    }, []);

    const value = useMemo(()=>({
        theme,
        toggleTheme,
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
