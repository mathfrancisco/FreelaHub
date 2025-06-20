import { Session } from '@supabase/supabase-js'

export interface User {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    subscription_tier: 'starter' | 'professional' | 'business' | 'enterprise'
    business_info?: BusinessInfo
    settings?: UserSettings
    created_at: string
    updated_at: string
}

export interface BusinessInfo {
    company_name?: string
    website?: string
    industry?: string
    description?: string
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system'
    language: 'pt' | 'en'
    notifications: NotificationSettings
    privacy: PrivacySettings
}

export interface NotificationSettings {
    email_notifications: boolean
    push_notifications: boolean
    weekly_reports: boolean
    lead_alerts: boolean
    content_reminders: boolean
}

export interface PrivacySettings {
    public_profile: boolean
    analytics_tracking: boolean
    data_sharing: boolean
}

export interface Content {
    id: string
    user_id: string
    title: string
    body: string
    content_type: 'post' | 'article' | 'video' | 'image' | 'story'
    target_platforms: string[]
    status: 'draft' | 'scheduled' | 'published' | 'archived'
    scheduled_for?: string
    published_at?: string
    hashtags: string[]
    media_file_ids: string[]
    performance_metrics?: PerformanceMetrics
    ai_analysis?: AIAnalysis
    engagement_score?: number
    created_at: string
    updated_at: string
}

export interface PerformanceMetrics {
    views?: number
    likes?: number
    shares?: number
    comments?: number
    reach?: number
    impressions?: number
    engagement_rate?: number
}

export interface AIAnalysis {
    sentiment: 'positive' | 'neutral' | 'negative'
    tone: string[]
    topics: string[]
    readability_score: number
    seo_score: number
    suggestions: string[]
    engagement_score: number;
    predicted_performance: {
        instagram: number;
        linkedin: number;
        twitter: number;
        facebook: number;
    };
    optimal_posting_times: {
        [platform: string]: string[];
    };
    content_insights: {
        tone: string;
        complexity: string;
        call_to_action_strength: number;
        emotional_appeal: number;
    };
}

export interface Lead {
    id: string
    user_id: string
    name: string
    email: string
    company?: string
    position?: string
    phone?: string
    linkedin_url?: string
    source: string
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    score: number
    estimated_value?: number
    tags: string[]
    notes?: string
    last_contact?: string
    next_action?: string
    next_action_date?: string
    custom_fields?: Record<string, any>
    created_at: string
    updated_at: string
}

export interface Interaction {
    id: string
    lead_id: string
    user_id: string
    type: 'email' | 'call' | 'meeting' | 'message' | 'proposal'
    subject: string
    content: string
    outcome?: 'positive' | 'neutral' | 'negative'
    sentiment?: 'positive' | 'neutral' | 'negative'
    analysis_data?: Record<string, any>
    attachments?: string[]
    created_at: string
}

export interface MediaFile {
    id: string
    user_id: string
    filename: string
    original_name: string
    file_type: string
    file_url: string
    file_size: number
    metadata?: MediaMetadata
    tags: string[]
    color_palette?: string[]
    dimensions?: {
        width: number
        height: number
    }
    created_at: string
    updated_at: string
}

export interface MediaMetadata {
    alt_text?: string
    caption?: string
    location?: string
    camera_info?: Record<string, any>
    processing_info?: Record<string, any>
}

export interface Reminder {
    id: string
    user_id: string
    title: string
    description?: string
    type: 'task' | 'follow_up' | 'content' | 'meeting' | 'deadline'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'completed' | 'cancelled'
    due_date: string
    is_recurring: boolean
    recurrence_pattern?: RecurrencePattern
    metadata?: Record<string, any>
    created_at: string
    updated_at: string
}

export interface RecurrencePattern {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    days_of_week?: number[]
    day_of_month?: number
    end_date?: string
}

export interface Workflow {
    id: string
    user_id: string
    name: string
    description?: string
    trigger_type: string
    trigger_config: Record<string, any>
    actions: WorkflowAction[]
    status: 'active' | 'inactive' | 'draft'
    execution_count: number
    last_executed?: string
    created_at: string
    updated_at: string
}

export interface WorkflowAction {
    id: string
    type: string
    config: Record<string, any>
    order: number
}

export interface DatabaseProfile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    subscription_tier: 'starter' | 'professional' | 'business' | 'enterprise' | null
    business_info: any | null
    settings: any | null
    created_at: string
    updated_at: string
}

export interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    _hasHydrated: boolean // Add this line
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<{
        user: User | null;
        session: Session | null;
    } | {
        user: null;
        session: null;
    }>
    signOut: () => Promise<void>
    updateUser: (updates: Partial<User>) => Promise<void>
    checkAuth: () => Promise<void>
    setHasHydrated: () => void
}

// Type for safe Supabase updates
export type ProfileUpdate = {
    full_name?: string | null
    avatar_url?: string | null
    subscription_tier?: 'starter' | 'professional' | 'business' | 'enterprise'
    business_info?: any
    settings?: any
    updated_at?: string
}

// Database content type to match Supabase schema
export interface DatabaseContent {
    id: string
    user_id: string
    title: string
    body: string
    content_type: 'post' | 'article' | 'video' | 'image' | 'story'
    target_platforms: string[]
    status: 'draft' | 'scheduled' | 'published' | 'archived'
    scheduled_for: string | null
    published_at: string | null
    hashtags: string[]
    media_file_ids: string[]
    performance_metrics: any | null
    ai_analysis: any | null
    engagement_score: number | null
    created_at: string
    updated_at: string
}

// Type for query result with count
export interface DatabaseContentWithCount extends DatabaseContent {
    total_count?: number
}

export interface ContentFilters {
    status?: 'draft' | 'scheduled' | 'published' | 'archived'
    content_type?: 'post' | 'article' | 'video' | 'image' | 'story'
    target_platforms?: string[]
    date_range?: {
        start: string
        end: string
    }
    search_query?: string
}

export interface FetchOptions {
    filters?: ContentFilters
    page?: number
    limit?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}

// Type for safe Supabase updates
export type ContentUpdate = {
    title?: string
    body?: string
    content_type?: 'post' | 'article' | 'video' | 'image' | 'story'
    target_platforms?: string[]
    status?: 'draft' | 'scheduled' | 'published' | 'archived'
    scheduled_for?: string | null
    published_at?: string | null
    hashtags?: string[]
    media_file_ids?: string[]
    performance_metrics?: any
    ai_analysis?: any
    engagement_score?: number | null
    updated_at?: string
}

export interface ActivityItem {
    /**
     * Identificador único do item de atividade (ex: "content-uuid" ou "lead-uuid").
     */
    id: string;
    type: 'content' | 'lead' | 'interaction' | 'reminder';
    title: string;
    description: string;
    timestamp: string;
    avatar?: string;
    status?: 'success' | 'warning' | 'error';
}

