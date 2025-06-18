import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {FreelaBotService} from "@/lib/ai/freelabot";

export function useFreelaBotService() {
    const { user } = useAuth();
    const [freelaBot, setFreelaBot] = useState<FreelaBotService | null>(null);

    useEffect(() => {
        if (user?.id) {
            const bot = new FreelaBotService({
                userId: user.id,
                preferences: {
                    contentStyle: 'professional',
                    targetAudience: 'tech professionals',
                    industry: 'technology'
                }
            });
            setFreelaBot(bot);
        }
    }, [user]);

    return freelaBot;
}

export function useContentAnalysis() {
    const freelaBot = useFreelaBotService();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeContent = async (contentId: string, content: string) => {
        if (!freelaBot) throw new Error('FrelaBot not initialized');

        setIsAnalyzing(true);
        try {
            const analysis = await freelaBot.analyzeAndStoreContent(contentId, content);
            return analysis;
        } finally {
            setIsAnalyzing(false);
        }
    };

    return { analyzeContent, isAnalyzing };
}

export function useLeadAnalysis() {
    const freelaBot = useFreelaBotService();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeLead = async (leadId: string) => {
        if (!freelaBot) throw new Error('FrelaBot not initialized');

        setIsAnalyzing(true);
        try {
            const analysis = await freelaBot.analyzeAndScoreLead(leadId);
            return analysis;
        } finally {
            setIsAnalyzing(false);
        }
    };

    return { analyzeLead, isAnalyzing };
}

export function useAIInsights() {
    const freelaBot = useFreelaBotService();
    const [insights, setInsights] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadInsights = async () => {
        if (!freelaBot) return;

        setIsLoading(true);
        try {
            const dashboardInsights = await freelaBot.getDashboardInsights();
            setInsights(dashboardInsights);
        } catch (error) {
            console.error('Error loading insights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInsights();
    }, [freelaBot]);

    return { insights, isLoading, reloadInsights: loadInsights };
}