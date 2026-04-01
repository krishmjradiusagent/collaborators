import { GoalServiceInterface } from '../services/types.js';
import { MonthlyGoal, Agent, MetricKey } from '../types.js';
interface UseGoalsProps {
    service: GoalServiceInterface;
    teamLeadId: string;
}
interface UseGoalsReturn {
    goals: MonthlyGoal | null;
    agents: Agent[];
    selectedAgent: Agent | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    setSelectedAgent: (agent: Agent) => void;
    setGoals: (metrics: Record<MetricKey, number>) => Promise<void>;
    refresh: () => Promise<void>;
}
export declare function useGoals({ service, teamLeadId }: UseGoalsProps): UseGoalsReturn;
export {};
//# sourceMappingURL=useGoals.d.ts.map