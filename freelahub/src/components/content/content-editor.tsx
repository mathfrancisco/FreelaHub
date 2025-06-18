import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Badge} from "@/components/ui/badge"
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
    Wand2,
    Plus,
    X,
    Sparkles,
    BarChart3
} from "lucide-react"
import {Textarea} from "@/components/forms/textarea";

// Mock types for demo
interface Content {
    id?: string;
    title?: string;
    body?: string;
    content_type?: string;
    target_platforms?: string[];
    hashtags?: string[];
    status?: string;
    ai_analysis?: AIAnalysis;
}

interface AIAnalysis {
    sentiment: 'positive' | 'negative' | 'neutral';
    readability_score: number;
    seo_score: number;
    suggestions?: string[];
}

interface ContentEditorProps {
    content?: Partial<Content>,
    onSave?: (content: Partial<Content>) => void,
    onPublish?: (content: Partial<Content>) => void,
    onSchedule?: (content: Partial<Content>, date: string) => void,
    onAIAnalysis?: (content: string) => Promise<AIAnalysis>,
    className?: string,
    isSaving?: boolean,
    isAnalyzing?: boolean
}

const platforms = [
    {id: 'instagram', name: 'Instagram', icon: '📷', color: 'from-pink-500 to-purple-600'},
    {id: 'facebook', name: 'Facebook', icon: '👥', color: 'from-blue-500 to-blue-700'},
    {id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-slate-700 to-slate-900'},
    {id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800'},
    {id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-red-500 to-pink-600'},
    {id: 'youtube', name: 'YouTube', icon: '📺', color: 'from-red-600 to-red-700'}
]

const contentTypes = [
    {value: 'post', label: 'Post', icon: '📝'},
    {value: 'article', label: 'Artigo', icon: '📰'},
    {value: 'video', label: 'Vídeo', icon: '🎬'},
    {value: 'image', label: 'Imagem', icon: '🖼️'},
    {value: 'story', label: 'Story', icon: '📸'}
]

export default function ContentEditor({
                                          content,
                                          onSave,
                                          onPublish,
                                          onSchedule,
                                          onAIAnalysis,
                                          className,
                                          isSaving,
                                          isAnalyzing: isAnalyzingProp
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

    const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(content?.ai_analysis || null)
    const [newHashtag, setNewHashtag] = useState('')
    const [scheduleDate, setScheduleDate] = useState('')

    const isAnalyzingState = isAnalyzingProp || isAnalyzingLocal

    const handleInputChange = (field: keyof Content, value: any) => {
        setFormData(prev => ({...prev, [field]: value}))
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

        setIsAnalyzingLocal(true)
        try {
            const analysis = await onAIAnalysis(formData.body)
            setAiAnalysis(analysis)
        } catch (error) {
            console.error('Erro na análise de IA:', error)
        } finally {
            setIsAnalyzingLocal(false)
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

    const mockAIAnalysis = () => {
        setIsAnalyzingLocal(true)
        setTimeout(() => {
            setAiAnalysis({
                sentiment: 'positive',
                readability_score: 85,
                seo_score: 78,
                suggestions: [
                    'Adicione mais hashtags relevantes',
                    'Considere incluir uma call-to-action',
                    'O tom está adequado para o público-alvo'
                ]
            })
            setIsAnalyzingLocal(false)
        }, 2000)
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 ${className}`}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {content?.id ? 'Editar Conteúdo' : 'Criar Conteúdo'}
                        </h1>
                        <p className="text-slate-600 mt-2">Crie conteúdo engajador para suas redes sociais</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => onSave?.(formData)}
                            className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                            disabled={isSaving}
                        >
                            <Save className="h-4 w-4 mr-2"/>
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                        >
                            <Eye className="h-4 w-4 mr-2"/>
                            Visualizar
                        </Button>
                        <Button
                            onClick={() => onPublish?.(formData)}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Send className="h-4 w-4 mr-2"/>
                            Publicar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                                    Conteúdo Principal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="title" className="text-slate-700 font-medium">Título</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Digite o título do conteúdo..."
                                        className="mt-2 border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-colors"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="body" className="text-slate-700 font-medium">Conteúdo</Label>
                                    <Textarea
                                        id="body"
                                        value={formData.body}
                                        onChange={(e) => handleInputChange('body', e.target.value)}
                                        placeholder="Digite seu conteúdo aqui... ✨"
                                        className="min-h-[250px] mt-2 border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-colors resize-none"
                                    />
                                    {characterLimit && (
                                        <div className={`text-sm mt-2 font-medium ${
                                            isOverLimit ? "text-red-500" : "text-slate-500"
                                        }`}>
                                            {characterCount}/{characterLimit} caracteres
                                            {isOverLimit && " - Limite excedido!"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={mockAIAnalysis}
                                        disabled={isAnalyzingState || !formData.body}
                                        className="border-purple-200 text-purple-600 hover:bg-purple-50 transition-all duration-200"
                                    >
                                        <Wand2 className={`h-4 w-4 mr-2 ${isAnalyzingState ? 'animate-spin' : ''}`}/>
                                        {isAnalyzingState ? 'Analisando...' : 'Análise IA'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                                    >
                                        <Image className="h-4 w-4 mr-2"/>
                                        Adicionar Mídia
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hashtags */}
                        <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <Hash className="h-5 w-5 text-blue-500"/>
                                    Hashtags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2 mb-4">
                                    <Input
                                        value={newHashtag}
                                        onChange={(e) => setNewHashtag(e.target.value)}
                                        placeholder="adicionar hashtag..."
                                        className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                                    />
                                    <Button
                                        onClick={handleAddHashtag}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                    >
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.hashtags?.map((hashtag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="cursor-pointer bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 transition-all duration-200 px-3 py-1"
                                            onClick={() => handleRemoveHashtag(hashtag)}
                                        >
                                            {hashtag} <X className="h-3 w-3 ml-1"/>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Configurações */}
                        <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                                    Configurações
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-slate-700 font-medium">Tipo de Conteúdo</Label>
                                    <Select
                                        value={formData.content_type}
                                        onValueChange={(value) => handleInputChange('content_type', value)}
                                    >
                                        <SelectTrigger className="mt-2 border-slate-200 focus:border-green-400 focus:ring-green-400/20">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contentTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{type.icon}</span>
                                                        {type.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-slate-700 font-medium">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange('status', value)}
                                    >
                                        <SelectTrigger className="mt-2 border-slate-200 focus:border-green-400 focus:ring-green-400/20">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">📝 Rascunho</SelectItem>
                                            <SelectItem value="scheduled">⏰ Agendado</SelectItem>
                                            <SelectItem value="published">✅ Publicado</SelectItem>
                                            <SelectItem value="archived">📦 Arquivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Plataformas */}
                        <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-purple-500"/>
                                    Plataformas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {platforms.map((platform) => (
                                        <div
                                            key={platform.id}
                                            className={`group relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                                formData.target_platforms?.includes(platform.id)
                                                    ? `bg-gradient-to-r ${platform.color} text-white shadow-lg transform scale-105`
                                                    : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                                            }`}
                                            onClick={() => handlePlatformToggle(platform.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{platform.icon}</span>
                                                <span className="font-medium">{platform.name}</span>
                                            </div>
                                            {formData.target_platforms?.includes(platform.id) && (
                                                <div className="w-3 h-3 bg-white/80 rounded-full flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-current rounded-full"/>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Agendamento */}
                        <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-orange-500"/>
                                    Agendamento
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="schedule-date" className="text-slate-700 font-medium">Data e Hora</Label>
                                    <Input
                                        id="schedule-date"
                                        type="datetime-local"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="mt-2 border-slate-200 focus:border-orange-400 focus:ring-orange-400/20"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 transition-all duration-200"
                                    onClick={() => onSchedule?.(formData, scheduleDate)}
                                    disabled={!scheduleDate}
                                >
                                    <Clock className="h-4 w-4 mr-2"/>
                                    Agendar Publicação
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Análise IA */}
                        {aiAnalysis && (
                            <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-purple-500"/>
                                        Análise IA
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">{aiAnalysis.readability_score}</div>
                                            <div className="text-sm text-slate-600">Legibilidade</div>
                                        </div>
                                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{aiAnalysis.seo_score}</div>
                                            <div className="text-sm text-slate-600">SEO Score</div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-slate-700">Sentimento</Label>
                                        <Badge
                                            variant={
                                                aiAnalysis.sentiment === 'positive' ? 'default' :
                                                    aiAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                                            }
                                            className="ml-2"
                                        >
                                            {aiAnalysis.sentiment === 'positive' ? '😊 Positivo' :
                                                aiAnalysis.sentiment === 'negative' ? '😞 Negativo' : '😐 Neutro'}
                                        </Badge>
                                    </div>

                                    {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                                <BarChart3 className="h-4 w-4"/>
                                                Sugestões
                                            </Label>
                                            <ul className="text-sm space-y-2 mt-2">
                                                {aiAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                                                    <li key={index} className="text-slate-600 bg-slate-50 rounded-lg p-2 flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"/>
                                                        {suggestion}
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
        </div>
    )
}