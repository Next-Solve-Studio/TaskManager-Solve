"use client";
import { useEffect, useState } from "react";

function getIsMobile(breakpoint) {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
}

export default function useIsMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(() => getIsMobile(breakpoint));

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handleChange = (e) => setIsMobile(e.matches);

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);
    return isMobile;
}
