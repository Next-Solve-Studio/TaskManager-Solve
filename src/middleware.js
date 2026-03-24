import { NextResponse } from "next/server";

export function middleware(request) {
    const {pathname} = request.nextUrl

    // Verificar se o user está tentando acessar a página de login
    if (pathname === '/login'){
        return NextResponse.next()
    }

    // Para rotas protegidas (como o home), veriifcar autenticação via cookie
    // O firebase armazena a sessão em um cookie chamado '__session'
    const sessionCookie = request.cookies.get('__session')

    // Se não houver sessão e o user tentar acessar uma rota protegida, redireciona para o lohin
    if (!sessionCookie && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// configurar as rotas que o middleware deve proteger
export const config = {
    matcher: [
      /*
         * Proteger todas as rotas exceto:
         * - api (rotas de API)
         * - _next/static (arquivos estáticos)
         * - _next/image (otimização de imagens)
         * - favicon.ico (favicon)
         * - public (arquivos públicos)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}