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
    Save,
    Send,
    Clock,
    Eye,
    Hash,
    Image,
    Calendar,
    Target,
    Wand2
} from "lucide-react"
import { Content, AIAnalysis } from "@/lib/types"
import { cn } from "@/lib/utils/utils"

interface ContentEditorProps {
    content?: Partial<Content>
    onSave?: (content: Partial<Content>) => void
    onPublish?: (content: Partial<Content>) => void
    onSchedule?: (content: Partial<Content>, date: string) => void
    onAIAnalysis?: (content: string) => Promise<AIAnalysis>
    className?: string
}

const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' }
]

const contentTypes = [
    { value: 'post', label: 'Post' },
    { value: 'article', label: 'Artigo' },
    { value: 'video', label: 'Vídeo' },
    { value: 'image', label: 'Imagem' },
    { value: 'story', label: 'Story' }
]

export function ContentEditor({
                                  content,
                                  onSave,
                                  onPublish,
                                  onSchedule,
                                  onAIAnalysis,
                                  className
                              }: ContentEditorProps) {
    const [formData, setFormData] = useState<Partial<Content>>({
        title: content?.title || '',
        body: content?.body || '',
        content_type: content?.content_type || 'post',
        target_platforms: content?.target_platforms || [],
        hashtags: content?.hashtags || [],
        status: content?.status || 'draft',
        ...content
    })

    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(content?.ai_analysis || null)
    const [newHashtag, setNewHashtag] = useState('')
    const [scheduleDate, setScheduleDate] = useState('')

    const handleInputChange = (field: keyof Content, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePlatformToggle = (platformId: string) => {
        const platforms = formData.target_platforms || []
        const newPlatforms = platforms.includes(platformId)
            ? platforms.filter(p => p !== platformId)
            : [...platforms, platformId]

        handleInputChange('target_platforms', newPlatforms)
    }

    const handleAddHashtag = () => {
        if (newHashtag.trim() && !formData.hashtags?.includes(newHashtag.trim())) {
            const hashtag = newHashtag.startsWith('#') ? newHashtag : `#${newHashtag}`
            handleInputChange('hashtags', [...(formData.hashtags || []), hashtag])
            setNewHashtag('')
        }
    }

    const handleRemoveHashtag = (hashtag: string) => {
        handleInputChange('hashtags', formData.hashtags?.filter(h => h !== hashtag) || [])
    }

    const handleAIAnalysis = async () => {
        if (!onAIAnalysis || !formData.body) return

        setIsAnalyzing(true)
        try {
            const analysis = await onAIAnalysis(formData.body)
            setAiAnalysis(analysis)
        } catch (error) {
            console.error('Erro na análise de IA:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getCharacterCount = () => {
        return formData.body?.length || 0
    }

    const getCharacterLimit = () => {
        const limits: Record<string, number> = {
            twitter: 280,
            instagram: 2200,
            facebook: 63206,
            linkedin: 3000,
            tiktok: 2200
        }

        const selectedPlatforms = formData.target_platforms || []
        if (selectedPlatforms.length === 0) return null

        return Math.min(...selectedPlatforms.map(p => limits[p] || 2200))
    }

    const characterLimit = getCharacterLimit()
    const characterCount = getCharacterCount()
    const isOverLimit = characterLimit && characterCount > characterLimit

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    {content?.id ? 'Editar Conteúdo' : 'Criar Conteúdo'}
                </h2>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => onSave?.(formData)}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                    </Button>
                    <Button variant="outline" onClick={() => {}}>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                    </Button>
                    <Button onClick={() => onPublish?.(formData)}>
                        <Send className="h-4 w-4 mr-2" />
                        Publicar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conteúdo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Digite o título do conteúdo..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="body">Conteúdo</Label>
                                <Textarea
                                    id="body"
                                    value={formData.body}
                                    onChange={(e) => handleInputChange('body', e.target.value)}
                                    placeholder="Digite seu conteúdo aqui..."
                                    className="min-h-[200px]"
                                />
                                {characterLimit && (
                                    <div className={cn(
                                        "text-sm mt-1",
                                        isOverLimit ? "text-red-500" : "text-muted-foreground"
                                    )}>
                                        {characterCount}/{characterLimit} caracteres
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleAIAnalysis}
                                    disabled={isAnalyzing || !formData.body}
                                >
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    {isAnalyzing ? 'Analisando...' : 'Análise IA'}
                                </Button>
                                <Button variant="outline">
                                    <Image className="h-4 w-4 mr-2" />
                                    Adicionar Mídia
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hashtags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Hash className="h-4 w-4 mr-2" />
                                Hashtags
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mb-3">
                                <Input
                                    value={newHashtag}
                                    onChange={(e) => setNewHashtag(e.target.value)}
                                    placeholder="adicionar hashtag..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                                />
                                <Button onClick={handleAddHashtag}>Adicionar</Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.hashtags?.map((hashtag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => handleRemoveHashtag(hashtag)}
                                    >
                                        {hashtag} ×
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Configurações */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Tipo de Conteúdo</Label>
                                <Select
                                    value={formData.content_type}
                                    onValueChange={(value) => handleInputChange('content_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contentTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleInputChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Rascunho</SelectItem>
                                        <SelectItem value="scheduled">Agendado</SelectItem>
                                        <SelectItem value="published">Publicado</SelectItem>
                                        <SelectItem value="archived">Arquivado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plataformas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Plataformas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        className={cn(
                                            "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                                            formData.target_platforms?.includes(platform.id)
                                                ? "bg-primary/10 border border-primary/20"
                                                : "bg-muted/50 hover:bg-muted"
                                        )}
                                        onClick={() => handlePlatformToggle(platform.id)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{platform.icon}</span>
                                            <span className="text-sm font-medium">{platform.name}</span>
                                        </div>
                                        {formData.target_platforms?.includes(platform.id) && (
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agendamento */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Agendamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="schedule-date">Data e Hora</Label>
                                <Input
                                    id="schedule-date"
                                    type="datetime-local"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => onSchedule?.(formData, scheduleDate)}
                                disabled={!scheduleDate}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Agendar Publicação
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Análise IA */}
                    {aiAnalysis && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    Análise IA
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-xs font-medium">Sentimento</Label>
                                    <Badge variant={
                                        aiAnalysis.sentiment === 'positive' ? 'default' :
                                            aiAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                                    }>
                                        {aiAnalysis.sentiment === 'positive' ? 'Positivo' :
                                            aiAnalysis.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                                    </Badge>
                                </div>

                                <div>
                                    <Label className="text-xs font-medium">Score de Legibilidade</Label>
                                    <div className="text-sm font-medium">{aiAnalysis.readability_score}/100</div>
                                </div>

                                <div>
                                    <Label className="text-xs font-medium">Score SEO</Label>
                                    <div className="text-sm font-medium">{aiAnalysis.seo_score}/100</div>
                                </div>

                                {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                                    <div>
                                        <Label className="text-xs font-medium">Sugestões</Label>
                                        <ul className="text-xs space-y-1 mt-1">
                                            {aiAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                                                <li key={index} className="text-muted-foreground">
                                                    • {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}