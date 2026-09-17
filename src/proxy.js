import { NextResponse } from "next/server";
import { importX509, jwtVerify } from "jose";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Session cookies do Firebase Admin usam endpoint de certificados PEM, não JWKS
const SESSION_CERTS_URL =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys";

let _certCache = null;
let _certCacheExpiry = 0;

async function getSessionCerts() {
    if (_certCache && Date.now() < _certCacheExpiry) return _certCache;

    const res = await fetch(SESSION_CERTS_URL);
    const data = await res.json();

    // Respeita o Cache-Control do Google para não buscar a cada request
    const maxAge = parseInt(
        res.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] ?? "3600"
    );
    _certCacheExpiry = Date.now() + maxAge * 1000;

    const keys = {};
    for (const [kid, pem] of Object.entries(data)) {
        keys[kid] = await importX509(pem, "RS256");
    }
    _certCache = keys;
    return keys;
}

function decodeJwtHeader(token) {
    // JWT usa base64url — converte para base64 padrão antes do atob
    const b64 = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
}

async function verifySessionCookie(token) {
    const header = decodeJwtHeader(token);
    const certs = await getSessionCerts();
    const key = certs[header.kid];
    if (!key) throw new Error(`kid desconhecido: ${header.kid}`);

    await jwtVerify(token, key, {
        issuer: `https://session.firebase.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
    });
}

const PUBLIC_PATHS = ["/PrivacyPolicy", "/TermsOfService"];

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) {
        return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("__session");
    const token = sessionCookie?.value;

    if (pathname === "/login") {
        if (token) {
            try {
                await verifySessionCookie(token);
                return NextResponse.redirect(new URL("/", request.url));
            } catch {
                // cookie inválido ou expirado — deixa acessar o login
            }
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await verifySessionCookie(token);
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