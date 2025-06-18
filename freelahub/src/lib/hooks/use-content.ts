import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Content, PerformanceMetrics, AIAnalysis } from '@/lib/types';
import { toast } from 'sonner';
import { useContentStore } from '@/store/content-store'; // Assumindo que o store está neste caminho

export function useContent() {
    const [contents, setContents] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Opcionalmente, você pode usar o store também
    const store = useContentStore();

    const fetchContents = useCallback(async (userId: string, filters?: {
        status?: string;
        content_type?: string;
        platform?: string;
        limit?: number;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            let query = supabase
                .from('contents')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            if (filters?.content_type) {
                query = query.eq('content_type', filters.content_type);
            }

            if (filters?.platform) {
                query = query.contains('target_platforms', [filters.platform]);
            }

            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            setContents(data || []);
            return data || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdos';
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createContent = useCallback(async (contentData: Omit<Content, 'id' | 'created_at' | 'updated_at'>) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('contents')
                .insert({
                    ...contentData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            setContents(prev => [data, ...prev]);
            toast.success('Conteúdo criado com sucesso!');
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conteúdo';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateContent = useCallback(async (id: string, updates: Partial<Content>) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('contents')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setContents(prev => prev.map(content =>
                content.id === id ? data : content
            ));
            toast.success('Conteúdo atualizado com sucesso!');
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conteúdo';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteContent = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('contents')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setContents(prev => prev.filter(content => content.id !== id));
            toast.success('Conteúdo excluído com sucesso!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir conteúdo';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const duplicateContent = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Buscar o conteúdo original
            const { data: originalContent, error: fetchError } = await supabase
                .from('contents')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            // Criar cópia
            const { data, error } = await supabase
                .from('contents')
                .insert({
                    ...originalContent,
                    id: undefined,
                    title: `${originalContent.title} (Cópia)`,
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    published_at: null,
                    scheduled_for: null
                })
                .select()
                .single();

            if (error) throw error;

            setContents(prev => [data, ...prev]);
            toast.success('Conteúdo duplicado com sucesso!');
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao duplicar conteúdo';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getContentById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdo';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Novos métodos que estavam faltando
    const scheduleContent = useCallback(async (id: string, scheduledFor: string) => {
        return await updateContent(id, {
            status: 'scheduled',
            scheduled_for: scheduledFor
        });
    }, [updateContent]);

    const publishContent = useCallback(async (id: string) => {
        return await updateContent(id, {
            status: 'published',
            published_at: new Date().toISOString()
        });
    }, [updateContent]);

    const archiveContent = useCallback(async (id: string) => {
        return await updateContent(id, {
            status: 'archived'
        });
    }, [updateContent]);

    const updatePerformanceMetrics = useCallback(async (id: string, metrics: PerformanceMetrics) => {
        return await updateContent(id, {
            performance_metrics: metrics
        });
    }, [updateContent]);

    const updateAIAnalysis = useCallback(async (id: string, analysis: AIAnalysis) => {
        return await updateContent(id, {
            ai_analysis: analysis
        });
    }, [updateContent]);

    const updateEngagementScore = useCallback(async (id: string, score: number) => {
        return await updateContent(id, {
            engagement_score: score
        });
    }, [updateContent]);

    // Método para buscar conteúdos com filtros avançados
    const fetchContentsAdvanced = useCallback(async (userId: string, options?: {
        filters?: {
            status?: string;
            content_type?: string;
            target_platforms?: string[];
            search_query?: string;
            date_range?: {
                start: string;
                end: string;
            };
        };
        page?: number;
        limit?: number;
        orderBy?: string;
        orderDirection?: 'asc' | 'desc';
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const {
                filters = {},
                page = 1,
                limit = 20,
                orderBy = 'created_at',
                orderDirection = 'desc'
            } = options || {};

            let query = supabase
                .from('contents')
                .select('*')
                .eq('user_id', userId);

            // Aplicar filtros
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.content_type) {
                query = query.eq('content_type', filters.content_type);
            }

            if (filters.target_platforms && filters.target_platforms.length > 0) {
                query = query.overlaps('target_platforms', filters.target_platforms);
            }

            if (filters.search_query) {
                query = query.or(`title.ilike.%${filters.search_query}%,body.ilike.%${filters.search_query}%`);
            }

            if (filters.date_range) {
                query = query
                    .gte('created_at', filters.date_range.start)
                    .lte('created_at', filters.date_range.end);
            }

            // Aplicar ordenação e paginação
            query = query
                .order(orderBy, { ascending: orderDirection === 'asc' })
                .range((page - 1) * limit, page * limit - 1);

            const { data, error } = await query;

            if (error) throw error;

            setContents(data || []);
            return data || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conteúdos';
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        // State
        contents,
        isLoading,
        error,

        // Basic CRUD operations
        fetchContents,
        fetchContentsAdvanced,
        createContent,
        updateContent,
        deleteContent,
        duplicateContent,
        getContentById,

        // Status operations
        scheduleContent,
        publishContent,
        archiveContent,

        // Analytics operations
        updatePerformanceMetrics,
        updateAIAnalysis,
        updateEngagementScore,

        // Store access (caso precise usar diretamente)
        store,

        // Utility
        clearError: () => setError(null),
        refetch: (userId: string, filters?: any) => fetchContents(userId, filters)
    };
}

// Hook alternativo que usa apenas o store
export function useContentWithStore() {
    const {
        contents,
        currentContent,
        isLoading,
        error,
        filters,
        pagination,
        fetchContents,
        fetchContentById,
        createContent,
        updateContent,
        deleteContent,
        duplicateContent,
        scheduleContent,
        publishContent,
        archiveContent,
        updatePerformanceMetrics,
        updateAIAnalysis,
        setFilters,
        searchContents,
        clearFilters,
        setPage,
        setLimit,
        clearError,
        setCurrentContent,
    } = useContentStore();

    return {
        // State
        contents,
        currentContent,
        isLoading,
        error,
        filters,
        pagination,

        // Actions
        fetchContents,
        fetchContentById,
        createContent,
        updateContent,
        deleteContent,
        duplicateContent,
        scheduleContent,
        publishContent,
        archiveContent,
        updatePerformanceMetrics,
        updateAIAnalysis,

        // Filters and search
        setFilters,
        searchContents,
        clearFilters,

        // Pagination
        setPage,
        setLimit,

        // Utility
        clearError,
        setCurrentContent,
    };
}