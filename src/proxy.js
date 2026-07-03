import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const JWKS = createRemoteJWKSet(
    new URL(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
    )
);

async function verifyToken(token) {
    await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
    });
}

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get("__session");
    const token = sessionCookie?.value;

    if (pathname === "/login") {
        if (token) {
            try {
                await verifyToken(token);
                return NextResponse.redirect(new URL("/", request.url));
            } catch {
                // token inválido — deixa acessar o login normalmente
            }
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await verifyToken(token);
    } catch {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("__session");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};