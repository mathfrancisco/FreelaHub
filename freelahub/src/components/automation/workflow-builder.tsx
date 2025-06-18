import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/forms/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Plus,
    Play,
    Trash2,
    ArrowDown,
    ArrowUp,
    Settings,
    Zap,
    Mail,
    MessageSquare,
    Calendar,
    Tag,
    Share2,
    Bell
} from "lucide-react"
import { Workflow, WorkflowAction } from "@/lib/types"
import { cn } from "@/lib/utils/utils"

interface WorkflowBuilderProps {
    workflow?: Partial<Workflow>
    onSave?: (workflow: Partial<Workflow>) => void
    onTest?: (workflow: Partial<Workflow>) => void
    className?: string
}

const triggerTypes = [
    { value: 'new_lead', label: 'Novo Lead', icon: Zap },
    { value: 'content_published', label: 'Conteúdo Publicado', icon: Share2 },
    { value: 'lead_score_change', label: 'Mudança de Score', icon: Tag },
    { value: 'scheduled_time', label: 'Horário Agendado', icon: Calendar },
    { value: 'email_received', label: 'Email Recebido', icon: Mail },
]

const actionTypes = [
    { value: 'send_email', label: 'Enviar Email', icon: Mail },
    { value: 'send_message', label: 'Enviar Mensagem', icon: MessageSquare },
    { value: 'create_reminder', label: 'Criar Lembrete', icon: Bell },
    { value: 'update_lead', label: 'Atualizar Lead', icon: Tag },
    { value: 'add_tag', label: 'Adicionar Tag', icon: Tag },
    { value: 'schedule_content', label: 'Agendar Conteúdo', icon: Calendar },
]

export function WorkflowBuilder({
                                    workflow = {},
                                    onSave,
                                    onTest,
                                    className
                                }: WorkflowBuilderProps) {
    const [currentWorkflow, setCurrentWorkflow] = useState<Partial<Workflow>>({
        name: '',
        description: '',
        trigger_type: '',
        trigger_config: {},
        actions: [],
        status: 'draft',
        ...workflow
    })

    const [isEditing, setIsEditing] = useState(false)

    const addAction = () => {
        const newAction: WorkflowAction = {
            id: `action_${Date.now()}`,
            type: '',
            config: {},
            order: (currentWorkflow.actions?.length || 0) + 1
        }

        setCurrentWorkflow(prev => ({
            ...prev,
            actions: [...(prev.actions || []), newAction]
        }))
    }

    const updateAction = (actionId: string, updates: Partial<WorkflowAction>) => {
        setCurrentWorkflow(prev => ({
            ...prev,
            actions: prev.actions?.map(action =>
                action.id === actionId ? { ...action, ...updates } : action
            ) || []
        }))
    }

    const removeAction = (actionId: string) => {
        setCurrentWorkflow(prev => ({
            ...prev,
            actions: prev.actions?.filter(action => action.id !== actionId) || []
        }))
    }

    const moveAction = (actionId: string, direction: 'up' | 'down') => {
        if (!currentWorkflow.actions) return

        const actions = [...currentWorkflow.actions]
        const index = actions.findIndex(action => action.id === actionId)

        if (direction === 'up' && index > 0) {
            [actions[index], actions[index - 1]] = [actions[index - 1], actions[index]]
        } else if (direction === 'down' && index < actions.length - 1) {
            [actions[index], actions[index + 1]] = [actions[index + 1], actions[index]]
        }

        // Reorder the order property
        actions.forEach((action, idx) => {
            action.order = idx + 1
        })

        setCurrentWorkflow(prev => ({ ...prev, actions }))
    }

    const handleSave = () => {
        onSave?.(currentWorkflow)
        setIsEditing(false)
    }

    const handleTest = () => {
        onTest?.(currentWorkflow)
    }

    const getTriggerIcon = (triggerType: string) => {
        const trigger = triggerTypes.find(t => t.value === triggerType)
        return trigger?.icon || Zap
    }

    const getActionIcon = (actionType: string) => {
        const action = actionTypes.find(a => a.value === actionType)
        return action?.icon || Settings
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Construtor de Workflow</h2>
                    <p className="text-muted-foreground">
                        Automatize suas tarefas com workflows personalizados
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleTest}
                        disabled={!currentWorkflow.trigger_type || !currentWorkflow.actions?.length}
                    >
                        <Play className="h-4 w-4 mr-2" />
                        Testar
                    </Button>
                    <Button onClick={handleSave}>
                        Salvar Workflow
                    </Button>
                </div>
            </div>

            {/* Workflow Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Informações do Workflow
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="workflow-name">Nome do Workflow</Label>
                            <Input
                                id="workflow-name"
                                value={currentWorkflow.name || ''}
                                onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: Nutrição para novos leads"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workflow-status">Status</Label>
                            <Select
                                value={currentWorkflow.status || 'draft'}
                                onValueChange={(value) => setCurrentWorkflow(prev => ({ ...prev, status: value as any }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Rascunho</SelectItem>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="inactive">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="workflow-description">Descrição</Label>
                        <Textarea
                            id="workflow-description"
                            value={currentWorkflow.description || ''}
                            onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descreva o objetivo deste workflow..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Trigger Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Gatilho
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Gatilho</Label>
                        <Select
                            value={currentWorkflow.trigger_type || ''}
                            onValueChange={(value) => setCurrentWorkflow(prev => ({
                                ...prev,
                                trigger_type: value,
                                trigger_config: {}
                            }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um gatilho" />
                            </SelectTrigger>
                            <SelectContent>
                                {triggerTypes.map((trigger) => {
                                    const Icon = trigger.icon
                                    return (
                                        <SelectItem key={trigger.value} value={trigger.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                {trigger.label}
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Trigger-specific configuration */}
                    {currentWorkflow.trigger_type === 'scheduled_time' && (
                        <div className="space-y-2">
                            <Label>Horário de Execução</Label>
                            <Input
                                type="time"
                                value={currentWorkflow.trigger_config?.time || ''}
                                onChange={(e) => setCurrentWorkflow(prev => ({
                                    ...prev,
                                    trigger_config: { ...prev.trigger_config, time: e.target.value }
                                }))}
                            />
                        </div>
                    )}

                    {currentWorkflow.trigger_type === 'lead_score_change' && (
                        <div className="space-y-2">
                            <Label>Score Mínimo</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={currentWorkflow.trigger_config?.min_score || ''}
                                onChange={(e) => setCurrentWorkflow(prev => ({
                                    ...prev,
                                    trigger_config: { ...prev.trigger_config, min_score: parseInt(e.target.value) }
                                }))}
                                placeholder="0"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Ações ({currentWorkflow.actions?.length || 0})
                        </CardTitle>
                        <Button onClick={addAction} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Ação
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!currentWorkflow.actions?.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma ação configurada</p>
                            <p className="text-sm">Clique em "Adicionar Ação" para começar</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentWorkflow.actions.map((action, index) => {
                                const ActionIcon = getActionIcon(action.type)
                                return (
                                    <Card key={action.id} className="relative">
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <ActionIcon className="h-4 w-4" />
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {index + 1}
                                                    </Badge>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Tipo de Ação</Label>
                                                        <Select
                                                            value={action.type}
                                                            onValueChange={(value) => updateAction(action.id, { type: value, config: {} })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione uma ação" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {actionTypes.map((actionType) => {
                                                                    const Icon = actionType.icon
                                                                    return (
                                                                        <SelectItem key={actionType.value} value={actionType.value}>
                                                                            <div className="flex items-center gap-2">
                                                                                <Icon className="h-4 w-4" />
                                                                                {actionType.label}
                                                                            </div>
                                                                        </SelectItem>
                                                                    )
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Action-specific configuration */}
                                                    {action.type === 'send_email' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Assunto</Label>
                                                                <Input
                                                                    value={action.config.subject || ''}
                                                                    onChange={(e) => updateAction(action.id, {
                                                                        config: { ...action.config, subject: e.target.value }
                                                                    })}
                                                                    placeholder="Assunto do email"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Template</Label>
                                                                <Select
                                                                    value={action.config.template || ''}
                                                                    onValueChange={(value) => updateAction(action.id, {
                                                                        config: { ...action.config, template: value }
                                                                    })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Selecione um template" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="welcome">Boas-vindas</SelectItem>
                                                                        <SelectItem value="follow_up">Follow-up</SelectItem>
                                                                        <SelectItem value="proposal">Proposta</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {action.type === 'add_tag' && (
                                                        <div className="space-y-2">
                                                            <Label>Tags</Label>
                                                            <Input
                                                                value={action.config.tags?.join(', ') || ''}
                                                                onChange={(e) => updateAction(action.id, {
                                                                    config: {
                                                                        ...action.config,
                                                                        tags: e.target.value.split(',').map(tag => tag.trim())
                                                                    }
                                                                })}
                                                                placeholder="tag1, tag2, tag3"
                                                            />
                                                        </div>
                                                    )}

                                                    {action.type === 'create_reminder' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Título</Label>
                                                                <Input
                                                                    value={action.config.title || ''}
                                                                    onChange={(e) => updateAction(action.id, {
                                                                        config: { ...action.config, title: e.target.value }
                                                                    })}
                                                                    placeholder="Título do lembrete"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Prazo (dias)</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={action.config.days_delay || ''}
                                                                    onChange={(e) => updateAction(action.id, {
                                                                        config: { ...action.config, days_delay: parseInt(e.target.value) }
                                                                    })}
                                                                    placeholder="1"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => moveAction(action.id, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => moveAction(action.id, 'down')}
                                                        disabled={index === (currentWorkflow.actions?.length || 0) - 1}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAction(action.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Workflow Preview */}
            {currentWorkflow.trigger_type && currentWorkflow.actions?.length && (
                <Card>
                    <CardHeader>
                        <CardTitle>Preview do Workflow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                                {(() => {
                                    const TriggerIcon = getTriggerIcon(currentWorkflow.trigger_type)
                                    return <TriggerIcon className="h-4 w-4" />
                                })()}
                                <span className="font-medium">
                  {triggerTypes.find(t => t.value === currentWorkflow.trigger_type)?.label}
                </span>
                            </div>

                            <ArrowDown className="h-4 w-4 text-muted-foreground" />

                            <div className="flex items-center gap-2">
                                {currentWorkflow.actions?.map((action, index) => { // Adicionado '?' aqui
                                    const ActionIcon = getActionIcon(action.type)
                                    return (
                                        <div key={action.id} className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-sm bg-background px-2 py-1 rounded">
                                                <ActionIcon className="h-3 w-3" />
                                                <span>{actionTypes.find(a => a.value === action.type)?.label}</span>
                                            </div>
                                            {index < (currentWorkflow.actions?.length || 0) - 1 && (
                                                <ArrowDown className="h-3 w-3 text-muted-foreground" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}