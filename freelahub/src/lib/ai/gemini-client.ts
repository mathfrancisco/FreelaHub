import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface ContentAnalysis {
    sentiment: 'positive' | 'negative' | 'neutral';
    tone: string;
    readabilityScore: number;
    keyTopics: string[];
    suggestions: string[];
    engagementScore: number;
    hashtags: string[];
    optimizations: string[];
}

export interface LeadAnalysis {
    score: number;
    priority: 'high' | 'medium' | 'low';
    nextBestAction: string;
    conversionProbability: number;
    insights: string[];
    recommendedContent: string[];
}

export interface ContentSuggestion {
    title: string;
    description: string;
    keyPoints: string[];
    hashtags: string[];
    bestTimeToPost: string;
    expectedEngagement: number;
}

export class GeminiAIService {
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    /**
     * Analisa conteúdo para insights e otimizações
     */
    async analyzeContent(content: string, context?: any): Promise<ContentAnalysis> {
        try {
            const prompt = `
        Analise o seguinte conteúdo como um especialista em marketing digital e redes sociais:

        CONTEÚDO: "${content}"
        
        ${context ? `CONTEXTO: ${JSON.stringify(context)}` : ''}

        Forneça uma análise completa em formato JSON com:
        1. sentiment: análise de sentimento (positive/negative/neutral)
        2. tone: tom do conteúdo (profissional, casual, técnico, etc.)
        3. readabilityScore: pontuação de legibilidade (0-100)
        4. keyTopics: principais tópicos abordados
        5. suggestions: 3-5 sugestões de melhoria
        6. engagementScore: pontuação prevista de engajamento (0-100)
        7. hashtags: 5-10 hashtags relevantes
        8. optimizations: otimizações específicas para melhor performance

        Responda APENAS com JSON válido, sem explicações adicionais.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON response
            const analysis = JSON.parse(text.replace(/```json|```/g, '').trim());

            return analysis;
        } catch (error) {
            console.error('Error analyzing content:', error);
            throw new Error('Failed to analyze content');
        }
    }

    /**
     * Analisa lead e fornece scoring inteligente
     */
    async analyzeLead(leadData: any, interactions: any[] = []): Promise<LeadAnalysis> {
        try {
            const prompt = `
        Analise o seguinte lead como um especialista em vendas e CRM:

        DADOS DO LEAD:
        ${JSON.stringify(leadData, null, 2)}

        HISTÓRICO DE INTERAÇÕES:
        ${JSON.stringify(interactions, null, 2)}

        Forneça uma análise completa em formato JSON com:
        1. score: pontuação do lead (0-100)
        2. priority: prioridade (high/medium/low)
        3. nextBestAction: próxima melhor ação recomendada
        4. conversionProbability: probabilidade de conversão (0-100)
        5. insights: 3-5 insights sobre o lead
        6. recommendedContent: tipos de conteúdo recomendados para nutrir este lead

        Considere:
        - Dados demográficos e profissionais
        - Histórico de interações
        - Tempo desde último contato
        - Padrões de engajamento
        - Potencial de negócio

        Responda APENAS com JSON válido, sem explicações adicionais.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const analysis = JSON.parse(text.replace(/```json|```/g, '').trim());

            return analysis;
        } catch (error) {
            console.error('Error analyzing lead:', error);
            throw new Error('Failed to analyze lead');
        }
    }

    /**
     * Gera sugestões de conteúdo baseadas em contexto
     */
    async generateContentSuggestions(
        topic: string,
        platform: string[] = [],
        context?: any
    ): Promise<ContentSuggestion[]> {
        try {
            const prompt = `
        Como especialista em marketing de conteúdo, gere 5 sugestões de conteúdo sobre:

        TÓPICO: "${topic}"
        PLATAFORMAS: ${platform.join(', ') || 'Geral'}
        
        ${context ? `CONTEXTO: ${JSON.stringify(context)}` : ''}

        Para cada sugestão, forneça em formato JSON:
        1. title: título chamativo
        2. description: descrição do conteúdo (100-150 palavras)
        3. keyPoints: 3-5 pontos principais a abordar
        4. hashtags: 5-8 hashtags relevantes
        5. bestTimeToPost: melhor horário para postar
        6. expectedEngagement: engajamento esperado (0-100)

        Considere:
        - Tendências atuais
        - Público-alvo de freelancers tech
        - Melhores práticas para cada plataforma
        - SEO e palavras-chave relevantes

        Responda com um array JSON de sugestões, sem explicações adicionais.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const suggestions = JSON.parse(text.replace(/```json|```/g, '').trim());

            return Array.isArray(suggestions) ? suggestions : [suggestions];
        } catch (error) {
            console.error('Error generating content suggestions:', error);
            throw new Error('Failed to generate content suggestions');
        }
    }

    /**
     * Otimiza texto para melhor performance
     */
    async optimizeText(text: string, objective: string = 'engagement'): Promise<{
        originalText: string;
        optimizedText: string;
        improvements: string[];
        metrics: {
            readabilityImprovement: number;
            engagementPotential: number;
            seoScore: number;
        };
    }> {
        try {
            const prompt = `
        Otimize o seguinte texto para ${objective}:

        TEXTO ORIGINAL: "${text}"

        Como especialista em copywriting e marketing digital, forneça:

        1. Uma versão otimizada do texto
        2. Lista de melhorias aplicadas
        3. Métricas de melhoria

        Forneça em formato JSON:
        {
          "originalText": "texto original",
          "optimizedText": "versão otimizada",
          "improvements": ["lista de melhorias aplicadas"],
          "metrics": {
            "readabilityImprovement": pontuação_de_melhoria_de_legibilidade,
            "engagementPotential": potencial_de_engajamento,
            "seoScore": pontuação_seo
          }
        }

        Responda APENAS com JSON válido.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text_response = response.text();

            const optimization = JSON.parse(text_response.replace(/```json|```/g, '').trim());

            return optimization;
        } catch (error) {
            console.error('Error optimizing text:', error);
            throw new Error('Failed to optimize text');
        }
    }

    /**
     * Analisa imagem e extrai insights
     */
    async analyzeImage(imageData: string, context?: string): Promise<{
        description: string;
        suggestedCaption: string;
        hashtags: string[];
        colorPalette: string[];
        mood: string;
        marketingInsights: string[];
    }> {
        try {
            const prompt = `
        Analise esta imagem como um especialista em marketing visual:

        ${context ? `CONTEXTO: ${context}` : ''}

        Forneça análise em formato JSON:
        1. description: descrição detalhada da imagem
        2. suggestedCaption: legenda sugerida para redes sociais
        3. hashtags: 8-10 hashtags relevantes
        4. colorPalette: cores predominantes
        5. mood: humor/atmosfera da imagem
        6. marketingInsights: insights de marketing baseados na imagem

        Responda APENAS com JSON válido.
      `;

            // Para análise de imagem, precisaríamos usar gemini-pro-vision
            const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const result = await visionModel.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageData,
                        mimeType: 'image/jpeg'
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();

            const analysis = JSON.parse(text.replace(/```json|```/g, '').trim());

            return analysis;
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw new Error('Failed to analyze image');
        }
    }

    /**
     * Gera template de email personalizado
     */
    async generateEmailTemplate(
        purpose: string,
        recipientData: any,
        context?: any
    ): Promise<{
        subject: string;
        body: string;
        callToAction: string;
        tone: string;
        followUpSuggestions: string[];
    }> {
        try {
            const prompt = `
        Gere um template de email profissional para:

        PROPÓSITO: ${purpose}
        DADOS DO DESTINATÁRIO: ${JSON.stringify(recipientData)}
        ${context ? `CONTEXTO: ${JSON.stringify(context)}` : ''}

        Como especialista em email marketing, forneça em JSON:
        1. subject: assunto cativante e personalizado
        2. body: corpo do email (HTML formatado)
        3. callToAction: call to action específico
        4. tone: tom utilizado
        5. followUpSuggestions: 3 sugestões de follow-up

        Considere:
        - Personalização baseada nos dados do destinatário
        - Melhores práticas de email marketing
        - Taxa de abertura e conversão
        - Compliance e profissionalismo

        Responda APENAS com JSON válido.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const template = JSON.parse(text.replace(/```json|```/g, '').trim());

            return template;
        } catch (error) {
            console.error('Error generating email template:', error);
            throw new Error('Failed to generate email template');
        }
    }

    /**
     * Prediz performance de conteúdo
     */
    async predictContentPerformance(
        content: string,
        platform: string,
        historicalData?: any[]
    ): Promise<{
        engagementPrediction: number;
        reachEstimate: number;
        bestPostingTime: string;
        improvementSuggestions: string[];
        competitorAnalysis: string[];
    }> {
        try {
            const prompt = `
        Analise e prediga a performance deste conteúdo:

        CONTEÚDO: "${content}"
        PLATAFORMA: ${platform}
        ${historicalData ? `DADOS HISTÓRICOS: ${JSON.stringify(historicalData)}` : ''}

        Como analista de dados e especialista em redes sociais, forneça predições em JSON:
        1. engagementPrediction: predição de engajamento (0-100)
        2. reachEstimate: estimativa de alcance
        3. bestPostingTime: melhor horário para postar
        4. improvementSuggestions: sugestões para melhorar performance
        5. competitorAnalysis: análise competitiva e oportunidades

        Base a análise em:
        - Tendências atuais da plataforma
        - Padrões de comportamento do público
        - Melhores práticas comprovadas
        - Dados históricos quando disponíveis

        Responda APENAS com JSON válido.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const prediction = JSON.parse(text.replace(/```json|```/g, '').trim());

            return prediction;
        } catch (error) {
            console.error('Error predicting content performance:', error);
            throw new Error('Failed to predict content performance');
        }
    }

    /**
     * Gera insights personalizados baseados em dados do usuário
     */
    async generatePersonalizedInsights(userData: {
        contentHistory: any[];
        leadData: any[];
        performanceMetrics: any;
        goals: string[];
    }): Promise<{
        keyInsights: string[];
        recommendations: string[];
        opportunityAreas: string[];
        nextSteps: string[];
        performanceTrends: string[];
    }> {
        try {
            const prompt = `
        Analise os dados do usuário e gere insights personalizados:

        DADOS DO USUÁRIO:
        ${JSON.stringify(userData, null, 2)}

        Como consultor de negócios especializado em freelancers tech, forneça em JSON:
        1. keyInsights: 5 principais insights sobre performance atual
        2. recommendations: 5 recomendações estratégicas
        3. opportunityAreas: áreas de oportunidade identificadas
        4. nextSteps: próximos passos recomendados
        5. performanceTrends: análise de tendências de performance

        Considere:
        - Padrões nos dados históricos
        - Gaps de performance
        - Oportunidades de crescimento
        - Benchmarks da indústria
        - Metas do usuário

        Responda APENAS com JSON válido.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const insights = JSON.parse(text.replace(/```json|```/g, '').trim());

            return insights;
        } catch (error) {
            console.error('Error generating personalized insights:', error);
            throw new Error('Failed to generate personalized insights');
        }
    }
}

// Singleton instance
export const geminiAI = new GeminiAIService();