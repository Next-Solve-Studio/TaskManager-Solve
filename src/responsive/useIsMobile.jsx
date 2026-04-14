"use client";
import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 680) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
        
        const handleChange = (e) => setIsMobile(e.matches);
        
        // Set initial value
        setIsMobile(mediaQuery.matches);
        
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);
    return isMobile;
}
