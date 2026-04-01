import { useState, useCallback, useEffect } from 'react'
import { GoalServiceInterface } from '../services/types'
import { MonthlyGoal, Agent, MetricKey } from '../types'
import { DEFAULT_MONTH } from '../constants/metrics'

interface UseGoalsProps {
  service: GoalServiceInterface
  teamLeadId: string
}

interface UseGoalsReturn {
  goals: MonthlyGoal | null
  agents: Agent[]
  selectedAgent: Agent | null
  loading: boolean
  saving: boolean
  error: string | null
  setSelectedAgent: (agent: Agent) => void
  setGoals: (metrics: Record<MetricKey, number>) => Promise<void>
  refresh: () => Promise<void>
}

export function useGoals({ service, teamLeadId }: UseGoalsProps): UseGoalsReturn {
  const [goals, setGoalsState] = useState<MonthlyGoal | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load team agents on mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true)
        const fetchedAgents = await service.getTeamAgents(teamLeadId)
        setAgents(fetchedAgents)
        if (fetchedAgents.length > 0) {
          setSelectedAgent(fetchedAgents[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents')
      } finally {
        setLoading(false)
      }
    }
    loadAgents()
  }, [teamLeadId, service])

  // Load goals when agent changes
  useEffect(() => {
    if (!selectedAgent) return

    const loadGoals = async () => {
      try {
        setLoading(true)
        const currentGoals = await service.getGoalsForAgent(selectedAgent.id, DEFAULT_MONTH())
        setGoalsState(currentGoals)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load goals')
      } finally {
        setLoading(false)
      }
    }
    loadGoals()
  }, [selectedAgent, service])

  const setGoals = useCallback(
    async (metrics: Record<MetricKey, number>) => {
      if (!selectedAgent) {
        setError('No agent selected')
        return
      }

      try {
        setSaving(true)
        setError(null)
        const updated = await service.setGoalsForAgent(selectedAgent.id, metrics)
        setGoalsState(updated)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save goals')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [selectedAgent, service]
  )

  const refresh = useCallback(async () => {
    if (!selectedAgent) return
    try {
      setLoading(true)
      const currentGoals = await service.getGoalsForAgent(selectedAgent.id, DEFAULT_MONTH())
      setGoalsState(currentGoals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh goals')
    } finally {
      setLoading(false)
    }
  }, [selectedAgent, service])

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
  }
}
