import { auth } from "@/lib/firebaseConfig";

export async function validateLicense(appKey) {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/validate-license?appKey=${appKey}`, {
            cache: "no-store",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return await res.json();
    } catch {
        return null;
    }
}