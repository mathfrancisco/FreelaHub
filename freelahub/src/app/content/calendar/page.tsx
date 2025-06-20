'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { AppLayout } from '@/components/layout/app-layout'
import { ContentCalendar } from '@/components/content/content-calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Filter,
    Calendar,
    TrendingUp,
    Users,
    Eye,
    BarChart3,
    Clock,
    CheckCircle
} from 'lucide-react'
import { Content } from '@/lib/types'
import {useAuthStore} from "@/store/auth-store";
import {useContentStore} from "@/store/content-store";

export default function ContentCalendarPage() {
    const { user } = useAuthStore()
    const {
        contents,
        isLoading,
        error,
        filters,
        fetchContents,
        updateContent,
        deleteContent,
        duplicateContent,
        publishContent,
        scheduleContent,
        archiveContent,
        clearError
    } = useContentStore()

    const [isInitialized, setIsInitialized] = useState(false)

    // Carregar conteúdos ao montar o componente
    useEffect(() => {
        if (user?.id && !isInitialized) {
            fetchContents(user.id)
            setIsInitialized(true)
        }
    }, [user?.id, fetchContents, isInitialized])

    // Limpar erro ao desmontar
    useEffect(() => {
        return () => {
            clearError()
        }
    }, [clearError])

    // Estatísticas do conteúdo
    const stats = {
        total: contents.length,
        published: contents.filter(c => c.status === 'published').length,
        scheduled: contents.filter(c => c.status === 'scheduled').length,
        draft: contents.filter(c => c.status === 'draft').length,
        thisMonth: contents.filter(c => {
            const contentDate = c.scheduled_for || c.published_at
            if (!contentDate) return false
            const date = new Date(contentDate)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length
    }

    // Atividades recentes baseadas nos conteúdos
    const recentActivities = contents
        .filter(c => c.status === 'published' || c.status === 'scheduled')
        .sort((a, b) => {
            const dateA = new Date(a.updated_at)
            const dateB = new Date(b.updated_at)
            return dateB.getTime() - dateA.getTime()
        })
        .slice(0, 3)
        .map(content => ({
            id: content.id,
            title: content.status === 'published' ? 'Post publicado com sucesso' : 'Conteúdo agendado',
            description: content.title,
            timestamp: content.updated_at,
            status: content.status === 'published' ? 'success' : 'info',
            color: content.status === 'published' ? 'bg-green-500' : 'bg-blue-500'
        }))

    const handleContentClick = (content: Content) => {
        console.log('Visualizar conteúdo:', content)
        // TODO: Implementar navegação para visualizar o conteúdo
        // router.push(`/content/${content.id}`)
    }

    const handleContentEdit = (content: Content) => {
        console.log('Editar conteúdo:', content)
        // TODO: Implementar navegação para editar o conteúdo
        // router.push(`/content/${content.id}/edit`)
    }

    const handleContentDelete = async (contentId: string) => {
        if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
            try {
                await deleteContent(contentId)
            } catch (error) {
                console.error('Erro ao excluir conteúdo:', error)
            }
        }
    }

    const handleContentDuplicate = async (contentId: string) => {
        try {
            await duplicateContent(contentId)
        } catch (error) {
            console.error('Erro ao duplicar conteúdo:', error)
        }
    }

    const handleContentPublish = async (contentId: string) => {
        try {
            await publishContent(contentId)
        } catch (error) {
            console.error('Erro ao publicar conteúdo:', error)
        }
    }

    const handleContentSchedule = async (contentId: string, scheduledFor: string) => {
        try {
            await scheduleContent(contentId, scheduledFor)
        } catch (error) {
            console.error('Erro ao agendar conteúdo:', error)
        }
    }

    const handleContentArchive = async (contentId: string) => {
        try {
            await archiveContent(contentId)
        } catch (error) {
            console.error('Erro ao arquivar conteúdo:', error)
        }
    }

    const handleAddContent = (date: Date) => {
        console.log('Adicionar conteúdo para:', date)
        // TODO: Implementar navegação para criar novo conteúdo
        // router.push(`/content/new?date=${date.toISOString()}`)
    }

    const handleCreatePost = () => {
        console.log('Criar post')
        // TODO: Implementar navegação para criar novo post
        // router.push('/content/new?type=post')
    }

    const handleScheduleContent = () => {
        console.log('Agendar conteúdo')
        // TODO: Implementar modal ou navegação para agendar conteúdo
    }

    const handleManageCampaigns = () => {
        console.log('Gerenciar campanhas')
        // TODO: Implementar navegação para campanhas
        // router.push('/campaigns')
    }

    const handleViewReports = () => {
        console.log('Ver relatórios')
        // TODO: Implementar navegação para relatórios
        // router.push('/reports')
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 60) {
            return `Há ${diffInMinutes} min`
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60)
            return `Há ${hours} hora${hours > 1 ? 's' : ''}`
        } else {
            const days = Math.floor(diffInMinutes / 1440)
            return `Há ${days} dia${days > 1 ? 's' : ''}`
        }
    }

    if (isLoading && !isInitialized) {
        return (
            <AuthGuard>
                <AppLayout>
                    <div className="p-6 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">Carregando calendário...</p>
                        </div>
                    </div>
                </AppLayout>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <AppLayout>
                <div className="p-6 space-y-6">
                    {/* Error Display */}
                    {error && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-red-800">{error}</p>
                                    <Button variant="ghost" size="sm" onClick={clearError}>
                                        ×
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Page Header */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    Calendário Editorial
                                </h1>
                                <p className="text-slate-600 mt-1">
                                    Gerencie e acompanhe todo seu conteúdo em um só lugar
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtros
                                </Button>
                                <Button onClick={handleCreatePost}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Novo Conteúdo
                                </Button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">Total</p>
                                            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                                        </div>
                                        <div className="p-2 bg-blue-500 rounded-lg">
                                            <BarChart3 className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-700">Publicados</p>
                                            <p className="text-2xl font-bold text-green-900">{stats.published}</p>
                                        </div>
                                        <div className="p-2 bg-green-500 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-orange-700">Agendados</p>
                                            <p className="text-2xl font-bold text-orange-900">{stats.scheduled}</p>
                                        </div>
                                        <div className="p-2 bg-orange-500 rounded-lg">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Rascunhos</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                                        </div>
                                        <div className="p-2 bg-gray-500 rounded-lg">
                                            <Eye className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-700">Este Mês</p>
                                            <p className="text-2xl font-bold text-purple-900">{stats.thisMonth}</p>
                                        </div>
                                        <div className="p-2 bg-purple-500 rounded-lg">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-slate-600" />
                                Ações Rápidas
                            </CardTitle>
                            <CardDescription>
                                Acesse rapidamente as funcionalidades mais utilizadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white hover:bg-slate-50"
                                    onClick={handleCreatePost}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Criar Post
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white hover:bg-slate-50"
                                    onClick={handleScheduleContent}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Agendar Conteúdo
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white hover:bg-slate-50"
                                    onClick={handleManageCampaigns}
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Gerenciar Campanhas
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white hover:bg-slate-50"
                                    onClick={handleViewReports}
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Ver Relatórios
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Calendar Component */}
                    <ContentCalendar
                        contents={contents}
                        onContentClick={handleContentClick}
                        onContentEdit={handleContentEdit}
                        onContentDelete={handleContentDelete}
                        onAddContent={handleAddContent}
                        className="bg-white rounded-xl shadow-sm border border-slate-200"
                        isLoading={isLoading}
                    />

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Atividade Recente
                            </CardTitle>
                            <CardDescription>
                                Últimas ações realizadas no seu conteúdo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivities.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Nenhuma atividade recente</p>
                                        <p className="text-sm">Suas ações aparecerão aqui</p>
                                    </div>
                                ) : (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                                                <div>
                                                    <p className="text-sm font-medium">{activity.title}</p>
                                                    <p className="text-xs text-slate-600">{activity.description}</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {formatTimeAgo(activity.timestamp)}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </AuthGuard>
    )
}