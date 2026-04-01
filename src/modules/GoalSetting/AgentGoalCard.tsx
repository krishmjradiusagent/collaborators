import { Target, TrendingUp, Phone, MessageCircle, Calendar } from "lucide-react"
import { Card } from "../../components/ui/Card"
import type { Agent } from "@mel-goals/shared"

interface AgentGoalCardProps {
  agent: Agent
  index: number
  onClick: () => void
}

const AGENT_ACCENT_COLORS = [
  "#5A5FF2", // Mel indigo
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // coral red
  "#8B5CF6", // violet
]

export function AgentGoalCard({ agent, index, onClick }: AgentGoalCardProps) {
  const accentColor = AGENT_ACCENT_COLORS[index % AGENT_ACCENT_COLORS.length]
  const initials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase()

  // Simplified progress calculation for visual "life"
  const totalGoals = 25 + 80 + 40 + 12 // Using constant base as per current mock data
  const progressPercent = Math.min(Math.round((totalGoals / 200) * 100), 100)

  const metrics = [
    { label: "Leads", value: "25", icon: TrendingUp },
    { label: "Calls", value: "80", icon: Phone },
    { label: "Conv.", value: "40", icon: MessageCircle },
    { label: "Appt.", value: "12", icon: Calendar },
  ]

  return (
    <Card 
      className="relative overflow-hidden group hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-300 transform hover:-translate-y-0.5 border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]"
      onClick={onClick}
    >
      {/* 1. Left accent stripe */}
      <div 
        className="absolute left-0 top-0 h-full w-[3px]" 
        style={{ backgroundColor: accentColor }} 
      />
      
      <div className="p-4 pl-5 flex flex-col h-full min-h-[160px]">
        {/* 2. Card header row */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div 
              className="h-9 w-9 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-gray-900 leading-tight">{agent.name}</span>
                <span className="text-[10px] uppercase font-medium text-gray-400 tracking-wide px-1">Active Agent</span>
              </div>
            </div>
          </div>
          <button 
            aria-label={`Set goals for ${agent.name}`}
            className="p-2 -mr-2 transition-transform hover:scale-110 shrink-0"
            style={{ color: accentColor }}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            <Target className="h-5 w-5" />
          </button>
        </div>

        {/* 3. Metric grid (2x2) */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {metrics.map((m) => (
            <div 
              key={m.label} 
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors"
              style={{ backgroundColor: `${accentColor}1A` }} // 10% opacity
            >
              <m.icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
              <div className="flex items-baseline gap-1">
                <span className="text-[13px] font-bold text-gray-800">{m.value}</span>
                <span className="text-[11px] font-medium text-gray-500">{m.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Progress section */}
        <div className="mt-auto">
          <div 
            className="h-1 w-full bg-gray-100 rounded-full overflow-hidden"
            aria-label={`Goals progress for ${agent.name}`}
          >
            <div 
              className="h-full transition-all duration-1000 ease-out" 
              style={{ 
                width: `${progressPercent}%`, 
                backgroundColor: accentColor 
              }} 
            />
          </div>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[11px] font-medium text-gray-400">Goals set for April</span>
            <span 
              className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
              style={{ color: accentColor }}
            >
              View details →
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
