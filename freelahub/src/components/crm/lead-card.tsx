import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Mail,
    Phone,
    Building,
    Calendar,
    DollarSign,
    MessageSquare,
    MoreVertical
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Lead } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils/utils"
import { cn } from "@/lib/utils/utils"

interface LeadCardProps {
    lead: Lead
    onEdit?: (lead: Lead) => void
    onDelete?: (leadId: string) => void
    onContact?: (lead: Lead) => void
    className?: string
}

export function LeadCard({ lead, onEdit, onDelete, onContact, className }: LeadCardProps) {
    const getStatusColor = (status: Lead['status']) => {
        const colors = {
            'new': 'bg-blue-500',
            'contacted': 'bg-yellow-500',
            'qualified': 'bg-green-500',
            'proposal': 'bg-purple-500',
            'negotiation': 'bg-orange-500',
            'won': 'bg-emerald-500',
            'lost': 'bg-red-500'
        }
        return colors[status] || 'bg-gray-500'
    }

    const getStatusLabel = (status: Lead['status']) => {
        const labels = {
            'new': 'Novo',
            'contacted': 'Contatado',
            'qualified': 'Qualificado',
            'proposal': 'Proposta',
            'negotiation': 'Negociação',
            'won': 'Ganho',
            'lost': 'Perdido'
        }
        return labels[status] || status
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <Card className={cn("hover:shadow-md transition-shadow", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${lead.name}`} />
                            <AvatarFallback>
                                {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold leading-none">
                                {lead.name}
                            </h3>
                            {lead.position && lead.company && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {lead.position} @ {lead.company}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    variant="secondary"
                                    className={cn("text-white", getStatusColor(lead.status))}
                                >
                                    {getStatusLabel(lead.status)}
                                </Badge>
                                <span className={cn("text-sm font-medium", getScoreColor(lead.score))}>
                  Score: {lead.score}
                </span>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(lead)}>
                                    Editar
                                </DropdownMenuItem>
                            )}
                            {onContact && (
                                <DropdownMenuItem onClick={() => onContact(lead)}>
                                    Contatar
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(lead.id)}
                                    className="text-destructive"
                                >
                                    Excluir
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{lead.email}</span>
                </div>

                {lead.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.phone}</span>
                    </div>
                )}

                {lead.company && (
                    <div className="flex items-center space-x-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.company}</span>
                    </div>
                )}

                {lead.estimated_value && (
                    <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-green-600">
              {formatCurrency(lead.estimated_value)}
            </span>
                    </div>
                )}

                {lead.next_action_date && (
                    <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Próxima ação: {formatDate(lead.next_action_date)}</span>
                    </div>
                )}

                {lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {lead.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {lead.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{lead.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Criado em {formatDate(lead.created_at)}
          </span>
                    <Button size="sm" variant="outline" onClick={() => onContact?.(lead)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contatar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
