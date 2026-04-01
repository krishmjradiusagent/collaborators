import { MonthlyGoal, Agent } from '../types'

export interface GoalServiceInterface {
  /**
   * Get current or target goals for an agent in a specific month
   */
  getGoalsForAgent(agentId: string, month: string): Promise<MonthlyGoal | null>

  /**
   * Set or update goals for an agent (current month assumed)
   */
  setGoalsForAgent(agentId: string, metrics: Record<string, number>): Promise<MonthlyGoal>

  /**
   * Get all agents managed by a team lead
   */
  getTeamAgents(teamLeadId: string): Promise<Agent[]>

  /**
   * Set goals for multiple agents (the "Set goals for all" feature)
   */
  setGoalsForTeam(teamLeadId: string, agentIds: string[], metrics: Record<string, number>): Promise<void>

  /**
   * Get current or historical goal for reference
   */
  getGoalHistory(agentId: string, limit?: number): Promise<MonthlyGoal[]>
}
