import { google } from "googleapis";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

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

export function getGoogleAuthUrl(uid) {
    const client = createOAuthClient();
    return client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
        state: uid,
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
            refreshToken: tokens.refresh_token,
            googleEmail: email || null,
            companyId,
            connectedAt: new Date(),
        },
        { merge: true },
    );
}

export async function getAuthorizedClientForUser(uid) {
    const { db } = getFirebaseAdmin();
    const doc = await db.collection("google_tokens").doc(uid).get();
    if (!doc.exists) return null;

    const client = createOAuthClient();
    client.setCredentials({ refresh_token: doc.data().refreshToken });
    return client;
}

export async function disconnectGoogle(uid) {
    const { db } = getFirebaseAdmin();
    await db.collection("google_tokens").doc(uid).delete();
}