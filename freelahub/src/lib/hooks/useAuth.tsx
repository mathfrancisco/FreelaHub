import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

interface UseAuthOptions {
    redirectTo?: string
    redirectIfFound?: boolean
}

/**
 * Hook personalizado para gerenciar autenticação
 */
export function useAuth({
                            redirectTo,
                            redirectIfFound = false
                        }: UseAuthOptions = {}) {
    const router = useRouter()
    const {
        user,
        isLoading,
        isAuthenticated,
        checkAuth,
        signOut,
        _hasHydrated
    } = useAuthStore()

    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        // Só inicializa após a hidratação do Zustand
        if (_hasHydrated && !isInitialized) {
            setIsInitialized(true)
        }
    }, [_hasHydrated, isInitialized])

    useEffect(() => {
        // Só executa redirecionamentos após inicialização completa
        if (!isInitialized || isLoading) return

        // Redireciona se usuário não está autenticado e redirectTo foi fornecido
        if (!isAuthenticated && redirectTo) {
            router.push(redirectTo)
            return
        }

        // Redireciona se usuário está autenticado e redirectIfFound é true
        if (isAuthenticated && redirectIfFound) {
            router.push('/dashboard')
            return
        }
    }, [isInitialized, isLoading, isAuthenticated, redirectTo, redirectIfFound, router])

    const logout = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    return {
        user,
        isLoading: isLoading || !isInitialized,
        isAuthenticated: isAuthenticated && isInitialized,
        logout,
        isReady: isInitialized && !isLoading
    }
}

/**
 * Hook para proteger páginas que requerem autenticação
 */
export function useRequireAuth() {
    return useAuth({ redirectTo: '/login' })
}

/**
 * Hook para páginas de autenticação (login/register)
 * Redireciona para dashboard se já autenticado
 */
export function useAuthPage() {
    return useAuth({ redirectIfFound: true })
}

/**
 * Hook para verificar se o usuário tem uma assinatura específica
 */
export function useSubscription() {
    const { user, isReady } = useAuth()

    const hasSubscription = (tier: string) => {
        if (!user || !isReady) return false
        return user.subscription_tier === tier
    }

    const isPremium = () => {
        if (!user || !isReady) return false
        return ['professional', 'business', 'enterprise'].includes(user.subscription_tier)
    }

    return {
        subscription: user?.subscription_tier,
        hasSubscription,
        isPremium: isPremium(),
        isReady
    }
}