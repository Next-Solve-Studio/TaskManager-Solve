import { auth } from "@/lib/firebaseConfig";

export async function validateLicense() {
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return null;
        const res = await fetch("/api/validate-license", {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
        });
        return await res.json();
    } catch {
        return null;
    }
}