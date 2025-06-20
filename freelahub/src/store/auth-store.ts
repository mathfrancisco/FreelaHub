import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {AuthState, DatabaseProfile, ProfileUpdate, User} from '@/lib/types'
import { supabase } from '@/lib/supabase/supabase'

const profileToUser = (profile: DatabaseProfile): User => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name || undefined,
    avatar_url: profile.avatar_url || undefined,
    subscription_tier: profile.subscription_tier || 'starter',
    business_info: profile.business_info,
    settings: profile.settings,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
})

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true, // Inicia como true para evitar flash
            isAuthenticated: false,
            _hasHydrated: false, // Adiciona flag de hidratação

            signIn: async (email: string, password: string) => {
                set({ isLoading: true })
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })

                    if (error) throw error

                    if (data.user) {
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', data.user.id)
                            .single()

                        if (profileError) {
                            console.error('Erro ao buscar perfil:', profileError)
                            throw profileError
                        }

                        if (profile) {
                            const user = profileToUser(profile as DatabaseProfile)
                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false
                            })
                        }
                    }
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            signUp: async (email: string, password: string, fullName: string) => {
                set({ isLoading: true })
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: fullName,
                            },
                        },
                    })

                    if (error) {
                        console.error('Erro no signUp:', error)
                        throw new Error(`Erro ao criar conta: ${error.message}`)
                    }

                    if (data.user && !data.user.email_confirmed_at) {
                        console.log('Usuário criado, aguardando confirmação de email')
                    }

                    set({ isLoading: false })
                    return data
                } catch (error: any) {
                    console.error('Erro completo no signUp:', error)
                    set({ isLoading: false })
                    throw error
                }
            },

            signOut: async () => {
                const { error } = await supabase.auth.signOut()
                if (error) throw error

                set({
                    user: null,
                    isAuthenticated: false
                })
            },

            updateUser: async (updates: Partial<User>) => {
                const { user } = get()
                if (!user) return

                const profileUpdate: ProfileUpdate = {}

                if (updates.full_name !== undefined) {
                    profileUpdate.full_name = updates.full_name || null
                }
                if (updates.avatar_url !== undefined) {
                    profileUpdate.avatar_url = updates.avatar_url || null
                }
                if (updates.subscription_tier !== undefined) {
                    profileUpdate.subscription_tier = updates.subscription_tier
                }
                if (updates.business_info !== undefined) {
                    profileUpdate.business_info = updates.business_info
                }
                if (updates.settings !== undefined) {
                    profileUpdate.settings = updates.settings
                }

                profileUpdate.updated_at = new Date().toISOString()

                const { data, error } = await supabase
                    .from('profiles')
                    .update(profileUpdate)
                    .eq('id', user.id)
                    .select()
                    .single()

                if (error) throw error

                if (data) {
                    const updatedUser = profileToUser(data as DatabaseProfile)
                    set({ user: updatedUser })
                }
            },

            checkAuth: async () => {
                const state = get()

                // Se já temos um usuário persistido e não verificamos ainda, usa ele primeiro
                if (state.user && state.isAuthenticated && !state._hasHydrated) {
                    set({ _hasHydrated: true, isLoading: false })
                }

                try {
                    const { data: { session } } = await supabase.auth.getSession()

                    if (session?.user) {
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()

                        if (profileError) {
                            console.error('Erro ao verificar autenticação:', profileError)
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                                _hasHydrated: true
                            })
                            return
                        }

                        if (profile) {
                            const user = profileToUser(profile as DatabaseProfile)
                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                _hasHydrated: true
                            })
                        }
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            _hasHydrated: true
                        })
                    }
                } catch (error) {
                    console.error('Erro na verificação de autenticação:', error)
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        _hasHydrated: true
                    })
                }
            },

            // Método para marcar como hidratado
            setHasHydrated: () => {
                set({ _hasHydrated: true })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                // Quando a hidratação terminar, marca como hidratado e remove loading
                if (state) {
                    state._hasHydrated = true
                    state.isLoading = false
                }
            }
        }
    )
)