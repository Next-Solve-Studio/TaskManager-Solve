import crypto from "node:crypto";
import { google } from "googleapis";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { encryptToken, decryptToken } from "@/lib/tokenEncryption";

const SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
];

function getRedirectUri() {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`;
}

export function createOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        getRedirectUri(),
    );
}

export async function getGoogleAuthUrl(uid) {
    const { db } = getFirebaseAdmin();
    const state = crypto.randomBytes(16).toString("hex");
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    await db.collection("oauth_states").doc(state).set({ uid, expiresAt });

    const client = createOAuthClient();
    return client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
        state,
    });
}

export async function exchangeCodeForTokens(code) {
    const client = createOAuthClient();
    const { tokens } = await client.getToken(code);
    return tokens;
}

export async function saveGoogleTokens(uid, companyId, tokens, email) {
    if (!tokens.refresh_token) {
        throw new Error(
            "O Google não retornou um refresh token. Revogue o acesso em myaccount.google.com/permissions e conecte novamente.",
        );
    }
    const { db } = getFirebaseAdmin();
    await db.collection("google_tokens").doc(uid).set(
        {
            refreshToken: encryptToken(tokens.refresh_token),
            googleEmail: email || null,
            companyId,
            connectedAt: new Date(),
        },
        { merge: true },
    );
}

export async function getAuthorizedClientForUser(uid) {
    const { db } = getFirebaseAdmin();
    const snap = await db.collection("google_tokens").doc(uid).get();
    if (!snap.exists) return null;

    const raw = snap.data().refreshToken;
    const refreshToken = raw?.includes(":") ? decryptToken(raw) : raw;

    const client = createOAuthClient();
    client.setCredentials({ refresh_token: refreshToken });
    return client;
}

export async function disconnectGoogle(uid) {
    const { db } = getFirebaseAdmin();
    try {
        const client = await getAuthorizedClientForUser(uid);
        if (client) await client.revokeCredentials();
    } catch {}
    await db.collection("google_tokens").doc(uid).delete();
}