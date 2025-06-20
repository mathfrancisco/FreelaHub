import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar,
    Clock,
    Eye,
    Edit,
    Trash2
} from "lucide-react"
import {Content} from "@/lib/types"
import {cn} from "@/lib/utils/utils"
import {format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth} from "date-fns"
import {ptBR} from "date-fns/locale"

interface ContentCalendarProps {
    contents: Content[],
    onContentClick?: (content: Content) => void,
    onContentEdit?: (content: Content) => void,
    onContentDelete?: (contentId: string) => void,
    onAddContent?: (date: Date) => void,
    className?: string,
    isLoading?: any
}

const statusColors = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    published: 'bg-green-100 text-green-700 border-green-200',
    archived: 'bg-orange-100 text-orange-700 border-orange-200'
}

const statusLabels = {
    draft: 'Rascunho',
    scheduled: 'Agendado',
    published: 'Publicado',
    archived: 'Arquivado'
}

const contentTypeIcons = {
    post: '📝',
    article: '📄',
    video: '🎥',
    image: '🖼️',
    story: '📖'
}

export function ContentCalendar({
                                    contents,
                                    onContentClick,
                                    onContentEdit,
                                    onContentDelete,
                                    onAddContent,
                                    className,
                                    isLoading
                                }: ContentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarDays = eachDayOfInterval({start: monthStart, end: monthEnd})

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const getContentForDate = (date: Date) => {
        return contents.filter(content => {
            const contentDate = content.scheduled_for || content.published_at
            if (!contentDate) return false
            return isSameDay(new Date(contentDate), date)
        })
    }

    const getSelectedDateContents = () => {
        if (!selectedDate) return []
        return getContentForDate(selectedDate)
    }

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold">Calendário de Conteúdo</h2>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                        <div className="text-lg font-semibold min-w-[150px] text-center">
                            {format(currentDate, 'MMMM yyyy', {locale: ptBR})}
                        </div>
                        <Button variant="outline" size="icon" onClick={goToNextMonth}>
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
                <Button onClick={() => onAddContent?.(new Date())}>
                    <Plus className="h-4 w-4 mr-2"/>
                    Novo Conteúdo
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendário */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-6">
                            {/* Cabeçalho dos dias da semana */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {weekDays.map((day) => (
                                    <div key={day}
                                         className="p-2 text-center text-sm font-medium text-muted-foreground">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Dias do calendário */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day) => {
                                    const dayContents = getContentForDate(day)
                                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                                    const isCurrentMonth = isSameMonth(day, currentDate)

                                    return (
                                        <div
                                            key={day.toString()}
                                            className={cn(
                                                "min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors",
                                                isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                                                !isCurrentMonth && "opacity-50",
                                                isToday(day) && "bg-primary/10 border-primary/30"
                                            )}
                                            onClick={() => setSelectedDate(day)}
                                        >
                                            <div className={cn(
                                                "text-sm font-medium mb-1",
                                                isToday(day) && "text-primary"
                                            )}>
                                                {format(day, 'd')}
                                            </div>

                                            <div className="space-y-1">
                                                {dayContents.slice(0, 3).map((content) => (
                                                    <div
                                                        key={content.id}
                                                        className={cn(
                                                            "text-xs p-1 rounded border cursor-pointer hover:opacity-80",
                                                            statusColors[content.status]
                                                        )}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onContentClick?.(content)
                                                        }}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>{contentTypeIcons[content.content_type]}</span>
                                                            <span className="truncate">{content.title}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {dayContents.length > 3 && (
                                                    <div className="text-xs text-muted-foreground text-center">
                                                        +{dayContents.length - 3} mais
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Detalhes do dia selecionado */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2"/>
                                {selectedDate ? format(selectedDate, "d 'de' MMMM", {locale: ptBR}) : 'Selecione um dia'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedDate ? (
                                <div className="space-y-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => onAddContent?.(selectedDate)}
                                    >
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Adicionar Conteúdo
                                    </Button>

                                    <div className="space-y-3">
                                        {getSelectedDateContents().length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                Nenhum conteúdo agendado para este dia
                                            </p>
                                        ) : (
                                            getSelectedDateContents().map((content) => (
                                                <div key={content.id} className="border rounded-lg p-3">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span>{contentTypeIcons[content.content_type]}</span>
                                                            <span className="font-medium text-sm">{content.title}</span>
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => onContentClick?.(content)}
                                                            >
                                                                <Eye className="h-3 w-3"/>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => onContentEdit?.(content)}
                                                            >
                                                                <Edit className="h-3 w-3"/>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-destructive"
                                                                onClick={() => onContentDelete?.(content.id)}
                                                            >
                                                                <Trash2 className="h-3 w-3"/>
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-xs", statusColors[content.status])}
                                                        >
                                                            {statusLabels[content.status]}
                                                        </Badge>

                                                        {content.scheduled_for && (
                                                            <div
                                                                className="flex items-center text-xs text-muted-foreground">
                                                                <Clock className="h-3 w-3 mr-1"/>
                                                                {format(new Date(content.scheduled_for), 'HH:mm')}
                                                            </div>
                                                        )}

                                                        {content.target_platforms && content.target_platforms.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {content.target_platforms.slice(0, 3).map((platform) => (
                                                                    <Badge key={platform} variant="secondary"
                                                                           className="text-xs">
                                                                        {platform}
                                                                    </Badge>
                                                                ))}
                                                                {content.target_platforms.length > 3 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        +{content.target_platforms.length - 3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Clique em um dia no calendário para ver os conteúdos agendados
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}