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
      className={cn("relative flex items-center group/stack", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "flex items-center transition-all duration-500",
          (collaborators || []).length > 0 ? "-space-x-4 group-hover/stack:-space-x-2" : ""
        )}
      >
        {displayCollaborators.map((collab, index) => (
          <motion.div
            key={collab.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
            style={{ zIndex: 10 - index }}
          >
            <Avatar className="size-9 ring-2 ring-white shadow-md border-none transition-transform duration-300 group-hover/stack:scale-105">
              <AvatarImage src={collab.avatar} />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">
                {collab?.name?.substring(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        ))}
        
        {/* Total Count Circle */}
        {(collaborators || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
            style={{ zIndex: 0 }}
            onClick={(e) => {
               e.stopPropagation()
               onManage?.()
            }}
          >
            <div className="size-9 rounded-full bg-white ring-2 ring-white shadow-[0px_4px_12px_rgba(90,95,242,0.15)] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all active:scale-95 group/total border-2 border-[#5A5FF2]/10 ml-1">
              <span className="text-[13px] font-black text-[#5A5FF2]">
                {(collaborators || []).length}
              </span>
            </div>
          </motion.div>
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

      <AnimatePresence>
        {isHovered && onManage && (collaborators || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -5, scale: 0.8 }}
            animate={{ opacity: 1, x: 8, scale: 1 }}
            exit={{ opacity: 0, x: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="z-20"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="size-9 rounded-full border border-[#D9E3F5] bg-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#F0F5FF] text-[#64748B] hover:text-[#5A5FF2] transition-all active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation()
                    onManage()
                  }}
                >
                  <Sliders className="size-4 stroke-[1.5px]" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#171717] text-white border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg mb-2">
                Manage
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
