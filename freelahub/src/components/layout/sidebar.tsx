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
    Lightbulb
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {cn} from "@/lib/utils/utils";

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Gestão de Conteúdo',
        icon: FileText,
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
    },
    {
        name: 'Automação',
        icon: Zap,
        children: [
            { name: 'Workflows', href: '/automation/workflows', icon: Workflow },
            { name: 'Lembretes', href: '/automation/reminders', icon: Bell },
            { name: 'Templates de Email', href: '/automation/email-templates', icon: Mail },
        ],
    },
    {
        name: 'IA & Insights',
        icon: Brain,
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
            "bg-card border-r border-border transition-all duration-300 flex flex-col",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-primary">FreelaHub</h1>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    if (item.children) {
                        const isExpanded = expandedItems.includes(item.name)
                        const hasActiveChild = isParentActive(item.children)

                        return (
                            <div key={item.name} className="space-y-1">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        hasActiveChild && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => !isCollapsed && toggleExpanded(item.name)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {!isCollapsed && (
                                        <>
                                            <span className="ml-2">{item.name}</span>
                                            <ChevronRight
                                                className={cn(
                                                    "ml-auto h-4 w-4 transition-transform",
                                                    isExpanded && "rotate-90"
                                                )}
                                            />
                                        </>
                                    )}
                                </Button>

                                {!isCollapsed && isExpanded && (
                                    <div className="ml-4 space-y-1">
                                        {item.children.map((child) => (
                                            <Link key={child.href} href={child.href}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "w-full justify-start",
                                                        isActive(child.href) && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <child.icon className="h-4 w-4" />
                                                    <span className="ml-2">{child.name}</span>
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
                                    "w-full justify-start",
                                    isActive(item.href) && "bg-accent text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {!isCollapsed && <span className="ml-2">{item.name}</span>}
                            </Button>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}