import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"
import { Plus, Sliders, ChevronRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

interface CollaboratorAvatarStackProps {
  collaborators: {
    id: string
    name: string
    avatar?: string
  }[]
  max?: number
  onManage?: () => void
  className?: string
}

export function CollaboratorAvatarStack({
  collaborators = [],
  max = 2,
  onManage,
  className
}: CollaboratorAvatarStackProps) {
  const displayCollaborators = (collaborators || []).slice(0, max)
  const remainingCount = Math.max(0, (collaborators || []).length - max)
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div 
      className={cn("relative flex items-center gap-2 group/stack", className)}
    >
      <div 
        className={cn(
          "flex items-center flex-nowrap",
          (collaborators || []).length > 0 ? "-space-x-3.5" : ""
        )}
      >
        {displayCollaborators.map((collab, index) => (
          <div
            key={collab.id}
            className="relative"
            style={{ zIndex: 10 - index }}
          >
            <Avatar className="size-9 ring-2 ring-white shadow-sm border-none">
              <AvatarImage src={collab.avatar} />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">
                {collab?.name?.substring(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
        
        {/* Total Count Circle */}
        {(collaborators || []).length > 0 && (
          <div
            className="relative"
            style={{ zIndex: 0 }}
            onClick={(e) => {
               e.stopPropagation()
               onManage?.()
            }}
          >
            <div className="size-9 rounded-full bg-white ring-2 ring-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all active:scale-95 group/total border-2 border-[#5A5FF2]/10 ml-1">
              <span className="text-[13px] font-black text-[#5A5FF2]">
                {(collaborators || []).length}
              </span>
            </div>
          </div>
        )}

        {(collaborators || []).length === 0 && (
           <div 
             className="size-9 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-[#5A5FF2] hover:border-[#5A5FF2]/50 hover:bg-[#5A5FF2]/5 transition-all cursor-pointer bg-white"
             onClick={(e) => {
               e.stopPropagation()
               onManage?.()
             }}
           >
             <Plus className="size-4" />
           </div>
        )}
      </div>

      {onManage && (collaborators || []).length > 0 && (
        <div className="shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="size-9 rounded-full border border-[#D9E3F5] bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#F0F5FF] text-[#64748B] hover:text-[#5A5FF2] transition-all active:scale-90"
                onClick={(e) => {
                  e.stopPropagation()
                  onManage()
                }}
              >
                <Sliders className="size-4 stroke-[1.5px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#171717] text-white border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg mb-2 z-[9999]">
              Manage
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
