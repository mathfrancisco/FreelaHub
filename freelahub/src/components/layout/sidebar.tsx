'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Zap,
    Brain,
    Settings,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Calendar,
    Image,
    Mail,
    Target,
    TrendingUp,
    Workflow,
    Bell,
    BookOpen,
    Lightbulb,
    Sparkles
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {cn} from "@/lib/utils/utils";

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'from-purple-500 to-blue-500'
    },
    {
        name: 'Gestão de Conteúdo',
        icon: FileText,
        color: 'from-emerald-500 to-cyan-500',
        children: [
            { name: 'Editor de Posts', href: '/content/editor', icon: PlusCircle },
            { name: 'Calendário Editorial', href: '/content/calendar', icon: Calendar },
            { name: 'Templates', href: '/content/templates', icon: BookOpen },
            { name: 'Biblioteca de Mídia', href: '/content/media', icon: Image },
            { name: 'Análise de Performance', href: '/content/analytics', icon: TrendingUp },
        ],
    },
    {
        name: 'CRM & Leads',
        icon: Users,
        color: 'from-orange-500 to-red-500',
        children: [
            { name: 'Lista de Leads', href: '/crm/leads', icon: Users },
            { name: 'Pipeline de Vendas', href: '/crm/pipeline', icon: Target },
            { name: 'Histórico de Interações', href: '/crm/interactions', icon: Mail },
            { name: 'Projetos', href: '/crm/projects', icon: FileText },
            { name: 'Relatórios CRM', href: '/crm/reports', icon: BarChart3 },
        ],
    },
    {
        name: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        color: 'from-violet-500 to-purple-500'
    },
    {
        name: 'Automação',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        children: [
            { name: 'Workflows', href: '/automation/workflows', icon: Workflow },
            { name: 'Lembretes', href: '/automation/reminders', icon: Bell },
            { name: 'Templates de Email', href: '/automation/email-templates', icon: Mail },
        ],
    },
    {
        name: 'IA & Insights',
        icon: Brain,
        color: 'from-indigo-500 to-blue-500',
        children: [
            { name: 'Análise de Conteúdo', href: '/ai/content-analysis', icon: FileText },
            { name: 'Sugestões Inteligentes', href: '/ai/suggestions', icon: Lightbulb },
            { name: 'Predições', href: '/ai/predictions', icon: TrendingUp },
        ],
    },
    {
        name: 'Configurações',
        href: '/settings',
        icon: Settings,
        color: 'from-slate-500 to-gray-500'
    },
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const pathname = usePathname()

    const toggleExpanded = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(item => item !== itemName)
                : [...prev, itemName]
        )
    }

    const isActive = (href: string) => pathname === href
    const isParentActive = (children: any[]) =>
        children.some(child => pathname === child.href)

    return (
        <div className={cn(
            "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 flex flex-col shadow-2xl",
            isCollapsed ? "w-16" : "w-72"
        )}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

            {/* Header */}
            <div className="relative p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    FreelaHub
                                </h1>
                                <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 text-xs mt-1">
                                    Pro
                                </Badge>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-9 w-9 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-white transition-all"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                {navigation.map((item) => {
                    if (item.children) {
                        const isExpanded = expandedItems.includes(item.name)
                        const hasActiveChild = isParentActive(item.children)

                        return (
                            <div key={item.name} className="space-y-1">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start group relative overflow-hidden transition-all duration-200",
                                        "hover:bg-slate-800/50 hover:shadow-lg hover:scale-[1.02]",
                                        hasActiveChild && "bg-gradient-to-r from-slate-800/80 to-slate-700/50 shadow-lg border border-slate-600/30"
                                    )}
                                    onClick={() => !isCollapsed && toggleExpanded(item.name)}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity",
                                        item.color
                                    )}></div>

                                    <div className={cn(
                                        "p-2 rounded-lg mr-3 transition-all group-hover:scale-110",
                                        hasActiveChild
                                            ? `bg-gradient-to-br ${item.color} shadow-lg`
                                            : "bg-slate-700/50 group-hover:bg-slate-600/50"
                                    )}>
                                        <item.icon className={cn(
                                            "h-4 w-4 transition-colors",
                                            hasActiveChild ? "text-white" : "text-slate-300"
                                        )} />
                                    </div>

                                    {!isCollapsed && (
                                        <>
                                            <span className={cn(
                                                "font-medium transition-colors",
                                                hasActiveChild ? "text-white" : "text-slate-300 group-hover:text-white"
                                            )}>
                                                {item.name}
                                            </span>
                                            <ChevronRight
                                                className={cn(
                                                    "ml-auto h-4 w-4 transition-all",
                                                    isExpanded && "rotate-90",
                                                    hasActiveChild ? "text-white" : "text-slate-400"
                                                )}
                                            />
                                        </>
                                    )}
                                </Button>

                                {!isCollapsed && isExpanded && (
                                    <div className="ml-6 space-y-1 pl-4 border-l border-slate-700/50">
                                        {item.children.map((child) => (
                                            <Link key={child.href} href={child.href}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "w-full justify-start group relative overflow-hidden transition-all duration-200",
                                                        "hover:bg-slate-800/30 hover:scale-[1.02]",
                                                        isActive(child.href) && "bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-md border border-purple-500/30"
                                                    )}
                                                >
                                                    <child.icon className={cn(
                                                        "h-4 w-4 mr-3 transition-colors",
                                                        isActive(child.href) ? "text-purple-300" : "text-slate-400 group-hover:text-slate-300"
                                                    )} />
                                                    <span className={cn(
                                                        "text-sm transition-colors",
                                                        isActive(child.href) ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300"
                                                    )}>
                                                        {child.name}
                                                    </span>
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    }

                    return (
                        <Link key={item.name} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start group relative overflow-hidden transition-all duration-200",
                                    "hover:bg-slate-800/50 hover:shadow-lg hover:scale-[1.02]",
                                    isActive(item.href) && "bg-gradient-to-r from-slate-800/80 to-slate-700/50 shadow-lg border border-slate-600/30"
                                )}
                            >
                                {/* Gradient overlay on hover */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity",
                                    item.color
                                )}></div>

                                <div className={cn(
                                    "p-2 rounded-lg mr-3 transition-all group-hover:scale-110",
                                    isActive(item.href)
                                        ? `bg-gradient-to-br ${item.color} shadow-lg`
                                        : "bg-slate-700/50 group-hover:bg-slate-600/50"
                                )}>
                                    <item.icon className={cn(
                                        "h-4 w-4 transition-colors",
                                        isActive(item.href) ? "text-white" : "text-slate-300"
                                    )} />
                                </div>

                                {!isCollapsed && (
                                    <span className={cn(
                                        "font-medium transition-colors",
                                        isActive(item.href) ? "text-white" : "text-slate-300 group-hover:text-white"
                                    )}>
                                        {item.name}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-slate-700/50">
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-3 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-300 font-medium">Sistema Online</span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Todos os sistemas operando normalmente
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}