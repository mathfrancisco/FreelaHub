import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lead } from "@/lib/types"
import { cn } from "@/lib/utils/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface PipelineColumn {
    id: Lead['status']
    title: string
    leads: Lead[]
    color: string
}

interface PipelineViewProps {
    columns: PipelineColumn[]
    onLeadMove?: (leadId: string, newStatus: Lead['status']) => void
    onLeadClick?: (lead: Lead) => void
    className?: string
}

export function PipelineView({ columns, onLeadMove, onLeadClick, className }: PipelineViewProps) {
    const handleDragEnd = (result: any) => {
        if (!result.destination || !onLeadMove) return

        const leadId = result.draggableId
        const newStatus = result.destination.droppableId as Lead['status']

        onLeadMove(leadId, newStatus)
    }

    return (
        <div className={cn("flex space-x-4 overflow-x-auto pb-4", className)}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {columns.map((column) => (
                    <div key={column.id} className="flex-shrink-0 w-80">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        {column.title}
                                    </CardTitle>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                        column.color
                                    )}>
                                        {column.leads.length}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={cn(
                                                "space-y-2 min-h-[200px] p-2 rounded-lg transition-colors",
                                                snapshot.isDraggingOver && "bg-muted/50"
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
                                                                "p-3 bg-background border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow",
                                                                snapshot.isDragging && "shadow-lg"
                                                            )}
                                                            onClick={() => onLeadClick?.(lead)}
                                                        >
                                                            <div className="font-medium text-sm">{lead.name}</div>
                                                            <div className="text-xs text-muted-foreground">{lead.email}</div>
                                                            {lead.estimated_value && (
                                                                <div className="text-xs font-medium text-green-600  mt-1">
                                                                    ${lead.estimated_value.toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}