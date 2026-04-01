import * as React from "react"
import { 
  Pencil, 
  Check, 
  X, 
  Users,
  Info
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../../components/ui/Dialog"
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
    month: "2026-04"
  },
  {
    agentId: "2",
    name: "Marcus Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=marcus",
    role: "agent",
    goals: null,
    month: "2026-04"
  },
  {
    agentId: "3",
    name: "Jessica Rodriguez",
    avatarUrl: "https://i.pravatar.cc/150?u=jessica",
    role: "agent",
    goals: { newLeads: 30, calls: 100, uniqueConvos: 50, appointments: 15 },
    month: "2026-04"
  },
  {
    agentId: "4",
    name: "David Kim",
    avatarUrl: "https://i.pravatar.cc/150?u=david",
    role: "agent",
    goals: null,
    month: "2026-04"
  },
  {
    agentId: "5",
    name: "Amanda Foster",
    avatarUrl: "https://i.pravatar.cc/150?u=amanda",
    role: "agent",
    goals: { newLeads: 15, calls: 60, uniqueConvos: 25, appointments: 8 },
    month: "2026-04"
  },
  {
    agentId: "6",
    name: "Laura Nguyen",
    avatarUrl: "https://i.pravatar.cc/150?u=laura",
    role: "agent",
    goals: null,
    month: "2026-04"
  }
]

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
  const [breakdownAgent, setBreakdownAgent] = React.useState<AgentGoal | null>(null)

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
    <TooltipProvider>
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
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                    Appointments <Info className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Includes property showings, client meetings, and open houses (scheduled + completed)</p>
                  </TooltipContent>
                </Tooltip>
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
                        <span className="text-[14px] font-semibold text-gray-900 leading-none mb-1">{agent.name}</span>
                        <Badge variant="outline" className="w-fit h-4 text-[9px] uppercase tracking-tighter px-1.5 border-gray-200 text-gray-400 font-bold">
                          {agent.role === "team_lead" ? "Team Lead" : "Agent"}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Metric Columns */}
                  {["newLeads", "calls", "uniqueConvos", "appointments"].map((field) => (
                    <TableCell key={field}>
                      {isEditing ? (
                        <Input
                          type="number"
                          className="w-20 h-8 text-[13px] rounded-md"
                          value={editValues[field as keyof typeof editValues] || ""}
                          onChange={(e) => handleInputChange(field as keyof typeof editValues, e.target.value)}
                        />
                      ) : (
                        <div 
                          className={cn(
                            "text-[14px] font-medium",
                            hasGoals ? "text-gray-700" : "text-gray-300",
                            field === "appointments" && hasGoals && "cursor-pointer hover:text-blue-600 hover:underline decoration-blue-600/30"
                          )}
                          onClick={() => field === "appointments" && hasGoals && setBreakdownAgent(agent)}
                        >
                          {hasGoals ? agent.goals?.[field as keyof typeof agent.goals] : "—"}
                        </div>
                      )}
                    </TableCell>
                  ))}

                  <TableCell>
                    <Badge variant={hasGoals ? "success" : "warning"} className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight">
                      {hasGoals ? "Goals set" : "Not set"}
                    </Badge>
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

      <Dialog open={!!breakdownAgent} onOpenChange={() => setBreakdownAgent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={breakdownAgent?.avatarUrl} />
                <AvatarFallback>{breakdownAgent?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {breakdownAgent?.name}'s Appointments
            </DialogTitle>
            <DialogDescription>
              Breakdown of appointment goals for {breakdownAgent?.month}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#F9FAFB] p-4 rounded-[16px] border border-[#F0F0F0]">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Scheduled</p>
                  <p className="text-3xl font-semibold text-[#060D4D]">{breakdownAgent?.goals?.appointments || 0}</p>
               </div>
               <div className="bg-[#F0FDF4] p-4 rounded-[16px] border border-[#DCFCE7]">
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Completed</p>
                  <p className="text-3xl font-semibold text-emerald-700">{Math.floor((breakdownAgent?.goals?.appointments || 0) * 0.8)}</p>
               </div>
            </div>
            
            <div className="space-y-1">
               {[
                 { label: "Property Showings", value: Math.floor((breakdownAgent?.goals?.appointments || 0) * 0.5) },
                 { label: "Client Meetings", value: Math.ceil((breakdownAgent?.goals?.appointments || 0) * 0.3) },
                 { label: "Open Houses", value: Math.ceil((breakdownAgent?.goals?.appointments || 0) * 0.2) }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0 px-1">
                    <span className="text-[15px] font-medium text-gray-600">{item.label}</span>
                    <span className="text-[15px] font-bold text-gray-900">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
               className="rounded-xl bg-black text-white hover:bg-gray-800 px-6 h-11 text-[15px] font-medium transition-all"
               onClick={() => setBreakdownAgent(null)}
            >
               Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  )
}
