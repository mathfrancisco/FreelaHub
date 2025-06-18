'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/supabase';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Content, AIAnalysis } from '@/lib/types';
import {
    Loader2,
    TrendingUp,
    Target,
    Lightbulb,
    AlertCircle,
    Clock,
    BarChart3,
    Zap
} from 'lucide-react';
import { useAuth } from "@/lib/hooks/useAuth";
import { FreelaBotService } from "@/lib/ai/freelabot";
import { ContentSuggestion } from "@/lib/ai/gemini-client";
import ContentEditor from "@/components/content/content-editor";

export default function ContentEditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const contentId = searchParams.get('id');
    const mode = contentId ? 'edit' : 'create';

    // Estados principais
    const [content, setContent] = useState<Partial<Content>>({
        title: '',
        body: '',
        content_type: 'post',
        target_platforms: [],
        hashtags: [],
        status: 'draft'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

    // Estados da IA
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
    const [dashboardInsights, setDashboardInsights] = useState<any>(null);

    // Instância do FreelaBotService
    const [freelaBotService, setFreelaBotService] = useState<FreelaBotService | null>(null);

    // Inicialização do FreelaBotService
    useEffect(() => {
        if (user?.id) {
            const service = new FreelaBotService({
                userId: user.id,
                preferences: {
                    contentStyle: 'professional',
                    targetAudience: 'professionals',
                    industry: 'tech',
                    goals: ['engagement', 'lead_generation', 'brand_awareness']
                }
            });
            setFreelaBotService(service);
        }
    }, [user]);

    // Carregamento de conteúdo existente
    useEffect(() => {
        if (contentId && user?.id) {
            loadContent();
        }
    }, [contentId, user]);

    // Carregamento de insights do dashboard
    useEffect(() => {
        if (freelaBotService) {
            loadDashboardInsights();
        }
    }, [freelaBotService]);

    const loadContent = async () => {
        if (!contentId || !user?.id) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .eq('id', contentId)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setContent(data);
                if (data.ai_analysis) {
                    setAiAnalysis(data.ai_analysis);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            toast.error('Erro ao carregar conteúdo');
        } finally {
            setIsLoading(false);
        }
    };

    const loadDashboardInsights = async () => {
        if (!freelaBotService) return;

        try {
            const insights = await freelaBotService.getDashboardInsights();
            setDashboardInsights(insights);
        } catch (error) {
            console.error('Erro ao carregar insights:', error);
        }
    };

    const handleSave = async (contentData: Partial<Content>) => {
        if (!user?.id || !freelaBotService) return;

        setIsSaving(true);
        try {
            const dataToSave = {
                ...contentData,
                user_id: user.id,
                updated_at: new Date().toISOString()
            };

            let result;
            if (contentId) {
                // Atualizar conteúdo existente
                const { data, error } = await supabase
                    .from('contents')
                    .update(dataToSave)
                    .eq('id', contentId)
                    .eq('user_id', user.id)
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            } else {
                // Criar novo conteúdo
                const { data, error } = await supabase
                    .from('contents')
                    .insert({
                        ...dataToSave,
                        created_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (error) throw error;
                result = data;

                // Redirecionar para o modo de edição
                router.push(`/editor?id=${result.id}`);
            }

            setContent(result);
            toast.success('Conteúdo salvo com sucesso!');

            // Analisar conteúdo automaticamente após salvar
            if (result.body && result.body.trim()) {
                handleAIAnalysis(result.body);
            }

        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar conteúdo');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async (contentData: Partial<Content>) => {
        const publishData = {
            ...contentData,
            status: 'published' as const,
            published_at: new Date().toISOString()
        };

        await handleSave(publishData);
        toast.success('Conteúdo publicado com sucesso!');
    };

    const handleSchedule = async (contentData: Partial<Content>, scheduleDate: string) => {
        const scheduleData = {
            ...contentData,
            status: 'scheduled' as const,
            scheduled_for: scheduleDate
        };

        await handleSave(scheduleData);
        toast.success('Conteúdo agendado com sucesso!');
    };

    const handleAIAnalysis = async (contentText: string): Promise<AIAnalysis> => {
        if (!freelaBotService || !contentText.trim()) {
            throw new Error('Serviço de IA não disponível ou conteúdo vazio');
        }

        setIsAnalyzing(true);
        try {
            // Usar o FreelaBotService para análise
            const analysis = await freelaBotService.analyzeAndStoreContent(
                contentId || 'temp_' + Date.now(),
                contentText
            );

            // Converter para o formato esperado pelo componente
            const aiAnalysis: AIAnalysis = {
                sentiment: analysis.sentiment || 'neutral',
                tone: analysis.tone ? (Array.isArray(analysis.tone) ? analysis.tone : [analysis.tone]) : ['professional'],
                topics: analysis.topics || [],
                readability_score: analysis.readabilityScore || 75,
                seo_score: analysis.seoScore || 70,
                engagement_score: analysis.engagementScore || 80,
                suggestions: analysis.suggestions || [],
                predicted_performance: analysis.platformPredictions || {
                    instagram: 75,
                    linkedin: 85,
                    twitter: 70,
                    facebook: 80
                },
                optimal_posting_times: analysis.optimalTimes || {
                    instagram: ['09:00', '12:00', '17:00'],
                    linkedin: ['08:00', '12:00', '17:00'],
                    twitter: ['09:00', '15:00', '21:00'],
                    facebook: ['09:00', '13:00', '15:00']
                },
                content_insights: {
                    tone: analysis.tone || 'professional',
                    complexity: analysis.complexity || 'medium',
                    call_to_action_strength: analysis.ctaStrength || 7,
                    emotional_appeal: analysis.emotionalAppeal || 6
                },
            };

            setAiAnalysis(aiAnalysis);

            // Salvar análise no conteúdo se já existe
            if (contentId) {
                await supabase
                    .from('contents')
                    .update({ ai_analysis: aiAnalysis })
                    .eq('id', contentId)
                    .eq('user_id', user!.id);
            }

            toast.success('Análise de IA concluída!');
            return aiAnalysis;

        } catch (error) {
            console.error('Erro na análise de IA:', error);
            toast.error('Erro ao analisar conteúdo com IA');
            throw error;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateContentSuggestions = async (topic: string) => {
        if (!freelaBotService) return;

        setIsGeneratingSuggestions(true);
        try {
            const platforms = content.target_platforms || [];
            const suggestions = await freelaBotService.generateSmartContent(topic, platforms);

            setContentSuggestions(suggestions);
            toast.success(`${suggestions.length} sugestões geradas!`);
        } catch (error) {
            console.error('Erro ao gerar sugestões:', error);
            toast.error('Erro ao gerar sugestões de conteúdo');
        } finally {
            setIsGeneratingSuggestions(false);
        }
    };

    const applySuggestion = (suggestion: ContentSuggestion) => {
        setContent(prev => ({
            ...prev,
            title: suggestion.title,
            body: suggestion.content,
            target_platforms: suggestion.platforms,
            hashtags: suggestion.hashtags
        }));
        toast.success('Sugestão aplicada ao conteúdo!');
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AuthGuard>
            <AppLayout>
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {/* Header com insights rápidos */}
                    {dashboardInsights && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium">Performance Média</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {dashboardInsights.contentInsights?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <Target className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium">Leads Ativos</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {dashboardInsights.leadInsights?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                                        <div>
                                            <p className="text-sm font-medium">Recomendações</p>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {dashboardInsights.recommendations?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium">Alertas</p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {dashboardInsights.alerts?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Editor Principal */}
                        <div className="xl:col-span-3">
                            <ContentEditor
                                content={content}
                                onSave={handleSave}
                                onPublish={handlePublish}
                                onSchedule={handleSchedule}
                                onAIAnalysis={handleAIAnalysis}
                                isSaving={isSaving}
                                isAnalyzing={isAnalyzing}
                                className="bg-transparent" // Remove background pois já está no ContentEditor
                            />
                        </div>

                        {/* Sidebar com IA e Insights */}
                        <div className="space-y-6">
                            {/* Gerador de Sugestões */}
                            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Zap className="h-4 w-4 mr-2" />
                                        Gerador IA
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Tópico para gerar conteúdo..."
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-purple-400 focus:ring-purple-400/20 focus:outline-none"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    const target = e.target as HTMLInputElement;
                                                    generateContentSuggestions(target.value);
                                                }
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            disabled={isGeneratingSuggestions}
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                                            onClick={() => {
                                                const input = document.querySelector('input[placeholder="Tópico para gerar conteúdo..."]') as HTMLInputElement;
                                                if (input?.value) {
                                                    generateContentSuggestions(input.value);
                                                }
                                            }}
                                        >
                                            {isGeneratingSuggestions ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Gerar'
                                            )}
                                        </Button>
                                    </div>

                                    {contentSuggestions.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Sugestões:</p>
                                            {contentSuggestions.slice(0, 3).map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                                                    onClick={() => applySuggestion(suggestion)}
                                                >
                                                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                        {suggestion.content.substring(0, 100)}...
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {suggestion.expectedEngagement}% engajamento
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {suggestion.platforms.length} plataforma(s)
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Análise de Performance */}
                            {aiAnalysis && (
                                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Performance Prevista
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {Object.entries(aiAnalysis.predicted_performance).map(([platform, score]) => (
                                            <div key={platform} className="flex items-center justify-between">
                                                <span className="text-sm capitalize">{platform}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">{score}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tópicos Identificados */}
                            {aiAnalysis && aiAnalysis.topics.length > 0 && (
                                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Target className="h-4 w-4 mr-2" />
                                            Tópicos Identificados
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.topics.map((topic, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tom de Voz */}
                            {aiAnalysis && aiAnalysis.tone.length > 0 && (
                                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Lightbulb className="h-4 w-4 mr-2" />
                                            Tom de Voz
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.tone.map((toneItem, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {toneItem}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Horários Otimizados */}
                            {aiAnalysis && (
                                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Horários Otimizados
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {Object.entries(aiAnalysis.optimal_posting_times).map(([platform, times]) => (
                                            <div key={platform}>
                                                <p className="text-sm font-medium capitalize mb-1">{platform}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {times.map((time, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {time}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Alertas e Recomendações */}
                            {dashboardInsights?.alerts && dashboardInsights.alerts.length > 0 && (
                                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Alertas IA
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {dashboardInsights.alerts.slice(0, 5).map((alert: any, index: number) => (
                                            <div key={index} className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <p className="text-sm font-medium">{alert.title}</p>
                                                <p className="text-xs text-gray-600">{alert.description}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {alert.insight_type}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {alert.confidence_score}% confiança
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </AuthGuard>
    );
}