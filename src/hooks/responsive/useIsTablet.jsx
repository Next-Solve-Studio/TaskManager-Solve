"use client";
import { useEffect, useState } from "react";

function getIsMobile(breakpoint) {
    if (globalThis.window == "undefined") return false;
    return globalThis.window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
}

export default function useIsMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(() => getIsMobile(breakpoint));

    useEffect(() => {
        if (globalThis.window == "undefined") return;

        const mediaQuery = globalThis.window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handleChange = (e) => setIsMobile(e.matches);

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);
    return isMobile;
}
