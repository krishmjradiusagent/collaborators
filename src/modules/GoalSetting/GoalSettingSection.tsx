import * as React from "react"
import { CollapsibleSection } from "../../components/CollapsibleSection"
import { GoalSettingModal } from "./GoalSettingModal"
import { BulkGoalSettingModal } from "./BulkGoalSettingModal"
import { AgentGoalCard } from "./AgentGoalCard"
import { useGoals, goalService } from "@mel-goals/shared"
import type { Agent } from "@mel-goals/shared"

export function GoalSettingSection() {
  const { agents, setSelectedAgent } = useGoals({
    service: goalService,
    teamLeadId: "lead_001",
  })

  const [modalOpen, setModalOpen] = React.useState(false)
  const [bulkModalOpen, setBulkModalOpen] = React.useState(false)
  const [activeAgent, setActiveAgent] = React.useState<Agent | null>(null)

  const handleEditGoals = (agent: Agent) => {
    setActiveAgent(agent)
    setSelectedAgent(agent)
    setModalOpen(true)
  }

  return (
    <CollapsibleSection 
      title="Goals" 
      actionLabel="Set goals for all" 
      onActionClick={() => setBulkModalOpen(true)}
      defaultOpen={true}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <AgentGoalCard 
              key={agent.id} 
              agent={agent} 
              index={index} 
              onClick={() => handleEditGoals(agent)}
            />
          ))}
        </div>
      </div>

      {activeAgent && (
        <GoalSettingModal
          agentId={activeAgent.id}
          agentName={activeAgent.name}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}

      <BulkGoalSettingModal 
        open={bulkModalOpen}
        onOpenChange={setBulkModalOpen}
      />
    </CollapsibleSection>
  )
}
