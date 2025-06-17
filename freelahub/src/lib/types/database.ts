export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
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
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    subscription_tier?: 'starter' | 'professional' | 'business' | 'enterprise' | null
                    business_info?: any | null
                    settings?: any | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    subscription_tier?: 'starter' | 'professional' | 'business' | 'enterprise' | null
                    business_info?: any | null
                    settings?: any | null
                    created_at?: string
                    updated_at?: string
                }
            }
            contents: {
                Row: {
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
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    body: string
                    content_type: 'post' | 'article' | 'video' | 'image' | 'story'
                    target_platforms: string[]
                    status?: 'draft' | 'scheduled' | 'published' | 'archived'
                    scheduled_for?: string | null
                    published_at?: string | null
                    hashtags?: string[]
                    media_file_ids?: string[]
                    performance_metrics?: any | null
                    ai_analysis?: any | null
                    engagement_score?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    body?: string
                    content_type?: 'post' | 'article' | 'video' | 'image' | 'story'
                    target_platforms?: string[]
                    status?: 'draft' | 'scheduled' | 'published' | 'archived'
                    scheduled_for?: string | null
                    published_at?: string | null
                    hashtags?: string[]
                    media_file_ids?: string[]
                    performance_metrics?: any | null
                    ai_analysis?: any | null
                    engagement_score?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

// Type aliases for easier use
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type ContentRow = Database['public']['Tables']['contents']['Row']
export type ContentInsert = Database['public']['Tables']['contents']['Insert']
export type ContentDatabaseUpdate = Database['public']['Tables']['contents']['Update']