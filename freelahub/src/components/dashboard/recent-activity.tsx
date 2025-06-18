import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDateTime } from "@/lib/utils/utils"

interface ActivityItem {
    id: string
    type: 'content' | 'lead' | 'interaction' | 'reminder'
    title: string
    description: string
    timestamp: string
    avatar?: string
    status?: 'success' | 'warning' | 'error'
}

interface RecentActivityProps {
    activities: ActivityItem[]
    className?: string
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'content':
                return { icon: '📝', bg: 'bg-purple-100', text: 'text-purple-700' }
            case 'lead':
                return { icon: '👤', bg: 'bg-blue-100', text: 'text-blue-700' }
            case 'interaction':
                return { icon: '💬', bg: 'bg-slate-100', text: 'text-slate-700' }
            case 'reminder':
                return { icon: '⏰', bg: 'bg-indigo-100', text: 'text-indigo-700' }
            default:
                return { icon: '📋', bg: 'bg-gray-100', text: 'text-gray-700' }
        }
    }

    const getStatusBadge = (status?: ActivityItem['status']) => {
        switch (status) {
            case 'success':
                return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Sucesso</Badge>
            case 'warning':
                return <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">Atenção</Badge>
            case 'error':
                return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Erro</Badge>
            default:
                return null
        }
    }

    return (
        <Card className={cn(
            "border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300",
            className
        )}>
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    Atividade Recente
                </CardTitle>
                <CardDescription className="text-slate-600">
                    Suas últimas ações no sistema
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activities.map((activity, index) => {
                        const activityStyle = getActivityIcon(activity.type)
                        return (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 transition-colors duration-200 border border-slate-100"
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activityStyle.bg} ${activityStyle.text} text-sm font-medium`}>
                                    {activityStyle.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {activity.title}
                                        </p>
                                        {getStatusBadge(activity.status)}
                                    </div>
                                    <p className="text-xs text-slate-600 mb-1">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {formatDateTime(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    {activities.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-slate-400 text-xl">📋</span>
                            </div>
                            <p className="text-slate-500 text-sm">Nenhuma atividade recente</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}