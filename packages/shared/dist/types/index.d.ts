export type MetricKey = 'newLeads' | 'callsConversations' | 'uniqueConversations' | 'appointments';
export interface MetricConfig {
    key: MetricKey;
    label: string;
    icon: string;
    suffix: string;
    placeholder: string;
    helpText?: string;
}
export interface Agent {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: 'agent' | 'team_lead' | 'admin';
    teamId: string;
}
export interface MonthlyGoal {
    id: string;
    agentId: string;
    teamLeadId: string;
    month: string;
    metrics: Record<MetricKey, number>;
    createdAt: string;
    updatedAt: string;
}
export interface SetGoalsRequest {
    agentId: string;
    metrics: Record<MetricKey, number>;
}
export interface SetGoalsResponse {
    success: boolean;
    goal?: MonthlyGoal;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map