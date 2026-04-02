import * as React from "react"
import { useRole, UserRole } from "../contexts/RoleContext"
import { Shield, ChevronUp, Check, User, Share2, Briefcase, Truck } from "lucide-react"
import { cn } from "../lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/Button"

export function RoleSwitcher() {
  const { role, setRole } = useRole()
  const [open, setOpen] = React.useState(false)

  const ROLES: { id: UserRole; icon: any; description: string; color: string }[] = [
    { id: 'Team Lead', icon: Shield, description: "Full administrative access", color: "#5A5FF2" },
    { id: 'Agent', icon: User, description: "Standard agent permissions", color: "#F59E0B" },
    { id: 'TC/VA', icon: Share2, description: "Transaction coordinator focus", color: "#10B981" },
    { id: 'Lender', icon: Briefcase, description: "Finance collaborator view", color: "#8B5CF6" },
    { id: 'Vendor', icon: Truck, description: "External service provider", color: "#EC4899" },
  ]

  const activeRole = ROLES.find(r => r.id === role) || ROLES[0]

  return (
    <div className="fixed bottom-8 right-8 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="w-[200px] h-16 rounded-[24px] bg-white/70 backdrop-blur-xl hover:bg-white/90 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 flex items-center justify-between px-6 group transition-all active:scale-95 ring-1 ring-black/[0.03]"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <activeRole.icon className="size-5 text-[#5A5FF2]" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeRole.color }} />
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: activeRole.color }} />
                </span>
              </div>
              <div className="flex flex-col items-start gap-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Identity</span>
                <span className="font-black text-[14px] leading-none tracking-tight">{role}</span>
              </div>
            </div>
            <ChevronUp className={cn("size-4 text-slate-300 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]", open && "rotate-180")} />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[340px] p-2 bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0px_32px_100px_rgba(0,0,0,0.25)] border-white/40 mb-3 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ring-1 ring-black/[0.05]" 
          align="end"
          side="top"
        >
          <div className="p-5 pb-2">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Switch Perspectives</h3>
                <div className="px-2 py-0.5 rounded-md bg-[#5A5FF2]/10 text-[#5A5FF2] text-[9px] font-black tracking-widest border border-[#5A5FF2]/10">DEV MODE</div>
             </div>
          </div>
          <div className="space-y-1.5 p-2 pt-0">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-[20px] transition-all text-left group overflow-hidden relative active:scale-[0.98] duration-300",
                  role === r.id ? "bg-[#5A5FF2] text-white shadow-xl shadow-[#5A5FF2]/20" : "hover:bg-black/5"
                )}
              >
                <div className={cn(
                  "size-11 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 group-hover:scale-110 group-hover:rotate-6",
                  role === r.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-md"
                )}>
                  <r.icon className="size-5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className={cn(
                    "text-[15px] font-black leading-none mb-1.5 tracking-tight",
                    role === r.id ? "text-white" : "text-[#171717]"
                  )}>{r.id}</span>
                  <span className={cn(
                    "text-[12px] font-bold opacity-70",
                    role === r.id ? "text-white" : "text-slate-400"
                  )}>{r.description}</span>
                </div>
                {role === r.id && (
                  <Check className="size-5 text-white shrink-0 animate-in zoom-in-50 duration-300" strokeWidth={4} />
                )}
              </button>
            ))}
          </div>
          <div className="mt-2 p-5 bg-black/5 rounded-[24px] text-center border-t border-black/[0.02]">
             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
               Verify isolation logic specifically for <span className="text-slate-600 font-black">Multi-Tenant Visibility</span>
             </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
