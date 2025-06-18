import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Mail,
    Phone,
    MessageSquare,
    Calendar,
    Clock,
    User,
    FileText,
    ExternalLink,
    Plus
} from "lucide-react"
import { formatDate } from "@/lib/utils/utils"
import { cn } from "@/lib/utils/utils"

export interface Interaction {
    id: string
    type: 'email' | 'call' | 'meeting' | 'note' | 'task'
    title: string
    description?: string
    date: string
    duration?: number // em minutos
    contact_person?: string
    outcome?: string
    next_action?: string
    next_action_date?: string
    attachments?: Array<{
        id: string
        name: string
        url: string
    }>
    created_by?: string
    created_at: string
}

interface InteractionsProps {
    interactions: Interaction[]
    onAddInteraction?: () => void
    onEditInteraction?: (interaction: Interaction) => void
    onDeleteInteraction?: (interactionId: string) => void
    className?: string
}

export function Interactions({
                                 interactions,
                                 onAddInteraction,
                                 onEditInteraction,
                                 onDeleteInteraction,
                                 className
                             }: InteractionsProps) {
    const getInteractionIcon = (type: Interaction['type']) => {
        const icons = {
            email: <Mail className="h-4 w-4" />,
            call: <Phone className="h-4 w-4" />,
            meeting: <Calendar className="h-4 w-4" />,
            note: <FileText className="h-4 w-4" />,
            task: <Clock className="h-4 w-4" />
        }
        return icons[type]
    }

    const getInteractionColor = (type: Interaction['type']) => {
        const colors = {
            email: 'bg-blue-100 text-blue-700 border-blue-200',
            call: 'bg-green-100 text-green-700 border-green-200',
            meeting: 'bg-purple-100 text-purple-700 border-purple-200',
            note: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            task: 'bg-orange-100 text-orange-700 border-orange-200'
        }
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200'
    }

    const getInteractionLabel = (type: Interaction['type']) => {
        const labels = {
            email: 'E-mail',
            call: 'Ligação',
            meeting: 'Reunião',
            note: 'Anotação',
            task: 'Tarefa'
        }
        return labels[type]
    }

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}min`
        }
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
    }

    return (
        <Card className={cn("", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Interações</CardTitle>
                    {onAddInteraction && (
                        <Button size="sm" onClick={onAddInteraction}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Interação
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {interactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhuma interação registrada ainda</p>
                            {onAddInteraction && (
                                <Button variant="outline" size="sm" className="mt-2" onClick={onAddInteraction}>
                                    Adicionar primeira interação
                                </Button>
                            )}
                        </div>
                    ) : (
                        interactions.map((interaction) => (
                            <div
                                key={interaction.id}
                                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={cn(
                                            "p-2 rounded-full border",
                                            getInteractionColor(interaction.type)
                                        )}>
                                            {getInteractionIcon(interaction.type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-semibold text-sm">{interaction.title}</h4>
                                                <Badge variant="outline" className="text-xs">
                                                    {getInteractionLabel(interaction.type)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                <span>{formatDate(interaction.date)}</span>
                                                {interaction.duration && (
                                                    <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                                                        {formatDuration(interaction.duration)}
                          </span>
                                                )}
                                                {interaction.contact_person && (
                                                    <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                                                        {interaction.contact_person}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        {onEditInteraction && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEditInteraction(interaction)}
                                            >
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {interaction.description && (
                                    <p className="text-sm text-muted-foreground mb-3 ml-11">
                                        {interaction.description}
                                    </p>
                                )}

                                {interaction.outcome && (
                                    <div className="ml-11 mb-3">
                                        <div className="bg-muted p-3 rounded-md">
                                            <p className="text-sm">
                                                <span className="font-medium">Resultado:</span> {interaction.outcome}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {interaction.next_action && (
                                    <div className="ml-11 mb-3">
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-medium">Próxima ação:</span> {interaction.next_action}
                                                {interaction.next_action_date && (
                                                    <span className="block mt-1 text-xs">
                            Data: {formatDate(interaction.next_action_date)}
                          </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {interaction.attachments && interaction.attachments.length > 0 && (
                                    <div className="ml-11 mb-3">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Anexos:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {interaction.attachments.map((attachment) => (
                                                <Button
                                                    key={attachment.id}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs"
                                                    onClick={() => window.open(attachment.url, '_blank')}
                                                >
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    {attachment.name}
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="ml-11 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {interaction.created_by && (
                        <>Criado por {interaction.created_by} • </>
                    )}
                      {formatDate(interaction.created_at)}
                  </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}