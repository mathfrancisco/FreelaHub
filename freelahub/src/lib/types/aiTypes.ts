export interface AIInsight {
    id: string;
    type: 'content_analysis' | 'lead_analysis' | 'performance_prediction' | 'automation_suggestion';
    title: string;
    description: string;
    data: any;
    confidence: number;
    actionable: boolean;
    priority: 'high' | 'medium' | 'low';
    createdAt: Date;
    acknowledged: boolean;
}

export interface ContentOptimization {
    original: string;
    optimized: string;
    improvements: string[];
    metrics: {
        readabilityScore: number;
        engagementPotential: number;
        seoScore: number;
    };
}

export interface PredictiveAnalytics {
    contentPerformance: {
        expectedEngagement: number;
        bestPostingTime: string;
        platformRecommendations: string[];
    };
    leadConversion: {
        probability: number;
        factors: string[];
        recommendedActions: string[];
    };
    businessGrowth: {
        projectedGrowth: number;
        keyOpportunities: string[];
        risks: string[];
    };
}

export interface AutomationSuggestion {
    name: string;
    description: string;
    trigger: string;
    actions: string[];
    estimatedTimeSaved: number;
    complexity: 'simple' | 'medium' | 'complex';
    roi: number;
}