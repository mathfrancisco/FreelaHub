import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

interface UseAuthOptions {
    redirectTo?: string
    redirectIfFound?: boolean
}

/**
 * Hook personalizado para gerenciar autenticação
 *
 * @param redirectTo - Para onde redirecionar se não autenticado
 * @param redirectIfFound - Se deve redirecionar quando encontrar usuário autenticado
 */
export function useAuth({
                            redirectTo,
                            redirectIfFound = false
                        }: UseAuthOptions = {}) {
    const router = useRouter()
    const { user, isLoading, isAuthenticated, checkAuth, signOut } = useAuthStore()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let isMounted = true

        const initAuth = async () => {
            try {
                await checkAuth()
                if (isMounted) {
                    setIsReady(true)
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error)
                if (isMounted) {
                    setIsReady(true)
                }
            }
        }

        initAuth()

        return () => {
            isMounted = false
        }
    }, [checkAuth])

    useEffect(() => {
        if (!isReady || isLoading) return

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
    }, [isReady, isLoading, isAuthenticated, redirectTo, redirectIfFound, router])

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
        isLoading: isLoading || !isReady,
        isAuthenticated,
        logout,
        isReady
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
    const { user } = useAuth()

    const hasSubscription = (tier: string) => {
        if (!user) return false
        return user.subscription_tier === tier
    }

    const isPremium = () => {
        if (!user) return false
        return ['professional', 'business', 'enterprise'].includes(user.subscription_tier)
    }

    return {
        subscription: user?.subscription_tier,
        hasSubscription,
        isPremium: isPremium()
    }
}