import * as React from "react"
import { useRole, UserRole } from "../contexts/RoleContext"
import { cn } from "../lib/utils"
import { 
  User, 
  ShieldCheck, 
  Workflow, 
  Briefcase, 
  Handshake, 
  ChevronRight,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingRoleToggler() {
  const { currentRole, setCurrentRole } = useRole()
  const [isOpen, setIsOpen] = React.useState(false)

  const roles: { id: UserRole; icon: any; label: string; color: string }[] = [
    { id: 'TEAM_LEAD', icon: ShieldCheck, label: 'Team Lead', color: '#5A5FF2' },
    { id: 'AGENT', icon: User, label: 'Agent', color: '#0F172A' },
    { id: 'TC_VA', icon: Workflow, label: 'TC / VA', color: '#10B981' },
    { id: 'LENDER', icon: Briefcase, label: 'Lender', color: '#F59E0B' },
    { id: 'VENDOR', icon: Handshake, label: 'Vendor', color: '#EF4444' }
  ]

  const activeRole = roles.find(r => r.id === currentRole) || roles[0]

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex flex-col gap-2 p-3 bg-white rounded-3xl shadow-[0px_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 min-w-[200px]"
          >
            <div className="px-3 py-2 mb-1 border-b border-slate-50 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Global Role</span>
              <Sparkles className="size-3 text-slate-300" />
            </div>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setCurrentRole(role.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all group",
                  currentRole === role.id ? "bg-[#5A5FF2]/5" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "size-8 rounded-xl flex items-center justify-center transition-colors",
                     currentRole === role.id ? "bg-[#5A5FF2] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                   )}>
                     <role.icon className="h-4 w-4" />
                   </div>
                   <span className={cn(
                     "text-[14px] font-bold transition-colors",
                     currentRole === role.id ? "text-slate-900" : "text-slate-500"
                   )}>{role.label}</span>
                </div>
                {currentRole === role.id && (
                  <div className="size-2 rounded-full bg-[#5A5FF2]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 px-6 rounded-full flex items-center gap-3 shadow-[0px_15px_30px_rgba(90,95,242,0.3)] transition-all active:scale-95 group relative overflow-hidden",
          isOpen ? "bg-slate-900 text-white" : "bg-[#5A5FF2] text-white"
        )}
      >
        <div className="flex items-center gap-3 relative z-10">
           <div className={cn(
             "size-9 rounded-2xl flex items-center justify-center transition-colors",
             isOpen ? "bg-white/10" : "bg-white/20"
           )}>
             <activeRole.icon className="h-5 w-5" />
           </div>
           <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Identity Management</span>
              <span className="text-[16px] font-black">{activeRole.label}</span>
           </div>
           <ChevronRight className={cn("size-5 transition-transform duration-300 ml-1", isOpen ? "rotate-90" : "-rotate-90")} />
        </div>
        
        {/* Animated Background Polish */}
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </button>
    </div>
  )
}
