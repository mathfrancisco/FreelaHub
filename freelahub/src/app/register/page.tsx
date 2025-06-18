'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import LandingHeader from "@/components/layout/home/landingHeader"
import Footer from "@/components/layout/home/footer"

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const { signUp } = useAuthStore()
    const router = useRouter()

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Nome completo é obrigatório')
            return false
        }

        if (!formData.email.trim()) {
            setError('Email é obrigatório')
            return false
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await signUp(formData.email, formData.password, formData.fullName)
            setIsSuccess(true)

            // Redireciona após 2 segundos para mostrar a mensagem de sucesso
            setTimeout(() => {
                router.push('/login?message=registration-success')
            }, 2000)
        } catch (error: any) {
            console.error('Erro no registro:', error)
            setError(error.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        // Limpa o erro quando o usuário começa a digitar
        if (error) {
            setError('')
        }
    }

    // Tela de sucesso
    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col">
                <LandingHeader />

                <main className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 pt-24">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Conta criada com sucesso!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Verifique seu email para confirmar sua conta e fazer login.
                            </p>
                            <div className="animate-pulse text-sm text-gray-500">
                                Redirecionando para o login...
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        )
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
                            Crie sua conta
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Comece a usar nossa plataforma hoje mesmo
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                            {/* Nome Completo */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
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
                                        className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha *
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
                                        className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Mínimo 6 caracteres"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    A senha deve ter pelo menos 6 caracteres
                                </p>
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Senha *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Confirme sua senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Mensagem de Erro */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Termos e Condições */}
                            <div className="text-xs text-gray-500">
                                Ao criar uma conta, você concorda com nossos{' '}
                                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                                    Termos de Uso
                                </Link>{' '}
                                e{' '}
                                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                                    Política de Privacidade
                                </Link>
                                .
                            </div>

                            {/* Botão de Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Criar Conta'
                                )}
                            </button>
                        </div>

                        {/* Link para Login */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link
                                    href="/login"
                                    className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                                >
                                    Faça login
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