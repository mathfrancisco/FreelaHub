import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {cn, formatDateTime} from "@/lib/utils/utils"

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
                return '📝'
            case 'lead':
                return '👤'
            case 'interaction':
                return '💬'
            case 'reminder':
                return '⏰'
            default:
                return '📋'
        }
    }

    const getStatusColor = (status?: ActivityItem['status']) => {
        switch (status) {
            case 'success':
                return 'text-green-600'
            case 'warning':
                return 'text-yellow-600'
            case 'error':
                return 'text-red-600'
            default:
                return 'text-muted-foreground'
        }
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                    Suas últimas ações no sistema
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={activity.avatar} />
                            <AvatarFallback>
                                {getActivityIcon(activity.type)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none">
                                {activity.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {activity.description}
                            </p>
                            <p className={cn(
                                "text-xs mt-1",
                                getStatusColor(activity.status)
                            )}>
                                {formatDateTime(activity.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}
                {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma atividade recente
                    </p>
                )}
            </CardContent>
        </Card>
    )
}