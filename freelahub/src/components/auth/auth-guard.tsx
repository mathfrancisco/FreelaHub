'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

interface AuthGuardProps {
    children: React.ReactNode
    redirectTo?: string
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
    const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        // Verifica a autenticação ao montar o componente
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        // Redireciona se não estiver autenticado e não estiver carregando
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo)
        }
    }, [isLoading, isAuthenticated, router, redirectTo])

    // Mostra loading enquanto verifica a autenticação
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando autenticação...</p>
                </div>
            </div>
        )
    }

    // Não renderiza nada se não estiver autenticado (evita flash)
    if (!isAuthenticated || !user) {
        return null
    }

    // Renderiza o conteúdo protegido
    return <>{children}</>
}