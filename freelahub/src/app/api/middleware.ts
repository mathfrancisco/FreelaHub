import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        req.cookies.set(name, value)
                        res.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    try {
        // Verifica a sessão do usuário
        const {
            data: { session },
            error
        } = await supabase.auth.getSession()

        if (error) {
            console.error('Erro no middleware ao verificar sessão:', error)
        }

        // Rotas que requerem autenticação
        const protectedRoutes = ['/dashboard', '/content', '/leads', '/settings']
        const isProtectedRoute = protectedRoutes.some(route =>
            req.nextUrl.pathname.startsWith(route)
        )

        // Rotas de autenticação (não devem ser acessadas se já autenticado)
        const authRoutes = ['/login', '/register']
        const isAuthRoute = authRoutes.some(route =>
            req.nextUrl.pathname.startsWith(route)
        )

        // Se está tentando acessar uma rota protegida sem estar autenticado
        if (isProtectedRoute && !session) {
            const redirectUrl = new URL('/login', req.url)
            // Adiciona a rota atual como parâmetro de redirecionamento
            redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }

        // Se está tentando acessar rotas de auth já estando autenticado
        if (isAuthRoute && session) {
            // Verifica se há um parâmetro de redirecionamento
            const redirectTo = req.nextUrl.searchParams.get('redirectTo')
            if (redirectTo && redirectTo.startsWith('/')) {
                return NextResponse.redirect(new URL(redirectTo, req.url))
            }
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Redireciona da raiz para o dashboard se autenticado, senão para login
        if (req.nextUrl.pathname === '/') {
            if (session) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            } else {
                return NextResponse.redirect(new URL('/login', req.url))
            }
        }

        // Adiciona headers para cache do browser
        if (session) {
            res.headers.set('x-middleware-cache', 'no-cache')
        }

        return res
    } catch (error) {
        console.error('Erro no middleware:', error)

        // Em caso de erro, permite acesso a rotas públicas
        const authRoutes = ['/login', '/register']
        const isAuthRoute = authRoutes.some(route =>
            req.nextUrl.pathname.startsWith(route)
        )

        if (isAuthRoute || req.nextUrl.pathname === '/') {
            return res
        }

        // Redireciona para login em caso de erro em rotas protegidas
        return NextResponse.redirect(new URL('/login', req.url))
    }
}

// Configura em quais rotas o middleware deve ser executado
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}