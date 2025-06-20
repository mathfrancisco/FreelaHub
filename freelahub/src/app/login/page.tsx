'use client'

import { useState} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import LandingHeader from "@/components/layout/home/landingHeader"
import Footer from "@/components/layout/home/footer"
import {useAuthPage} from "@/lib/hooks/useAuth";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { signIn } = useAuthStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isLoading: authLoading } = useAuthPage()

    // Se ainda está carregando a autenticação, mostra loading
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await signIn(formData.email, formData.password)

            // Verifica se há um parâmetro de redirecionamento
            const redirectTo = searchParams.get('redirectTo')
            if (redirectTo && redirectTo.startsWith('/')) {
                router.push(redirectTo)
            } else {
                router.push('/dashboard')
            }
        } catch (error: any) {
            setError(error.message || 'Ocorreu um erro. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-24">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Entre na sua conta
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Acesse seu dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Sua senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Mensagem de Erro */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Botão de Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </div>

                        {/* Link para Registro */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link
                                    href="/register"
                                    className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                                >
                                    Registre-se
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}