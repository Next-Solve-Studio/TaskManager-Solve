"use client";
import { useState, useEffect } from "react";

export function useCardSettings(storageKey, defaultSettings) {
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                setSettings({ ...defaultSettings, ...JSON.parse(stored) });
            }
        } catch (err) {
            console.error("Error loading settings from localStorage:", err);
        }
        setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    const updateSetting = (key, value) => {
        setSettings((prev) => {
            const next = { ...prev, [key]: value };
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch (err) {
                console.error("Error saving settings to localStorage:", err);
            }
            return next;
        });
    };

    return { settings, updateSetting, isLoaded };
}
