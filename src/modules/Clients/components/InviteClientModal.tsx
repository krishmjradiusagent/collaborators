import * as React from "react"
import { 
  X, 
  User, 
  Users, 
  CheckCircle2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select"
import { Separator } from "@/components/ui/Separator"
import { toast } from "sonner"

interface InviteClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteClientModal({
  open,
  onOpenChange
}: InviteClientModalProps) {
  const [behalfOf, setBehalfOf] = React.useState<'myself' | 'agents'>('agents')
  const [selectedAgentId, setSelectedAgentId] = React.useState<string>("")

  const MOCK_AGENTS = [
    { id: "a1", name: "Jessica Taylor", role: "Team Lead", email: "jessica@radius.com" },
    { id: "a2", name: "David Miller", role: "Senior Agent", email: "david@radius.com" },
    { id: "a3", name: "Sarah Williams", role: "Buyer Agent", email: "sarah@radius.com" },
  ]
  
  const handleInvite = () => {
    toast.success("Client Added", {
      description: "Client has been successfully added to your list.",
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
      className: "bg-white border-2 border-emerald-50 rounded-2xl shadow-xl",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-[40px] border-none shadow-[0px_20px_60px_rgba(0,0,0,0.1)] p-0 z-[9999] flex flex-col overflow-hidden" overlayClassName="z-[9999]">
        <div className="p-10 pb-0 shrink-0 relative">
          <button 
             onClick={() => onOpenChange(false)}
             className="absolute top-6 right-8 size-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 z-10"
          >
            <X className="size-5" />
          </button>
          
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black tracking-tight text-[#171717] leading-tight text-center">
               Select Agent
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-center">
              On whose behalf is this client being created?
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 px-10 pb-10">
          <div className="space-y-8">
            {/* Behalf of Selection */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block text-center">INVITING ON BEHALF OF</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setBehalfOf('myself')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-[32px] border-2 transition-all duration-300",
                    behalfOf === 'myself' 
                      ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-lg shadow-[#5A5FF2]/5" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center transition-colors",
                    behalfOf === 'myself' ? "bg-[#5A5FF2] text-white" : "bg-slate-50 text-slate-300"
                  )}>
                    <User className="size-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[15px]">Myself</p>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Personal</p>
                  </div>
                </button>

                <button 
                  onClick={() => setBehalfOf('agents')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-[32px] border-2 transition-all duration-300",
                    behalfOf === 'agents' 
                      ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-lg shadow-[#5A5FF2]/5" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center transition-colors",
                    behalfOf === 'agents' ? "bg-[#5A5FF2] text-white" : "bg-slate-50 text-slate-300"
                  )}>
                    <Users className="size-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[15px]">Agents</p>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Team</p>
                  </div>
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {behalfOf === 'agents' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0, y: 10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-[#5A5FF2] uppercase tracking-widest flex items-center gap-2 px-1">
                        Select Agent
                        <div className="h-px flex-1 bg-[#5A5FF2]/10" />
                      </label>
                      <Select onValueChange={setSelectedAgentId} value={selectedAgentId}>
                        <SelectTrigger className="h-16 bg-[#F8FAFC] border-2 border-transparent focus:border-[#5A5FF2]/20 rounded-[20px] px-6 font-black text-[16px] transition-all">
                          <SelectValue placeholder="Choose an agent" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-2xl p-2 z-[10000]">
                          {MOCK_AGENTS.map(agent => (
                            <SelectItem 
                              key={agent.id} 
                              value={agent.id}
                              className="p-3 rounded-xl focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] cursor-pointer"
                            >
                               <div className="flex flex-col gap-0.5">
                                 <span className="font-black text-[14px]">{agent.name}</span>
                                 <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{agent.role}</span>
                               </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Suggested Agents */}
                    <div className="px-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Suggested Agents</p>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_AGENTS.map((agent) => (
                          <button
                            key={`suggest-${agent.id}`}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 active:scale-95 px-5",
                              selectedAgentId === agent.id 
                                ? "bg-[#5A5FF2] border-[#5A5FF2] text-white shadow-xl shadow-[#5A5FF2]/30" 
                                : "bg-white border-slate-100 text-slate-600 hover:border-[#5A5FF2]/30 hover:bg-[#5A5FF2]/5"
                            )}
                          >
                            <span className="text-[13px] font-black">{agent.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Separator className="bg-slate-50" />

            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                className="flex-1 h-14 rounded-2xl text-slate-400 font-black hover:bg-slate-50 transition-colors uppercase tracking-widest text-[11px]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-2xl bg-[#5A5FF2] hover:bg-[#4B50D9] text-white font-black shadow-2xl shadow-[#5A5FF2]/30 active:scale-95 transition-all text-[15px] uppercase tracking-tight"
                onClick={handleInvite}
                disabled={behalfOf === 'agents' && !selectedAgentId}
              >
                Proceed to Add Client
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
