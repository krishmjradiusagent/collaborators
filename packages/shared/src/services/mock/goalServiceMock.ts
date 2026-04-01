import { GoalServiceInterface } from '../types'
import { MonthlyGoal, Agent } from '../../types'
import { DEFAULT_MONTH } from '../../constants/metrics'

// Mock data — realistic agent profiles
const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@radius.com',
    role: 'agent',
    teamId: 'team_001',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah.chen',
  },
  {
    id: 'agent_002',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@radius.com',
    role: 'agent',
    teamId: 'team_001',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus.johnson',
  },
  {
    id: 'agent_003',
    name: 'Jessica Rodriguez',
    email: 'jessica.rodriguez@radius.com',
    role: 'agent',
    teamId: 'team_001',
    avatarUrl: 'https://i.pravatar.cc/150?u=jessica.rodriguez',
  },
  {
    id: 'agent_004',
    name: 'David Kim',
    email: 'david.kim@radius.com',
    role: 'agent',
    teamId: 'team_001',
    avatarUrl: 'https://i.pravatar.cc/150?u=david.kim',
  },
  {
    id: 'agent_005',
    name: 'Amanda Foster',
    email: 'amanda.foster@radius.com',
    role: 'agent',
    teamId: 'team_001',
    avatarUrl: 'https://i.pravatar.cc/150?u=amanda.foster',
  },
]

// In-memory goal storage (reset on app reload)
const goalStore = new Map<string, MonthlyGoal>()

export class GoalServiceMock implements GoalServiceInterface {
  async getGoalsForAgent(agentId: string, month: string): Promise<MonthlyGoal | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const key = `${agentId}_${month}`
    return goalStore.get(key) || null
  }

  async setGoalsForAgent(agentId: string, metrics: Record<string, number>): Promise<MonthlyGoal> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const month = DEFAULT_MONTH()
    const key = `${agentId}_${month}`

    const goal: MonthlyGoal = {
      id: `goal_${Date.now()}`,
      agentId,
      teamLeadId: 'lead_001', // Mock team lead ID
      month,
      metrics: metrics as Record<string, number>,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    goalStore.set(key, goal)
    return goal
  }

  async getTeamAgents(teamLeadId: string): Promise<Agent[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))
    // Return all mock agents (in real implementation, filter by teamLeadId)
    return MOCK_AGENTS
  }

  async getGoalHistory(agentId: string, limit: number = 6): Promise<MonthlyGoal[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))
    // For MVP, return empty array (not used in initial UI)
    return []
  }
}

export const goalService = new GoalServiceMock()
