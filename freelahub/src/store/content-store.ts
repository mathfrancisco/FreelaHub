import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    Content,
    PerformanceMetrics,
    AIAnalysis,
    DatabaseContent,
    ContentUpdate,
    FetchOptions,
    ContentFilters
} from '@/lib/types'
import { supabase } from '@/lib/supabase/supabase'

interface ContentState {
    contents: Content[]
    currentContent: Content | null
    isLoading: boolean
    error: string | null
    filters: ContentFilters
    pagination: {
        page: number
        limit: number
        total: number
    }

    // Actions
    fetchContents: (userId: string, options?: FetchOptions) => Promise<void>
    fetchContentById: (id: string) => Promise<void>
    createContent: (content: Omit<Content, 'id' | 'created_at' | 'updated_at'>) => Promise<Content>
    updateContent: (id: string, updates: Partial<Content>) => Promise<void>
    deleteContent: (id: string) => Promise<void>
    duplicateContent: (id: string) => Promise<Content>
    scheduleContent: (id: string, scheduledFor: string) => Promise<void>
    publishContent: (id: string) => Promise<void>
    archiveContent: (id: string) => Promise<void>
    updatePerformanceMetrics: (id: string, metrics: PerformanceMetrics) => Promise<void>
    updateAIAnalysis: (id: string, analysis: AIAnalysis) => Promise<void>

    // Filters and search
    setFilters: (filters: Partial<ContentFilters>) => void
    searchContents: (query: string) => void
    clearFilters: () => void

    // Pagination
    setPage: (page: number) => void
    setLimit: (limit: number) => void

    // Utility
    clearError: () => void
    setCurrentContent: (content: Content | null) => void
}

// Helper function to convert database content to Content
const databaseToContent = (dbContent: DatabaseContent): Content => ({
    id: dbContent.id,
    user_id: dbContent.user_id,
    title: dbContent.title,
    body: dbContent.body,
    content_type: dbContent.content_type,
    target_platforms: dbContent.target_platforms,
    status: dbContent.status,
    scheduled_for: dbContent.scheduled_for || undefined,
    published_at: dbContent.published_at || undefined,
    hashtags: dbContent.hashtags,
    media_file_ids: dbContent.media_file_ids,
    performance_metrics: dbContent.performance_metrics,
    ai_analysis: dbContent.ai_analysis,
    engagement_score: dbContent.engagement_score || undefined,
    created_at: dbContent.created_at,
    updated_at: dbContent.updated_at,
})

// Helper function to convert Content to database format
const contentToDatabase = (content: Omit<Content, 'id' | 'created_at' | 'updated_at'>): Omit<ContentUpdate, 'updated_at'> => ({
    title: content.title,
    body: content.body,
    content_type: content.content_type,
    target_platforms: content.target_platforms,
    status: content.status,
    scheduled_for: content.scheduled_for || null,
    published_at: content.published_at || null,
    hashtags: content.hashtags,
    media_file_ids: content.media_file_ids,
    performance_metrics: content.performance_metrics,
    ai_analysis: content.ai_analysis,
    engagement_score: content.engagement_score || null,
})

export const useContentStore = create<ContentState>()(
    persist(
        (set, get) => ({
            contents: [],
            currentContent: null,
            isLoading: false,
            error: null,
            filters: {},
            pagination: {
                page: 1,
                limit: 20,
                total: 0
            },

            fetchContents: async (userId: string, options?: FetchOptions) => {
                set({ isLoading: true, error: null })
                try {
                    const { filters = {}, page = 1, limit = 20, orderBy = 'created_at', orderDirection = 'desc' } = options || {}

                    // First, get the count
                    let countQuery = supabase
                        .from('contents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', userId)

                    // Apply same filters to count query
                    if (filters.status) {
                        countQuery = countQuery.eq('status', filters.status)
                    }
                    if (filters.content_type) {
                        countQuery = countQuery.eq('content_type', filters.content_type)
                    }
                    if (filters.target_platforms && filters.target_platforms.length > 0) {
                        countQuery = countQuery.overlaps('target_platforms', filters.target_platforms)
                    }
                    if (filters.search_query) {
                        countQuery = countQuery.or(`title.ilike.%${filters.search_query}%,body.ilike.%${filters.search_query}%`)
                    }
                    if (filters.date_range) {
                        countQuery = countQuery.gte('created_at', filters.date_range.start)
                            .lte('created_at', filters.date_range.end)
                    }

                    const { count, error: countError } = await countQuery
                    if (countError) throw countError

                    // Then get the actual data
                    let dataQuery = supabase
                        .from('contents')
                        .select('*')
                        .eq('user_id', userId)

                    // Apply filters to data query
                    if (filters.status) {
                        dataQuery = dataQuery.eq('status', filters.status)
                    }
                    if (filters.content_type) {
                        dataQuery = dataQuery.eq('content_type', filters.content_type)
                    }
                    if (filters.target_platforms && filters.target_platforms.length > 0) {
                        dataQuery = dataQuery.overlaps('target_platforms', filters.target_platforms)
                    }
                    if (filters.search_query) {
                        dataQuery = dataQuery.or(`title.ilike.%${filters.search_query}%,body.ilike.%${filters.search_query}%`)
                    }
                    if (filters.date_range) {
                        dataQuery = dataQuery.gte('created_at', filters.date_range.start)
                            .lte('created_at', filters.date_range.end)
                    }

                    // Apply pagination and ordering
                    dataQuery = dataQuery
                        .order(orderBy, { ascending: orderDirection === 'asc' })
                        .range((page - 1) * limit, page * limit - 1)

                    const { data, error } = await dataQuery

                    if (error) throw error

                    const contents = data?.map(item => databaseToContent(item as DatabaseContent)) || []

                    set({
                        contents,
                        isLoading: false,
                        pagination: {
                            page,
                            limit,
                            total: count || 0
                        },
                        filters
                    })
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erro ao buscar conteúdos'
                    })
                }
            },

            fetchContentById: async (id: string) => {
                set({ isLoading: true, error: null })
                try {
                    const { data, error } = await supabase
                        .from('contents')
                        .select('*')
                        .eq('id', id)
                        .single()

                    if (error) throw error

                    const content = databaseToContent(data as DatabaseContent)
                    set({ currentContent: content, isLoading: false })
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erro ao buscar conteúdo'
                    })
                }
            },

            createContent: async (content) => {
                set({ isLoading: true, error: null })
                try {
                    const contentData = {
                        ...contentToDatabase(content),
                        user_id: content.user_id,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }

                    const { data, error } = await supabase
                        .from('contents')
                        .insert(contentData)
                        .select()
                        .single()

                    if (error) throw error

                    const newContent = databaseToContent(data as DatabaseContent)

                    set(state => ({
                        contents: [newContent, ...state.contents],
                        isLoading: false
                    }))

                    return newContent
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erro ao criar conteúdo'
                    })
                    throw error
                }
            },

            updateContent: async (id: string, updates: Partial<Content>) => {
                set({ isLoading: true, error: null })
                try {
                    const updateData: ContentUpdate = {
                        updated_at: new Date().toISOString()
                    }

                    // Map updates to database format with proper type checking
                    Object.keys(updates).forEach(key => {
                        const value = updates[key as keyof Content]
                        if (value !== undefined) {
                            switch (key) {
                                case 'scheduled_for':
                                case 'published_at':
                                    (updateData as any)[key] = value || null;
                                    break
                                case 'engagement_score':
                                    // Ensure engagement_score is a number or null
                                    if (typeof value === 'number' || value === null) {
                                        if (typeof value === "number") {
                                            updateData[key] = value
                                        }
                                    } else if (typeof value === 'string' && !isNaN(Number(value))) {
                                        updateData[key] = Number(value)
                                    } else {
                                        updateData[key] = null
                                    }
                                    break
                                case 'title':
                                case 'body':
                                case 'content_type':
                                case 'status':
                                    // @ts-ignore
                                    updateData[key as keyof ContentUpdate] = value as any
                                    break
                                case 'target_platforms':
                                case 'hashtags':
                                case 'media_file_ids':
                                    // @ts-ignore
                                    updateData[key as keyof ContentUpdate] = value as string[]
                                    break
                                case 'performance_metrics':
                                case 'ai_analysis':
                                    // @ts-ignore
                                    updateData[key as keyof ContentUpdate] = value as any
                                    break
                            }
                        }
                    })

                    const { data, error } = await supabase
                        .from('contents')
                        .update(updateData)
                        .eq('id', id)
                        .select()
                        .single()

                    if (error) throw error

                    const updatedContent = databaseToContent(data as DatabaseContent)

                    set(state => ({
                        contents: state.contents.map(c => c.id === id ? updatedContent : c),
                        currentContent: state.currentContent?.id === id ? updatedContent : state.currentContent,
                        isLoading: false
                    }))
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erro ao atualizar conteúdo'
                    })
                }
            },

            deleteContent: async (id: string) => {
                set({ isLoading: true, error: null })
                try {
                    const { error } = await supabase
                        .from('contents')
                        .delete()
                        .eq('id', id)

                    if (error) throw error

                    set(state => ({
                        contents: state.contents.filter(c => c.id !== id),
                        currentContent: state.currentContent?.id === id ? null : state.currentContent,
                        isLoading: false
                    }))
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erro ao deletar conteúdo'
                    })
                }
            },

            duplicateContent: async (id: string) => {
                set({ isLoading: true, error: null })
                try {
                    const original = get().contents.find(c => c.id === id)
                    if (!original) throw new Error('Conteúdo não encontrado')

                    const duplicatedContent = {
                        ...original,
                        title: `${original.title} (Cópia)`,
                        status: 'draft' as const,
                        scheduled_for: undefined,
                        published_at: undefined,
                        performance_metrics: undefined
                    }

                    // Remove fields that shouldn't be duplicated
                    const { id: _, created_at: __, updated_at: ___, ...contentData } = duplicatedContent

                    return await get().createContent(contentData)
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erro ao duplicar conteúdo'
                    })
                    throw error
                }
            },

            scheduleContent: async (id: string, scheduledFor: string) => {
                await get().updateContent(id, {
                    status: 'scheduled',
                    scheduled_for: scheduledFor
                })
            },

            publishContent: async (id: string) => {
                await get().updateContent(id, {
                    status: 'published',
                    published_at: new Date().toISOString()
                })
            },

            archiveContent: async (id: string) => {
                await get().updateContent(id, {
                    status: 'archived'
                })
            },

            updatePerformanceMetrics: async (id: string, metrics: PerformanceMetrics) => {
                await get().updateContent(id, {
                    performance_metrics: metrics
                })
            },

            updateAIAnalysis: async (id: string, analysis: AIAnalysis) => {
                await get().updateContent(id, {
                    ai_analysis: analysis
                })
            },

            setFilters: (filters: Partial<ContentFilters>) => {
                set(state => ({
                    filters: { ...state.filters, ...filters }
                }))
            },

            searchContents: (query: string) => {
                set(state => ({
                    filters: { ...state.filters, search_query: query }
                }))
            },

            clearFilters: () => {
                set({ filters: {} })
            },

            setPage: (page: number) => {
                set(state => ({
                    pagination: { ...state.pagination, page }
                }))
            },

            setLimit: (limit: number) => {
                set(state => ({
                    pagination: { ...state.pagination, limit, page: 1 }
                }))
            },

            clearError: () => {
                set({ error: null })
            },

            setCurrentContent: (content: Content | null) => {
                set({ currentContent: content })
            },
        }),
        {
            name: 'content-storage',
            partialize: (state) => ({
                filters: state.filters,
                pagination: state.pagination
            }),
        }
    )
)