import * as React from "react"
import { Target, TrendingUp, Phone, MessageCircle, Calendar } from "lucide-react"
import { CollapsibleSection } from "../../components/CollapsibleSection"
import { GoalSettingModal } from "./GoalSettingModal"
import { useGoals, goalService } from "@mel-goals/shared"
import type { Agent } from "@mel-goals/shared"

export function GoalSettingSection() {
  const { agents, setSelectedAgent } = useGoals({
    service: goalService,
    teamLeadId: "lead_001",
  })

  const [modalOpen, setModalOpen] = React.useState(false)
  const [activeAgent, setActiveAgent] = React.useState<Agent | null>(null)

  const handleEditGoals = (agent: Agent) => {
    setActiveAgent(agent)
    setSelectedAgent(agent)
    setModalOpen(true)
  }

  return (
    <CollapsibleSection title="Goals" actionLabel="Set goals for all" defaultOpen={true}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className="group p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-primary text-sm">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{agent.name}</div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Agent</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleEditGoals(agent)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Target className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-[11px] font-semibold text-gray-500">25 Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-sky-500" />
                  <span className="text-[11px] font-semibold text-gray-500">80 Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-3 w-3 text-amber-500" />
                  <span className="text-[11px] font-semibold text-gray-500">40 Conv.</span>
                </div>
                <div className="flex items-center gap-2">
                   <Calendar className="h-3 w-3 text-rose-500" />
                   <span className="text-[11px] font-semibold text-gray-500">12 Appt.</span>
                </div>
              </div>

              <button 
                onClick={() => handleEditGoals(agent)}
                className="w-full mt-5 py-2 text-xs font-bold text-primary border border-primary/20 rounded-full bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300 transform group-hover:translate-y-0 opacity-0 group-hover:opacity-100 translate-y-2"
              >
                Update Goal
              </button>
            </div>
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
    </CollapsibleSection>
  )
}
