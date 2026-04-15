import * as React from "react"
import { 
  Check, 
  Search, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  Shield,
  SearchCode
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { RADIUS_APPROVED_POOL } from "../mockData"
import { Collaborator } from "../types"
import { TypeBadge } from "./badges/TypeBadge"

interface AddRadiusApprovedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (collaborator: Collaborator) => void
  existingCollaboratorIds: string[]
}

export function AddRadiusApprovedModal({
  open,
  onOpenChange,
  onAdd,
  existingCollaboratorIds
}: AddRadiusApprovedModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const filteredPool = RADIUS_APPROVED_POOL.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white rounded-[32px] border-none shadow-[0px_30px_90px_rgba(0,0,0,0.25)] p-0 overflow-hidden z-[9999] animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <ShieldCheck className="size-6 text-amber-600" />
              </div>
              <DialogTitle className="text-2xl font-black text-[#171717] tracking-tighter">
                Radius Approved Network
              </DialogTitle>
            </div>
            <p className="text-[#737373] text-[15px] font-medium">
              Select verified, high-performance collaborators endorsed by Radius.
            </p>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input 
                placeholder="Search approved TCs, Lenders, or VAs..."
                className="h-14 pl-12 bg-[#F8FAFC] border-none rounded-[16px] font-medium text-[15px] focus-visible:ring-4 focus-visible:ring-amber-500/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
              {filteredPool.length > 0 ? (
                filteredPool.map((collab) => {
                  const isAdded = existingCollaboratorIds.includes(collab.id)
                  
                  return (
                    <div 
                      key={collab.id}
                      className={cn(
                        "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                        isAdded 
                          ? "bg-slate-50 border-slate-100 opacity-60" 
                          : "bg-white border-slate-100 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer active:scale-[0.98]"
                      )}
                      onClick={() => !isAdded && onAdd(collab)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="size-12 ring-2 ring-white shadow-sm">
                            <AvatarFallback className="bg-amber-50 text-amber-600 font-black text-[14px]">
                              {collab.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                            <Shield className="size-2.5 text-white" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-[#171717] text-[15px]">{collab.name}</span>
                             <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-100/50">
                               <Star className="size-2.5 text-amber-500 fill-amber-500" />
                               <span className="text-[10px] font-black text-amber-700">RADIUS ENDORSED</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[12px] text-slate-500 font-medium">{collab.email}</span>
                            <div className="size-1 rounded-full bg-slate-300" />
                            <TypeBadge type={collab.type as any} className="h-4 px-1.5 text-[9px]" />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isAdded ? (
                          <div className="flex items-center gap-2 text-slate-400 font-bold text-[12px] px-3 py-1.5 rounded-full bg-slate-100 uppercase tracking-widest">
                            <Check className="size-3.5" /> Added
                          </div>
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                             <Button size="sm" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-8 px-4 text-[12px] uppercase tracking-wider gap-2">
                               Add <ChevronRight className="size-3" />
                             </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <SearchCode className="size-8 text-slate-200" />
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-400 uppercase tracking-widest">No Matches Found</h3>
                  <p className="text-[14px] text-slate-500 max-w-xs mx-auto">Try refining your search terms for the approved network.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50">
            <Button 
              variant="ghost" 
              className="w-full h-14 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              Close Network View
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
