'use client'

import { useEffect } from 'react'
import { BarChart3, FileText, Target, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useContentStore } from '@/store/content-store'
import { AppLayout } from "@/components/layout/app-layout"
import { StatsCard } from '@/components/dashboard/stats-card'
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ActivityItem } from "@/lib/types"
import {AuthGuard} from "@/components/auth/auth-guard";

/**
 * Componente da página Dashboard com proteção de autenticação
 */
function DashboardContent() {
    const { user } = useAuthStore()
    const { contents, fetchContents, isLoading: isLoadingContent } = useContentStore()

    // Simulação de store CRM (substituir quando o store real for criado)
    const leads: any[] = [] // Substituir por useCRMStore quando disponível
    const isLoadingLeads = false
    const getConversionRate = () => 0
    const getTotalEstimatedValue = () => 0

    useEffect(() => {
        if (user?.id) {
            fetchContents(user.id, {
                limit: 10,
                orderBy: 'created_at',
                orderDirection: 'desc'
            })
            // fetchLeads quando o store CRM estiver disponível
        }
    }, [user?.id, fetchContents])

    // Processamento dos dados
    const totalLeads = leads.length
    const publishedContentCount = contents.filter(c => c.status === 'published').length
    const conversionRate = getConversionRate()
    const totalValue = getTotalEstimatedValue()

    // Dados para o gráfico (exemplo com dados mock)
    const leadsByMonthData = [
        { name: 'Jan', value: 12 },
        { name: 'Fev', value: 19 },
        { name: 'Mar', value: 15 },
        { name: 'Abr', value: 25 },
        { name: 'Mai', value: 22 },
        { name: 'Jun', value: 30 }
    ]

    // Atividades recentes
    const recentActivities: ActivityItem[] = [
        ...contents.slice(0, 5).map(content => ({
            id: `content-${content.id}`,
            type: 'content' as const,
            title: `Novo conteúdo: ${content.title}`,
            description: `Status: ${content.status}`,
            timestamp: content.created_at,
            avatar: user?.avatar_url,
        })),
        ...leads.slice(0, 5).map((lead: any) => ({
            id: `lead-${lead.id}`,
            type: 'lead' as const,
            title: `Novo lead: ${lead.name}`,
            description: `Fonte: ${lead.source} | Status: ${lead.status}`,
            timestamp: lead.created_at,
            avatar: user?.avatar_url,
        })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (isLoadingContent || isLoadingLeads) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando dados do dashboard...</p>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Cabeçalho de Boas-Vindas */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Olá, {user?.full_name?.split(' ')[0] || 'Usuário'}! 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Aqui está um resumo rápido do seu negócio.
                        </p>
                    </div>
                </div>

                {/* Grid de Métricas Principais */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total de Leads"
                        value={totalLeads}
                        icon={Target}
                        description="Leads cadastrados no período."
                        change={{ value: 15, type: 'increase' }}
                    />
                    <StatsCard
                        title="Conteúdos Publicados"
                        value={publishedContentCount}
                        icon={FileText}
                        description="Posts, vídeos e artigos no ar."
                        change={{ value: 5, type: 'increase' }}
                    />
                    <StatsCard
                        title="Taxa de Conversão"
                        value={`${conversionRate.toFixed(2)}%`}
                        icon={BarChart3}
                        description="Percentual de leads convertidos."
                        change={{ value: 1.2, type: 'decrease' }}
                    />
                    <StatsCard
                        title="Valor em Pipeline"
                        value={new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(totalValue)}
                        icon={TrendingUp}
                        description="Valor estimado dos leads em aberto."
                        change={{ value: 2500, type: 'increase' }}
                    />
                </div>

                {/* Grid de Gráficos e Atividades */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <OverviewChart
                        className="lg:col-span-2"
                        title="Crescimento de Leads"
                        description="Novos leads cadastrados nos últimos meses."
                        data={leadsByMonthData}
                        type="bar"
                    />

                    <RecentActivity
                        className="lg:col-span-1"
                        activities={recentActivities}
                    />
                </div>
            </div>
        </AppLayout>
    )
}

/**
 * Página Dashboard com proteção de autenticação
 */
export default function DashboardPage() {
    return (
        <AuthGuard>
            <DashboardContent />
        </AuthGuard>
    )
}