import { geminiAI, ContentAnalysis, LeadAnalysis, ContentSuggestion } from './gemini-client';
import { supabase } from '../supabase/supabase';

export interface FreelaBotConfig {
    userId: string;
    preferences?: {
        contentStyle?: string;
        targetAudience?: string;
        industry?: string;
        goals?: string[];
    };
}

export class FreelaBotService {
    private config: FreelaBotConfig;

    constructor(config: FreelaBotConfig) {
        this.config = config;
    }

    /**
     * Análise completa de conteúdo com armazenamento
     */
    async analyzeAndStoreContent(contentId: string, content: string): Promise<ContentAnalysis> {
        try {
            // Buscar contexto adicional do usuário
            const context = await this.getUserContext();

            // Analisar conteúdo
            const analysis = await geminiAI.analyzeContent(content, context);

            // Armazenar insights no banco
            await this.storeAIInsight({
                contentId,
                type: 'content_analysis',
                data: analysis,
                confidenceScore: analysis.engagementScore
            });

            return analysis;
        } catch (error) {
            console.error('Error in analyzeAndStoreContent:', error);
            throw error;
        }
    }

    /**
     * Análise completa de lead com scoring
     */
    async analyzeAndScoreLead(leadId: string): Promise<LeadAnalysis> {
        try {
            // Buscar dados do lead
            const { data: leadData } = await supabase
                .from('leads')
                .select('*')
                .eq('id', leadId)
                .single();

            // Buscar interações
            const { data: interactions } = await supabase
                .from('interactions')
                .select('*')
                .eq('lead_id', leadId)
                .order('created_at', { ascending: false });

            // Analisar lead
            const analysis = await geminiAI.analyzeLead(leadData, interactions || []);

            // Atualizar score no banco
            await supabase
                .from('leads')
                .update({
                    score: analysis.score,
                    next_action: analysis.nextBestAction,
                    next_action_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 dia
                })
                .eq('id', leadId);

            // Armazenar insight
            await this.storeAIInsight({
                leadId,
                type: 'lead_analysis',
                data: analysis,
                confidenceScore: analysis.conversionProbability
            });

            return analysis;
        } catch (error) {
            console.error('Error in analyzeAndScoreLead:', error);
            throw error;
        }
    }

    /**
     * Geração inteligente de conteúdo
     */
    async generateSmartContent(topic: string, platforms: string[] = []): Promise<ContentSuggestion[]> {
        try {
            const context = await this.getUserContext();
            const suggestions = await geminiAI.generateContentSuggestions(topic, platforms, context);

            // Armazenar sugestões para análise futura
            for (const suggestion of suggestions) {
                await this.storeAIInsight({
                    type: 'content_suggestion',
                    data: { topic, suggestion },
                    confidenceScore: suggestion.expectedEngagement
                });
            }

            return suggestions;
        } catch (error) {
            console.error('Error in generateSmartContent:', error);
            throw error;
        }
    }

    /**
     * Dashboard de insights personalizados
     */
    async getDashboardInsights(): Promise<{
        contentInsights: any[];
        leadInsights: any[];
        recommendations: any[];
        alerts: any[];
    }> {
        try {
            // Buscar dados recentes do usuário
            const userData = await this.gatherUserData();

            // Gerar insights personalizados
            const insights = await geminiAI.generatePersonalizedInsights(userData);

            // Buscar insights armazenados
            const { data: storedInsights } = await supabase
                .from('ai_insights')
                .select('*')
                .eq('user_id', this.config.userId)
                .eq('acknowledged', false)
                .order('created_at', { ascending: false })
                .limit(10);

            return {
                contentInsights: insights.keyInsights,
                leadInsights: insights.opportunityAreas,
                recommendations: insights.recommendations,
                alerts: storedInsights || []
            };
        } catch (error) {
            console.error('Error in getDashboardInsights:', error);
            throw error;
        }
    }

    /**
     * Sistema de automação inteligente
     */
    async suggestAutomations(): Promise<{
        workflows: any[];
        triggers: any[];
        opportunities: string[];
    }> {
        try {
            const userData = await this.gatherUserData();

            const prompt = `
        Baseado nos dados do usuário, sugira automações inteligentes:
        ${JSON.stringify(userData, null, 2)}

        Forneça em JSON:
        1. workflows: 3-5 workflows recomendados
        2. triggers: triggers específicos baseados em padrões
        3. opportunities: oportunidades de automação identificadas

        Foque em automações que economizem tempo e melhorem conversões.
      `;

            const result = await geminiAI.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const suggestions = JSON.parse(text.replace(/```json|```/g, '').trim());

            return suggestions;
        } catch (error) {
            console.error('Error in suggestAutomations:', error);
            throw error;
        }
    }

    /**
     * Métodos auxiliares privados
     */
    private async getUserContext(): Promise<any> {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', this.config.userId)
            .single();

        return {
            businessInfo: profile?.business_info,
            preferences: this.config.preferences,
            industry: profile?.business_info?.industry || 'tech'
        };
    }

    private async gatherUserData(): Promise<any> {
        // Buscar histórico de conteúdo
        const { data: contentHistory } = await supabase
            .from('contents')
            .select('*')
            .eq('user_id', this.config.userId)
            .order('created_at', { ascending: false })
            .limit(50);

        // Buscar dados de leads
        const { data: leadData } = await supabase
            .from('leads')
            .select('*')
            .eq('user_id', this.config.userId)
            .order('created_at', { ascending: false })
            .limit(100);

        // Buscar métricas
        const { data: metrics } = await supabase
            .from('metrics')
            .select('*')
            .eq('user_id', this.config.userId)
            .order('recorded_at', { ascending: false })
            .limit(200);

        return {
            contentHistory: contentHistory || [],
            leadData: leadData || [],
            performanceMetrics: this.aggregateMetrics(metrics || []),
            goals: this.config.preferences?.goals || []
        };
    }

    private aggregateMetrics(metrics: any[]): any {
        // Agregação básica de métricas
        return {
            totalEngagement: metrics.reduce((sum, m) => sum + (m.value || 0), 0),
            avgPerformance: metrics.length > 0 ?
                metrics.reduce((sum, m) => sum + (m.value || 0), 0) / metrics.length : 0,
            topPerformingContent: metrics
                .filter(m => m.content_id)
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
        };
    }

    private async storeAIInsight(insight: {
        contentId?: string;
        leadId?: string;
        type: string;
        data: any;
        confidenceScore: number;
    }): Promise<void> {
        await supabase.from('ai_insights').insert({
            user_id: this.config.userId,
            insight_type: insight.type,
            title: this.generateInsightTitle(insight.type, insight.data),
            description: this.generateInsightDescription(insight.type, insight.data),
            data: insight.data,
            confidence_score: insight.confidenceScore,
            acknowledged: false
        });
    }

    private generateInsightTitle(type: string, data: any): string {
        switch (type) {
            case 'content_analysis':
                return `Análise de Conteúdo - Score: ${data.engagementScore}`;
            case 'lead_analysis':
                return `Lead Score: ${data.score} - ${data.priority.toUpperCase()}`;
            case 'content_suggestion':
                return `Nova Ideia: ${data.suggestion.title}`;
            default:
                return 'Insight de IA';
        }
    }

    private generateInsightDescription(type: string, data: any): string {
        switch (type) {
            case 'content_analysis':
                return `Análise completa do conteúdo com ${data.suggestions.length} sugestões de melhoria.`;
            case 'lead_analysis':
                return `Lead analisado com ${data.conversionProbability}% de probabilidade de conversão.`;
            case 'content_suggestion':
                return `Nova sugestão de conteúdo sobre ${data.topic} com potencial de ${data.suggestion.expectedEngagement}% de engajamento.`;
            default:
                return 'Insight gerado pela IA do sistema.';
        }
    }
}