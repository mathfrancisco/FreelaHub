import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Lead, Interaction } from '@/lib/types'
import { supabase } from '@/lib/supabase/supabase'

export interface LeadFilters {
    status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    source?: string
    score_min?: number
    score_max?: number
    estimated_value_min?: number
    estimated_value_max?: number
    tags?: string[]
    date_range?: {
        start: string
        end: string
    }
    search_query?: string
}

export interface LeadFetchOptions {
    filters?: LeadFilters
    page?: number
    limit?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}

export interface LeadUpdate {
    name?: string
    email?: string
    company?: string
    position?: string
    phone?: string
    linkedin_url?: string
    source?: string
    status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    score?: number
    estimated_value?: number
    tags?: string[]
    notes?: string
    last_contact?: string
    next_action?: string
    next_action_date?: string
    custom_fields?: Record<string, any>
    updated_at?: string
}

export interface InteractionCreate {
    lead_id: string
    type: 'email' | 'call' | 'meeting' | 'message' | 'proposal'
    subject: string
    content: string
    outcome?: 'positive' | 'neutral' | 'negative'
    sentiment?: 'positive' | 'neutral' | 'negative'
    analysis_data?: Record<string, any>
    attachments?: string[]
}

export interface CRMState {
    // Leads
    leads: Lead[]
    selectedLead: Lead | null
    leadsLoading: boolean
    leadsTotalCount: number

    // Interactions
    interactions: Interaction[]
    selectedInteraction: Interaction | null
    interactionsLoading: boolean

    // Lead actions
    fetchLeads: (options?: LeadFetchOptions) => Promise<void>
    createLead: (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Lead>
    updateLead: (leadId: string, updates: LeadUpdate) => Promise<void>
    deleteLead: (leadId: string) => Promise<void>
    setSelectedLead: (lead: Lead | null) => void

    // Interaction actions
    fetchInteractions: (leadId?: string) => Promise<void>
    createInteraction: (interaction: InteractionCreate) => Promise<Interaction>
    deleteInteraction: (interactionId: string) => Promise<void>
    setSelectedInteraction: (interaction: Interaction | null) => void

    // Analytics
    getLeadsByStatus: () => Record<string, number>
    getLeadsBySource: () => Record<string, number>
    getTotalEstimatedValue: () => number
    getConversionRate: () => number

    // Utility
    clearStore: () => void
}

export const useCRMStore = create<CRMState>()(
    persist(
        (set, get) => ({
            // Initial state
            leads: [],
            selectedLead: null,
            leadsLoading: false,
            leadsTotalCount: 0,
            interactions: [],
            selectedInteraction: null,
            interactionsLoading: false,

            // Lead actions
            fetchLeads: async (options: LeadFetchOptions = {}) => {
                set({ leadsLoading: true })
                try {
                    const {
                        filters = {},
                        page = 1,
                        limit = 20,
                        orderBy = 'created_at',
                        orderDirection = 'desc'
                    } = options

                    let query = supabase
                        .from('leads')
                        .select('*', { count: 'exact' })

                    // Apply filters
                    if (filters.status) {
                        query = query.eq('status', filters.status)
                    }
                    if (filters.source) {
                        query = query.eq('source', filters.source)
                    }
                    if (filters.score_min !== undefined) {
                        query = query.gte('score', filters.score_min)
                    }
                    if (filters.score_max !== undefined) {
                        query = query.lte('score', filters.score_max)
                    }
                    if (filters.estimated_value_min !== undefined) {
                        query = query.gte('estimated_value', filters.estimated_value_min)
                    }
                    if (filters.estimated_value_max !== undefined) {
                        query = query.lte('estimated_value', filters.estimated_value_max)
                    }
                    if (filters.tags && filters.tags.length > 0) {
                        query = query.overlaps('tags', filters.tags)
                    }
                    if (filters.date_range) {
                        query = query
                            .gte('created_at', filters.date_range.start)
                            .lte('created_at', filters.date_range.end)
                    }
                    if (filters.search_query) {
                        query = query.or(`name.ilike.%${filters.search_query}%,email.ilike.%${filters.search_query}%,company.ilike.%${filters.search_query}%`)
                    }

                    // Apply ordering and pagination
                    query = query
                        .order(orderBy, { ascending: orderDirection === 'asc' })
                        .range((page - 1) * limit, page * limit - 1)

                    const { data, error, count } = await query

                    if (error) throw error

                    set({
                        leads: data || [],
                        leadsTotalCount: count || 0,
                        leadsLoading: false
                    })
                } catch (error) {
                    console.error('Erro ao buscar leads:', error)
                    set({ leadsLoading: false })
                    throw error
                }
            },

            createLead: async (leadData) => {
                try {
                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) throw new Error('Usuário não autenticado')

                    const newLead = {
                        ...leadData,
                        user_id: user.id,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }

                    const { data, error } = await supabase
                        .from('leads')
                        .insert(newLead)
                        .select()
                        .single()

                    if (error) throw error

                    // Update local state
                    const { leads } = get()
                    set({ leads: [data, ...leads] })

                    return data
                } catch (error) {
                    console.error('Erro ao criar lead:', error)
                    throw error
                }
            },

            updateLead: async (leadId: string, updates: LeadUpdate) => {
                try {
                    const leadUpdate = {
                        ...updates,
                        updated_at: new Date().toISOString()
                    }

                    const { data, error } = await supabase
                        .from('leads')
                        .update(leadUpdate)
                        .eq('id', leadId)
                        .select()
                        .single()

                    if (error) throw error

                    // Update local state
                    const { leads, selectedLead } = get()
                    const updatedLeads = leads.map(lead =>
                        lead.id === leadId ? data : lead
                    )

                    set({
                        leads: updatedLeads,
                        selectedLead: selectedLead?.id === leadId ? data : selectedLead
                    })
                } catch (error) {
                    console.error('Erro ao atualizar lead:', error)
                    throw error
                }
            },

            deleteLead: async (leadId: string) => {
                try {
                    const { error } = await supabase
                        .from('leads')
                        .delete()
                        .eq('id', leadId)

                    if (error) throw error

                    // Update local state
                    const { leads, selectedLead } = get()
                    const filteredLeads = leads.filter(lead => lead.id !== leadId)

                    set({
                        leads: filteredLeads,
                        selectedLead: selectedLead?.id === leadId ? null : selectedLead
                    })
                } catch (error) {
                    console.error('Erro ao deletar lead:', error)
                    throw error
                }
            },

            setSelectedLead: (lead: Lead | null) => {
                set({ selectedLead: lead })
            },

            // Interaction actions
            fetchInteractions: async (leadId?: string) => {
                set({ interactionsLoading: true })
                try {
                    let query = supabase
                        .from('interactions')
                        .select('*')
                        .order('created_at', { ascending: false })

                    if (leadId) {
                        query = query.eq('lead_id', leadId)
                    }

                    const { data, error } = await query

                    if (error) throw error

                    set({
                        interactions: data || [],
                        interactionsLoading: false
                    })
                } catch (error) {
                    console.error('Erro ao buscar interações:', error)
                    set({ interactionsLoading: false })
                    throw error
                }
            },

            createInteraction: async (interactionData: InteractionCreate) => {
                try {
                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) throw new Error('Usuário não autenticado')

                    const newInteraction = {
                        ...interactionData,
                        user_id: user.id,
                        created_at: new Date().toISOString()
                    }

                    const { data, error } = await supabase
                        .from('interactions')
                        .insert(newInteraction)
                        .select()
                        .single()

                    if (error) throw error

                    // Update local state
                    const { interactions } = get()
                    set({ interactions: [data, ...interactions] })

                    return data
                } catch (error) {
                    console.error('Erro ao criar interação:', error)
                    throw error
                }
            },

            deleteInteraction: async (interactionId: string) => {
                try {
                    const { error } = await supabase
                        .from('interactions')
                        .delete()
                        .eq('id', interactionId)

                    if (error) throw error

                    // Update local state
                    const { interactions, selectedInteraction } = get()
                    const filteredInteractions = interactions.filter(
                        interaction => interaction.id !== interactionId
                    )

                    set({
                        interactions: filteredInteractions,
                        selectedInteraction: selectedInteraction?.id === interactionId ? null : selectedInteraction
                    })
                } catch (error) {
                    console.error('Erro ao deletar interação:', error)
                    throw error
                }
            },

            setSelectedInteraction: (interaction: Interaction | null) => {
                set({ selectedInteraction: interaction })
            },

            // Analytics
            getLeadsByStatus: () => {
                const { leads } = get()
                return leads.reduce((acc, lead) => {
                    acc[lead.status] = (acc[lead.status] || 0) + 1
                    return acc
                }, {} as Record<string, number>)
            },

            getLeadsBySource: () => {
                const { leads } = get()
                return leads.reduce((acc, lead) => {
                    acc[lead.source] = (acc[lead.source] || 0) + 1
                    return acc
                }, {} as Record<string, number>)
            },

            getTotalEstimatedValue: () => {
                const { leads } = get()
                return leads.reduce((total, lead) => {
                    return total + (lead.estimated_value || 0)
                }, 0)
            },

            getConversionRate: () => {
                const { leads } = get()
                const totalLeads = leads.length
                const wonLeads = leads.filter(lead => lead.status === 'won').length

                return totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0
            },

            // Utility
            clearStore: () => {
                set({
                    leads: [],
                    selectedLead: null,
                    leadsLoading: false,
                    leadsTotalCount: 0,
                    interactions: [],
                    selectedInteraction: null,
                    interactionsLoading: false
                })
            }
        }),
        {
            name: 'crm-storage',
            partialize: (state) => ({
                selectedLead: state.selectedLead,
                selectedInteraction: state.selectedInteraction
            }),
        }
    )
)