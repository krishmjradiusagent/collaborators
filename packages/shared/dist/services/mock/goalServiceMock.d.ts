import { GoalServiceInterface } from '../types.js';
import { MonthlyGoal, Agent } from '../../types.js';
export declare class GoalServiceMock implements GoalServiceInterface {
    getGoalsForAgent(agentId: string, month: string): Promise<MonthlyGoal | null>;
    setGoalsForAgent(agentId: string, metrics: Record<string, number>): Promise<MonthlyGoal>;
    getTeamAgents(teamLeadId: string): Promise<Agent[]>;
    getGoalHistory(agentId: string, limit?: number): Promise<MonthlyGoal[]>;
}
export declare const goalService: GoalServiceMock;
//# sourceMappingURL=goalServiceMock.d.ts.map