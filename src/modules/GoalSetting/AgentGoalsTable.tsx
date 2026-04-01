import * as React from "react"
import { 
  Pencil, 
  Check, 
  X, 
  Users,
  Info,
  Home,
  CalendarCheck,
  Star,
  Flame
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/Table"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/HoverCard"
import { Separator } from "../../components/ui/Separator"
import { toast } from "sonner"
import { BulkGoalSettingModal } from "./BulkGoalSettingModal"
import { cn } from "../../lib/utils"

export type AgentGoal = {
  agentId: string
  name: string
  avatarUrl: string
  role: "agent" | "team_lead"
  goals: {
    newLeads: number | null
    calls: number | null
    uniqueConvos: number | null
    appointments: number | null
  } | null
  actuals?: {
    newLeads: number
    calls: number
    uniqueConvos: number
    appointments: number
  }
  streak?: number
  month: string
}

interface AgentGoalsTableProps {
  role?: "teamLeadView" | "adminView"
}

const MOCK_AGENTS: AgentGoal[] = [
  {
    agentId: "1",
    name: "Sarah Chen",
    avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    role: "agent",
    goals: { newLeads: 25, calls: 80, uniqueConvos: 40, appointments: 12 },
    actuals: { newLeads: 18, calls: 72, uniqueConvos: 35, appointments: 10 },
    streak: 8,
    month: "2026-04"
  },
  {
    agentId: "2",
    name: "Marcus Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=marcus",
    role: "agent",
    goals: null,
    streak: 0,
    month: "2026-04"
  },
  {
    agentId: "3",
    name: "Jessica Rodriguez",
    avatarUrl: "https://i.pravatar.cc/150?u=jessica",
    role: "agent",
    goals: { newLeads: 30, calls: 100, uniqueConvos: 50, appointments: 15 },
    actuals: { newLeads: 32, calls: 95, uniqueConvos: 48, appointments: 14 },
    streak: 12,
    month: "2026-04"
  },
  {
    agentId: "4",
    name: "David Kim",
    avatarUrl: "https://i.pravatar.cc/150?u=david",
    role: "agent",
    goals: null,
    streak: 0,
    month: "2026-04"
  },
  {
    agentId: "5",
    name: "Amanda Foster",
    avatarUrl: "https://i.pravatar.cc/150?u=amanda",
    role: "agent",
    goals: { newLeads: 15, calls: 60, uniqueConvos: 25, appointments: 8 },
    actuals: { newLeads: 5, calls: 20, uniqueConvos: 10, appointments: 2 },
    streak: 4,
    month: "2026-04"
  },
  {
    agentId: "6",
    name: "Laura Nguyen",
    avatarUrl: "https://i.pravatar.cc/150?u=laura",
    role: "agent",
    goals: null,
    streak: 0,
    month: "2026-04"
  }
]

const ProgressRing = ({ value, goal, size = 24 }: { value: number, goal: number, size?: number }) => {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / goal) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;
  
  let color = "text-amber-500";
  if (percentage >= 100) color = "text-emerald-500";
  else if (percentage >= 50) color = "text-blue-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-100"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(color, "transition-all duration-700 ease-in-out")}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  )
}

export function AgentGoalsTable({ role = "teamLeadView" }: AgentGoalsTableProps) {
  const [data, setData] = React.useState<AgentGoal[]>(MOCK_AGENTS)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValues, setEditValues] = React.useState<NonNullable<AgentGoal['goals']>>({
    newLeads: 0,
    calls: 0,
    uniqueConvos: 0,
    appointments: 0
  })
  const [bulkModalOpen, setBulkModalOpen] = React.useState(false)

  const isAdmin = role === "adminView"

  // Sort: null goals first, then alphabetical by name
  const sortedData = [...data].sort((a, b) => {
    if (a.goals === null && b.goals !== null) return -1
    if (a.goals !== null && b.goals === null) return 1
    return a.name.localeCompare(b.name)
  })

  const handleEdit = (agent: AgentGoal) => {
    if (isAdmin) return
    setEditingId(agent.agentId)
    setEditValues(agent.goals || {
      newLeads: 0,
      calls: 0,
      uniqueConvos: 0,
      appointments: 0
    })
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleSave = (agentId: string) => {
    setData(prev => prev.map(item => 
      item.agentId === agentId 
        ? { ...item, goals: editValues } 
        : item
    ))
    setEditingId(null)
    toast.success("Agent goals updated successfully")
  }

  const handleInputChange = (field: keyof typeof editValues, value: string) => {
    const num = parseInt(value) || 0
    setEditValues(prev => ({ ...prev, [field]: Math.min(Math.max(num, 0), 999) }))
  }

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="pt-8 border-t border-[#EFEFEF] -mx-8 px-8 flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#111827]">Goals</h2>
          <p className="text-sm text-muted-foreground">Set monthly targets for your team</p>
        </div>

        {role === "teamLeadView" && (
          <Button 
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 h-10 px-6 gap-2 shadow-lg shadow-indigo-100 mt-1"
            onClick={() => setBulkModalOpen(true)}
          >
            <Users className="h-4 w-4" />
            Set goals for all
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="hover:bg-transparent border-b-[#F0F0F0]">
              <TableHead className="w-[280px] text-[12px] font-bold text-gray-400 uppercase tracking-widest">Agent</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">New Leads</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Calls</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Unique Convos</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <span>Appointments</span>
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[360px] p-4 normal-case tracking-normal shadow-xl border-slate-200" side="top" sideOffset={10}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-800 leading-none">Appointment Definitions</h4>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-mono font-bold text-slate-600">
                            DOCS
                          </span>
                        </div>
                        <Separator className="bg-slate-100" />
                        <div className="space-y-4 pt-1">
                          <div className="flex gap-4">
                            <div className="mt-0.5 bg-blue-50 rounded-lg p-2 shrink-0 h-9 w-9 flex items-center justify-center">
                              <Home className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[13px] font-bold text-slate-800">Property Showings</p>
                              <p className="text-[11px] text-slate-500 leading-relaxed">In-person tours of listings for prospective buyer clients.</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="mt-0.5 bg-purple-50 rounded-lg p-2 shrink-0 h-9 w-9 flex items-center justify-center">
                              <Users className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[13px] font-bold text-slate-800">Client Meetings</p>
                              <p className="text-[11px] text-slate-500 leading-relaxed">Strategic consultations, listing presentations, or signing sessions.</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="mt-0.5 bg-emerald-50 rounded-lg p-2 shrink-0 h-9 w-9 flex items-center justify-center">
                              <CalendarCheck className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[13px] font-bold text-slate-800">Open Houses</p>
                              <p className="text-[11px] text-slate-500 leading-relaxed">Scheduled public marketing events to drive high volume traffic.</p>
                            </div>
                          </div>
                        </div>
                        <Separator className="bg-slate-100" />
                        <p className="text-[10px] text-muted-foreground italic">
                          Includes both scheduled and completed events.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((agent) => {
              const isEditing = editingId === agent.agentId
              const hasGoals = agent.goals !== null

              return (
                <TableRow key={agent.agentId} className="group border-b-[#F6F6F6] last:border-0 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[14px] font-semibold text-gray-900 leading-none">{agent.name}</span>
                          {(agent.streak || 0) >= 3 && (
                            <HoverCard openDelay={100}>
                              <HoverCardTrigger asChild>
                                <div className="cursor-help">
                                  <Flame className={cn(
                                    "h-3.5 w-3.5",
                                    (agent.streak || 0) >= 7 
                                      ? "text-indigo-500 fill-indigo-500/20 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                                      : "text-orange-500 fill-orange-500/20"
                                  )} />
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-56 p-3 normal-case tracking-normal shadow-xl border-slate-200" side="right" sideOffset={10}>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className={cn(
                                      "p-1.5 rounded-md",
                                      (agent.streak || 0) >= 7 ? "bg-indigo-50" : "bg-orange-50"
                                    )}>
                                      <Flame className={cn(
                                        "h-4 w-4",
                                        (agent.streak || 0) >= 7 ? "text-indigo-600" : "text-orange-600"
                                      )} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-800">
                                      {(agent.streak || 0) >= 7 ? "Super Streak!" : "Momentum Streak"}
                                    </p>
                                  </div>
                                  <Separator className="bg-slate-100" />
                                  <p className="text-[11px] text-slate-500 leading-relaxed">
                                    {agent.name.split(' ')[0]} has hit their primary goal for <span className="font-bold text-slate-700">{agent.streak} consecutive days</span>.
                                  </p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                        <Badge variant="outline" className="w-fit h-4 text-[9px] uppercase tracking-tighter px-1.5 border-gray-200 text-gray-400 font-bold">
                          {agent.role === "team_lead" ? "Team Lead" : "Agent"}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  
                  {["newLeads", "calls", "uniqueConvos", "appointments"].map((field) => (
                    <TableCell key={field}>
                      <div className="flex items-center gap-3">
                        {hasGoals && agent.actuals && (
                          <ProgressRing 
                            value={agent.actuals[field as keyof typeof agent.actuals]} 
                            goal={agent.goals?.[field as keyof typeof agent.goals] || 1} 
                          />
                        )}
                        {isEditing ? (
                          <Input
                            type="number"
                            className="w-20 h-8 text-[13px] rounded-md"
                            value={editValues[field as keyof typeof editValues] || ""}
                            onChange={(e) => handleInputChange(field as keyof typeof editValues, e.target.value)}
                          />
                        ) : field === "appointments" && hasGoals ? (
                          <HoverCard openDelay={100}>
                            <HoverCardTrigger asChild>
                              <span className="cursor-help font-bold text-slate-900 border-b-2 border-dotted border-blue-400/40 hover:border-blue-600 transition-colors">
                                {agent.goals?.[field as keyof typeof agent.goals]}
                              </span>
                            </HoverCardTrigger>
                            <HoverCardContent side="right" align="start" className="w-[280px] p-4 normal-case tracking-normal shadow-xl border-slate-200">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-bold text-slate-800">Appointment Breakdown</h4>
                                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-mono font-bold text-slate-600 uppercase">
                                    Total: {agent.goals?.appointments}
                                  </span>
                                </div>
                                
                                <Separator className="bg-slate-100" />
                                
                                <div className="grid gap-3 pt-1">
                                  <div className="flex items-center justify-between text-[13px]">
                                    <div className="flex items-center gap-2 text-slate-600">
                                      <Home className="h-4 w-4 text-blue-500" />
                                      <span>Property Showings</span>
                                    </div>
                                    <span className="font-mono font-medium text-slate-900">{Math.floor((agent.goals?.appointments || 0) * 0.5)}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-[13px]">
                                    <div className="flex items-center gap-2 text-slate-600">
                                      <Users className="h-4 w-4 text-purple-500" />
                                      <span>Client Meetings</span>
                                    </div>
                                    <span className="font-mono font-medium text-slate-900">{Math.ceil((agent.goals?.appointments || 0) * 0.3)}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-[13px]">
                                    <div className="flex items-center gap-2 text-slate-600">
                                      <CalendarCheck className="h-4 w-4 text-emerald-500" />
                                      <span>Open Houses</span>
                                    </div>
                                    <span className="font-mono font-medium text-slate-900">{Math.ceil((agent.goals?.appointments || 0) * 0.2)}</span>
                                  </div>
                                </div>

                                <Separator className="bg-slate-100" />
                                
                                <p className="text-[10px] text-muted-foreground italic leading-tight">
                                  Includes both scheduled and completed events.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <div className={cn(
                            "text-[14px]",
                            hasGoals ? "font-semibold text-slate-900" : "font-medium text-gray-300"
                          )}>
                            {hasGoals ? agent.goals?.[field as keyof typeof agent.goals] : "—"}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  ))}

                  <TableCell>
                    {(() => {
                      if (!hasGoals || !agent.actuals) {
                        return (
                          <Badge variant="warning" className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight">
                            Not set
                          </Badge>
                        )
                      }
                      
                      const fields = ["newLeads", "calls", "uniqueConvos", "appointments"] as const;
                      const progressValues = fields.map(f => (agent.actuals![f] / agent.goals![f]!) * 100);
                      const avgProgress = progressValues.reduce((a, b) => a + b, 0) / fields.length;
                      
                      if (avgProgress >= 105) {
                        return (
                          <Badge variant="success" className="h-5 px-5 text-[10px] font-bold uppercase tracking-tight gap-1.5 relative">
                            <Star className="h-3 w-3 fill-emerald-600 text-emerald-600 absolute left-1.5 top-1/2 -translate-y-1/2" />
                            Exceeded
                          </Badge>
                        )
                      }
                      
                      if (avgProgress >= 80) {
                        return (
                          <Badge variant="ontrack" className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight">
                            On Track
                          </Badge>
                        )
                      }
                      
                      return (
                        <Badge variant="behind" className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight">
                          Behind Goal
                        </Badge>
                      )
                    })()}
                  </TableCell>

                  <TableCell className="text-right">
                    {!isAdmin && (
                      <div className="flex items-center justify-end">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => handleSave(agent.agentId)}
                               className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                             >
                               <Check className="h-4 w-4" />
                             </button>
                             <button 
                               onClick={handleCancel}
                               className="p-1 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                             >
                               <X className="h-4 w-4" />
                             </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleEdit(agent)}
                            className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <BulkGoalSettingModal 
        open={bulkModalOpen}
        onOpenChange={setBulkModalOpen}
      />
    </div>
  )
}
