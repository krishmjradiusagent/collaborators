import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_MONTH } from '../constants/metrics.js';
export function useGoals({ service, teamLeadId }) {
    const [goals, setGoalsState] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    // Load team agents on mount
    useEffect(() => {
        const loadAgents = async () => {
            try {
                setLoading(true);
                const fetchedAgents = await service.getTeamAgents(teamLeadId);
                setAgents(fetchedAgents);
                if (fetchedAgents.length > 0) {
                    setSelectedAgent(fetchedAgents[0]);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load agents');
            }
            finally {
                setLoading(false);
            }
        };
        loadAgents();
    }, [teamLeadId, service]);
    // Load goals when agent changes
    useEffect(() => {
        if (!selectedAgent)
            return;
        const loadGoals = async () => {
            try {
                setLoading(true);
                const currentGoals = await service.getGoalsForAgent(selectedAgent.id, DEFAULT_MONTH());
                setGoalsState(currentGoals);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load goals');
            }
            finally {
                setLoading(false);
            }
        };
        loadGoals();
    }, [selectedAgent, service]);
    const setGoals = useCallback(async (metrics) => {
        if (!selectedAgent) {
            setError('No agent selected');
            return;
        }
        try {
            setSaving(true);
            setError(null);
            const updated = await service.setGoalsForAgent(selectedAgent.id, metrics);
            setGoalsState(updated);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save goals');
            throw err;
        }
        finally {
            setSaving(false);
        }
    }, [selectedAgent, service]);
    const refresh = useCallback(async () => {
        if (!selectedAgent)
            return;
        try {
            setLoading(true);
            const currentGoals = await service.getGoalsForAgent(selectedAgent.id, DEFAULT_MONTH());
            setGoalsState(currentGoals);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh goals');
        }
        finally {
            setLoading(false);
        }
    }, [selectedAgent, service]);
    return {
        goals,
        agents,
        selectedAgent,
        loading,
        saving,
        error,
        setSelectedAgent,
        setGoals,
        refresh,
    };
}
//# sourceMappingURL=useGoals.js.map