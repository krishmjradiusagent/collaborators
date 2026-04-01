import * as React from "react"
import { 
  Check, 
  X, 
  Users,
  Info,
  Home,
  CalendarCheck,
  Star,
  Flame,
  PencilLine,
  TimerOff,
  MoreHorizontal
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
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
  paused?: boolean
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

const DopamineNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [showPlusOne, setShowPlusOne] = React.useState(false);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    if (value > prevValue.current) {
      setShowPlusOne(true);
      setTimeout(() => setShowPlusOne(false), 1000);
    }
    setDisplayValue(value);
    prevValue.current = value;
  }, [value]);

  return (
    <div className="relative flex items-center gap-1 font-mono font-bold text-sm text-slate-900">
      <motion.span
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {displayValue}
      </motion.span>

      <AnimatePresence>
        {showPlusOne && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className="absolute left-full ml-1 text-[10px] text-emerald-500 font-black"
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppointmentCell = ({ total }: { total: number }) => {
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <button className="border-b border-dotted border-slate-300 hover:border-slate-900 transition-colors">
          <DopamineNumber value={total} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-64 p-4 shadow-xl border-slate-200 bg-white border normal-case tracking-normal z-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Breakdown</h4>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">TOTAL: {total}</span>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2 text-slate-600">
                <Home className="h-3.5 w-3.5 text-blue-500" />
                <span>Showings</span>
              </div>
              <span className="font-mono text-slate-900">{Math.floor(total * 0.5)}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-3.5 w-3.5 text-purple-500" />
                <span>Meetings</span>
              </div>
              <span className="font-mono text-slate-900">{Math.ceil(total * 0.3)}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Open Houses</span>
              </div>
              <span className="font-mono text-slate-900">{Math.ceil(total * 0.2)}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

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

  const handlePauseTracking = (agent: AgentGoal) => {
    const willPause = !agent.paused
    setData(prev => prev.map(item =>
      item.agentId === agent.agentId
        ? { ...item, paused: willPause }
        : item
    ))
    if (willPause) {
      toast("Tracking paused", {
        description: `${agent.name}'s progress will not be recorded until tracking is resumed.`,
        icon: "⏸️",
        action: {
          label: "Undo",
          onClick: () => {
            setData(prev => prev.map(item =>
              item.agentId === agent.agentId
                ? { ...item, paused: false }
                : item
            ))
            toast.success(`Tracking resumed for ${agent.name}`)
          },
        },
      })
    } else {
      toast.success(`Tracking resumed for ${agent.name}`, {
        description: "Goals and actuals will now update in real-time.",
      })
    }
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
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Appointments</span>
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <Info className="h-3 w-3 cursor-help text-slate-300 hover:text-slate-500 transition-colors" />
                    </HoverCardTrigger>
                    <HoverCardContent side="top" className="text-xs p-3 w-60 font-normal normal-case tracking-normal shadow-lg border-slate-200">
                      <p className="font-bold mb-1 text-slate-900">Activity Definitions</p>
                      <ul className="space-y-1 text-slate-500">
                        <li>• <strong>Property Showings:</strong> Scheduled tours</li>
                        <li>• <strong>Client Meetings:</strong> Strategy sessions</li>
                        <li>• <strong>Open Houses:</strong> Public events held</li>
                      </ul>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
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
                              <HoverCardContent className="w-56 p-3 normal-case tracking-normal shadow-xl border-slate-200 bg-white z-50" side="right" sideOffset={10}>
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
                      <div className={cn(
                        "flex items-center gap-3 group/cell px-2 py-1 rounded-md transition-all",
                        field === "appointments" && hasGoals ? "hover:bg-slate-50/50 hover:shadow-sm border border-transparent hover:border-slate-200/60" : ""
                      )}>
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
                          <AppointmentCell 
                            total={agent.goals?.appointments || 0} 
                          />
                        ) : (
                          <div className={cn(
                            "text-[14px]",
                            hasGoals ? "font-semibold text-slate-900" : "font-medium text-gray-300"
                          )}>
                            {hasGoals ? (
                              <DopamineNumber value={agent.goals?.[field as keyof typeof agent.goals] || 0} />
                            ) : "—"}
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
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-white border border-slate-200 shadow-xl z-50">
                          <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold p-3">Manage Agent</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="gap-2 focus:bg-slate-50 cursor-pointer p-3" onClick={() => handleEdit(agent)}>
                            <PencilLine className="h-4 w-4 text-blue-500" /> Edit Goals
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 focus:bg-slate-50 cursor-pointer p-3" onClick={() => handlePauseTracking(agent)}>
                            <TimerOff className="h-4 w-4 text-amber-500" /> {agent.paused ? "Resume Tracking" : "Pause Tracking"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
