'use client'

import { Bell, Search, User, Settings, HelpCircle, LogOut, CreditCard, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'

// Função para obter o nome do plano em português
const getSubscriptionTierName = (tier: string) => {
    const tierNames = {
        starter: 'Iniciante',
        professional: 'Professional',
        business: 'Business',
        enterprise: 'Enterprise'
    }
    return tierNames[tier as keyof typeof tierNames] || 'Starter'
}

// Função para obter a primeira letra do nome para o avatar
const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function Header() {
    const { user, signOut } = useAuthStore()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    return (
        <header className="bg-gradient-to-r from-white via-slate-50 to-white border-b border-slate-200/60 shadow-sm backdrop-blur-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Search Section */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-purple-600 transition-colors" />
                                <Input
                                    placeholder="Buscar conteúdo, leads, projetos..."
                                    className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-300 focus:ring-purple-200 focus:ring-2 transition-all shadow-sm hover:shadow-md group-hover:bg-white"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Badge className="bg-slate-100 text-slate-600 text-xs px-2 py-1 font-mono">
                                        ⌘K
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center space-x-3 ml-6">
                        {/* Quick Actions */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                            >
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Ajuda
                            </Button>
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-10 w-10 rounded-xl hover:bg-slate-100 transition-all hover:scale-105 group"
                            >
                                <Bell className="h-5 w-5 text-slate-600 group-hover:text-purple-600 transition-colors" />
                                <div className="absolute -top-1 -right-1">
                                    <div className="h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"></div>
                                    <div className="absolute inset-0 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                                </div>
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-slate-200"></div>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-xl p-0 hover:bg-slate-100 transition-all hover:scale-105 group overflow-hidden"
                                >
                                    {/* Gradient Border Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute inset-[1px] bg-white rounded-[11px] flex items-center justify-center">
                                        {user?.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.full_name || 'Avatar'}
                                                className="h-7 w-7 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="h-7 w-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                                                {getInitials(user?.full_name)}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-64 bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl"
                                sideOffset={8}
                            >
                                {/* User Info Header */}
                                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            {user?.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.full_name || 'Avatar'}
                                                    className="h-10 w-10 rounded-full object-cover shadow-lg"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-medium text-sm">
                                                        {getInitials(user?.full_name)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1">
                                                <div className="h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {user?.full_name || 'Usuário'}
                                            </p>
                                            <p className="text-xs text-slate-600 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            Plano {getSubscriptionTierName(user?.subscription_tier || 'starter')}
                                        </Badge>
                                    </div>
                                </div>

                                <DropdownMenuLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-2">
                                    Conta
                                </DropdownMenuLabel>

                                <DropdownMenuItem className="px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <User className="h-4 w-4 mr-3 text-slate-500" />
                                    <span className="text-sm text-slate-700">Meu Perfil</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Settings className="h-4 w-4 mr-3 text-slate-500" />
                                    <span className="text-sm text-slate-700">Configurações</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <CreditCard className="h-4 w-4 mr-3 text-slate-500" />
                                    <span className="text-sm text-slate-700">Plano & Cobrança</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Shield className="h-4 w-4 mr-3 text-slate-500" />
                                    <span className="text-sm text-slate-700">Privacidade & Segurança</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-slate-100" />

                                <DropdownMenuItem
                                    className="px-4 py-2 hover:bg-red-50 transition-colors cursor-pointer text-red-600 focus:text-red-600"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4 mr-3" />
                                    <span className="text-sm font-medium">Sair da Conta</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Progress bar for loading states (optional) */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-0 transition-all duration-300"></div>
            </div>
        </header>
    )
}