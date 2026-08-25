import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { createOAuthClient, exchangeCodeForTokens, saveGoogleTokens } from "@/lib/googleCalendar";

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const uidFromState = searchParams.get("state");
    const oauthError = searchParams.get("error");
    const redirectBase = `${origin}/schedule`;

    if (oauthError) {
        return NextResponse.redirect(`${redirectBase}?google=denied`);
    }

    const sessionToken = request.cookies.get("__session")?.value;
    if (!sessionToken || !code || !uidFromState) {
        return NextResponse.redirect(`${redirectBase}?google=error`);
    }

    let caller;
    try {
        caller = await verifyFirebaseToken(sessionToken);
    } catch {
        return NextResponse.redirect(`${redirectBase}?google=error`);
    }

    if (caller.uid !== uidFromState) {
        return NextResponse.redirect(`${redirectBase}?google=error`);
    }

    try {
        const tokens = await exchangeCodeForTokens(code);

        const client = createOAuthClient();
        client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: "v2", auth: client });
        const { data } = await oauth2.userinfo.get();

        const { db } = getFirebaseAdmin();
        const userDoc = await db.collection("users").doc(caller.uid).get();
        const companyId = userDoc.data()?.companyId;

        await saveGoogleTokens(caller.uid, companyId, tokens, data.email);

        return NextResponse.redirect(`${redirectBase}?google=connected`);
    } catch (err) {
        console.error("Erro ao conectar Google Calendar:", err);
        return NextResponse.redirect(`${redirectBase}?google=error`);
    }
}