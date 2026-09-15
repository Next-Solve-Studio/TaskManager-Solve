"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAppRouter() {
    const router = useRouter();

    const goHome  = useCallback(() => router.push("/"),      [router]);
    const goLogin = useCallback(() => router.push("/login"), [router]);
    const go      = useCallback((path) => router.push(path), [router]);
    const back    = useCallback(() => router.back(),         [router]);
    const replace = useCallback((path) => router.replace(path), [router]);

    return { goHome, goLogin, go, back, replace };
}