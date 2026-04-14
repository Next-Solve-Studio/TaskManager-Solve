"use client";
import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        !breakpoint ? breakpoint === 480  : breakpoint

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        const handleChange = (e) => setIsMobile(e.matches);

        handleChange(mediaQuery);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);
    return isMobile;
}
