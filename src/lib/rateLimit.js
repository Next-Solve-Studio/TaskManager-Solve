import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export async function checkRateLimit({ key, windowSeconds, max }) {
    const { db } = getFirebaseAdmin();
    const ref = db.collection("rate_limits").doc(key);
    const now = Date.now();

    return db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const data = snap.exists ? snap.data() : null;

        if (!data || now - data.windowStart > windowSeconds * 1000) {
            tx.set(ref, { windowStart: now, count: 1 });
            return { allowed: true };
        }

        if (data.count >= max) {
            return { allowed: false };
        }

        tx.update(ref, { count: data.count + 1 });
        return { allowed: true };
    });
}

export function getClientIp(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return request.headers.get("x-real-ip") || "unknown";
}