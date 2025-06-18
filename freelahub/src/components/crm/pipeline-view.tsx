import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lead } from "@/lib/types"
import { cn } from "@/lib/utils/utils"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { formatCurrency } from "@/lib/utils/utils";

interface PipelineColumn {
    id: Lead['status']
    title: string
    leads: Lead[]
    color: string
}

interface PipelineViewProps {
    columns: PipelineColumn[]
    onLeadMove?: (leadId: string, newStatus: Lead['status'], sourceIndex: number, destinationIndex: number) => void
    onLeadClick?: (lead: Lead) => void
    className?: string
}

export function PipelineView({ columns, onLeadMove, onLeadClick, className }: PipelineViewProps) {
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        // Se não houver destino ou se o item voltou ao mesmo lugar, não faz nada
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return
        }
        
        if (onLeadMove) {
            onLeadMove(draggableId, destination.droppableId as Lead['status'], source.index, destination.index)
        }
    }

    return (
        <div className={cn("flex space-x-4 overflow-x-auto pb-4", className)}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {columns.map((column) => (
                    <div key={column.id} className="flex-shrink-0 w-80">
                        <Card className="flex flex-col h-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <div className={cn("w-3 h-3 rounded-full", column.color)}></div>
                                        {column.title}
                                    </CardTitle>
                                    <div className="bg-muted text-muted-foreground w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold">
                                        {column.leads.length}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={cn(
                                                "space-y-2 min-h-[400px] p-2 rounded-lg transition-colors duration-200",
                                                snapshot.isDraggingOver ? "bg-muted" : "bg-transparent"
                                            )}
                                        >
                                            {column.leads.map((lead, index) => (
                                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "p-3 bg-card border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200",
                                                                snapshot.isDragging && "shadow-lg scale-105"
                                                            )}
                                                            onClick={() => onLeadClick?.(lead)}
                                                        >
                                                            <div className="font-semibold text-sm text-card-foreground">{lead.name}</div>
                                                            <p className="text-xs text-muted-foreground truncate">{lead.company || lead.email}</p>
                                                            {lead.estimated_value != null && (
                                                                <div className="text-xs font-medium text-green-600 mt-2">
                                                                    {formatCurrency(lead.estimated_value)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </DragDropContext>
        </div>
    )
}
