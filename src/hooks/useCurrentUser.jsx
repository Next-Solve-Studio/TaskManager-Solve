import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

export function useCurrentUser() {
    const { currentUser } = useAuth();

    return useMemo(() => ({
        uid:       currentUser?.uid       ?? null,
        companyId: currentUser?.companyId ?? null,
        userName:  currentUser?.name      ?? currentUser?.displayName ?? "",
        userPhoto: currentUser?.photo     ?? currentUser?.photoURL    ?? null,
        role:      currentUser?.role      ?? null,
        email:     currentUser?.email     ?? null,
    }), [
        currentUser?.uid,
        currentUser?.companyId,
        currentUser?.name,
        currentUser?.displayName,
        currentUser?.photo,
        currentUser?.photoURL,
        currentUser?.role,
        currentUser?.email,
    ]);
}