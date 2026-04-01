// Metric types and configuration
export type MetricKey = 'newLeads' | 'callsConversations' | 'uniqueConversations' | 'appointments'

export interface MetricConfig {
  key: MetricKey
  label: string
  icon: string // Lucide icon name
  suffix: string // e.g. "leads", "calls", "convos", "appts"
  placeholder: string // e.g. "e.g. 25"
  helpText?: string // Optional guidance
}

// Agent / Team context
export interface Agent {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: 'agent' | 'team_lead' | 'admin'
  teamId: string
}

// Goal data model
export interface MonthlyGoal {
  id: string
  agentId: string
  teamLeadId: string
  month: string // ISO format: "2026-04"
  metrics: Record<MetricKey, number> // { newLeads: 25, callsConversations: 80, ... }
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

// Request/Response types
export interface SetGoalsRequest {
  agentId: string
  metrics: Record<MetricKey, number>
}

export interface SetGoalsResponse {
  success: boolean
  goal?: MonthlyGoal
  error?: string
}
