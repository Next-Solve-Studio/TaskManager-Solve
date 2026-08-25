import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { getGoogleAuthUrl } from "@/lib/googleCalendar";

export async function GET(request) {
    const sessionToken = request.cookies.get("__session")?.value;
    if (!sessionToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    let caller;
    try {
        caller = await verifyFirebaseToken(sessionToken);
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.redirect(getGoogleAuthUrl(caller.uid));
}