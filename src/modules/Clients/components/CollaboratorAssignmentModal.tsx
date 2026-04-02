import * as React from "react"
import { 
  Search, 
  Plus, 
  Check, 
  UserPlus, 
  Briefcase, 
  Users, 
  ShieldCheck,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../../components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/Dialog"
import { Input } from "../../../components/ui/Input"
import { Badge } from "../../../components/ui/Badge"
import { GLOBAL_COLLABORATOR_POOL } from "../mockData"
import { Collaborator, CollaboratorRole } from "../types"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/Label"

interface CollaboratorAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (collaborator: Collaborator, level: 'client' | 'transaction') => void
  existingCollabs: Collaborator[]
}

const ROLE_ICONS: Record<CollaboratorRole, any> = {
  'Title Coordinator': ShieldCheck,
  'VA': UserPlus,
  'Lender': Users,
  'Vendor': Briefcase
}

const ROLE_COLORS: Record<CollaboratorRole, string> = {
  'Title Coordinator': 'text-[#5A5FF2] bg-[#5A5FF2]/10',
  'VA': 'text-amber-600 bg-amber-50',
  'Lender': 'text-emerald-600 bg-emerald-50',
  'Vendor': 'text-purple-600 bg-purple-50'
}

export function CollaboratorAssignmentModal({ 
  open, 
  onOpenChange, 
  onAssign,
  existingCollabs 
}: CollaboratorAssignmentModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCollab, setSelectedCollab] = React.useState<Collaborator | null>(null)
  const [assignmentLevel, setAssignmentLevel] = React.useState<'client' | 'transaction'>('client')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const filteredPool = GLOBAL_COLLABORATOR_POOL.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirm = async () => {
    if (!selectedCollab) return
    
    setIsSubmitting(true)
    // Simulate API call and notifications
    await new Promise(resolve => setTimeout(resolve, 800))
    
    onAssign(selectedCollab, assignmentLevel)
    
    toast.success("Collaborator assigned successfully", {
      description: `${selectedCollab.name} has been added to this client.`,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    })
    
    setIsSubmitting(false)
    onOpenChange(false)
    reset()
  }

  const reset = () => {
    setSearchQuery("")
    setSelectedCollab(null)
    setAssignmentLevel('client')
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) reset(); }}>
      <DialogContent className="sm:max-w-[540px] bg-white p-0 overflow-hidden shadow-3xl rounded-[32px] border-none outline-none">
        <div className="p-10">
          <DialogHeader className="mb-10 p-0 text-left">
            <div className="size-16 rounded-[22px] bg-[#EEF2FF] flex items-center justify-center text-[#5A5FF2] mb-6 shadow-sm border border-[#5A5FF2]/5 ring-8 ring-[#EEF2FF]/40">
               <UserPlus className="h-8 w-8 stroke-[2.5px]" />
            </div>
            <DialogTitle className="text-[32px] font-black text-[#373758] tracking-tight leading-none">Add Collaborator</DialogTitle>
            <DialogDescription className="text-slate-400 font-bold text-[16px] mt-3 leading-relaxed">
               Search your network pool to assign a partner or coordinator to this client relationship.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-10">
            {/* Search Input */}
            <div className="space-y-4">
               <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Search Global Pool</Label>
               <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110 group-focus-within:rotate-12">
                    <Search className={cn("h-5 w-5 transition-colors", searchQuery ? "text-[#5A5FF2]" : "text-slate-300")} />
                  </div>
                  <Input 
                    placeholder="Search by name, email, or role..." 
                    className="h-[60px] pl-14 bg-slate-50 border-2 border-slate-50 focus-visible:ring-4 focus-visible:ring-[#5A5FF2]/10 focus-visible:bg-white focus-visible:border-[#5A5FF2]/10 transition-all text-[16px] font-bold rounded-[22px] placeholder:text-slate-300 shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Available results ({filteredPool.length})</Label>
                  <button className="text-[12px] font-black text-[#5A5FF2] hover:underline underline-offset-4 flex items-center gap-1.5 transition-all hover:gap-2 active:scale-95 group">
                     <Plus className="h-4 w-4 stroke-[3px]" /> 
                     <span className="group-hover:tracking-wider transition-all">ADD NEW PARTNER</span>
                  </button>
               </div>
               
               <div className="max-h-[260px] overflow-y-auto space-y-3 pr-2 custom-scrollbar -mr-2">
                  {filteredPool.length > 0 ? (
                    filteredPool.map((collab) => {
                      const isSelected = selectedCollab?.id === collab.id
                      const isAlreadyAssigned = existingCollabs.some(c => c.id === collab.id)
                      const RoleIcon = ROLE_ICONS[collab.role] || Briefcase
                      
                      return (
                        <div 
                          key={collab.id}
                          onClick={() => !isAlreadyAssigned && setSelectedCollab(collab)}
                          className={cn(
                            "flex items-center justify-between p-5 rounded-[24px] border-2 transition-all cursor-pointer group/item relative",
                            isSelected 
                              ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-lg shadow-[#5A5FF2]/5" 
                              : "border-transparent bg-slate-50/50 hover:bg-slate-50 hover:border-slate-100",
                            isAlreadyAssigned && "opacity-40 cursor-not-allowed grayscale-[0.8]"
                          )}
                        >
                           <div className="flex items-center gap-5">
                              <div className={cn("size-12 rounded-[18px] flex items-center justify-center shrink-0 transition-all duration-500 group-hover/item:scale-110 group-hover/item:-rotate-6 shadow-sm", ROLE_COLORS[collab.role] || "bg-slate-100 text-slate-400")}>
                                 <RoleIcon className="h-6 w-6 stroke-[2.5px]" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                 <div className="flex items-center gap-2">
                                    <span className="font-black text-[#373758] text-[16px] tracking-tight">{collab.name}</span>
                                    {isAlreadyAssigned && <Badge className="h-5 bg-slate-100 text-slate-400 text-[9px] border-none font-black tracking-widest px-2">ASSIGNED</Badge>}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-slate-400 font-bold">{collab.email}</span>
                                    <div className="size-1 rounded-full bg-slate-200" />
                                    <span className={cn("text-[11px] font-black uppercase tracking-tighter", ROLE_COLORS[collab.role]?.split(' ')[0] || "text-slate-400")}>{collab.role}</span>
                                 </div>
                              </div>
                           </div>
                           <div className={cn(
                             "size-6 rounded-full border-2 transition-all flex items-center justify-center",
                             isSelected ? "bg-[#5A5FF2] border-[#5A5FF2] scale-110 shadow-lg shadow-[#5A5FF2]/40" : "border-slate-200 group-hover/item:border-[#5A5FF2]/30"
                           )}>
                              {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[4px]" />}
                           </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="py-12 flex flex-col items-center gap-4 bg-slate-50/50 rounded-[32px] border-4 border-dashed border-slate-100 animate-in fade-in zoom-in duration-500">
                       <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                          <Search className="h-8 w-8 text-slate-200 stroke-[3px] opacity-50" />
                       </div>
                       <div className="flex flex-col items-center gap-1">
                          <p className="text-slate-900 font-black text-[16px]">No results found</p>
                          <p className="text-slate-400 text-[13px] font-bold">Try a different name or email address</p>
                       </div>
                       <Button variant="ghost" className="text-[#5A5FF2] font-black text-[14px] h-auto p-0 hover:bg-transparent underline decoration-2 underline-offset-8 mt-2 active:scale-95">CREATE NEW COLLABORATOR</Button>
                    </div>
                  )}
               </div>
            </div>

            {/* Assignment Level */}
            {selectedCollab && (
              <div className="space-y-5 animate-in slide-in-from-top-4 zoom-in-95 duration-500">
                 <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Assignment Scope</Label>
                 <RadioGroup 
                   value={assignmentLevel} 
                   onValueChange={(v: any) => setAssignmentLevel(v)}
                   className="grid grid-cols-2 gap-4"
                 >
                    <Label className={cn(
                      "flex flex-col items-start gap-4 p-6 rounded-[28px] border-2 cursor-pointer transition-all relative group overflow-hidden",
                      assignmentLevel === 'client' 
                        ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-xl shadow-[#5A5FF2]/10" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    )}>
                       <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-all", 
                         assignmentLevel === 'client' ? "bg-[#5A5FF2] text-white shadow-lg" : "bg-slate-50 text-slate-400 group-hover:scale-110")}>
                          <Users className="h-5 w-5 stroke-[2.5px]" />
                       </div>
                       <RadioGroupItem value="client" className="sr-only" />
                       <div className="flex flex-col gap-1">
                          <span className={cn("font-black text-[15px] tracking-tight", assignmentLevel === 'client' ? "text-[#5A5FF2]" : "text-slate-900")}>Client Level</span>
                          <span className="text-[12px] text-slate-400 font-medium leading-[1.3]">Access to all future activities</span>
                       </div>
                    </Label>
                    <Label className={cn(
                      "flex flex-col items-start gap-4 p-6 rounded-[28px] border-2 cursor-pointer transition-all relative group overflow-hidden",
                      assignmentLevel === 'transaction' 
                        ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-xl shadow-[#5A5FF2]/10" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    )}>
                       <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-all", 
                         assignmentLevel === 'transaction' ? "bg-[#5A5FF2] text-white shadow-lg" : "bg-slate-50 text-slate-400 group-hover:scale-110")}>
                          <Briefcase className="h-5 w-5 stroke-[2.5px]" />
                       </div>
                       <RadioGroupItem value="transaction" className="sr-only" />
                       <div className="flex flex-col gap-1">
                          <span className={cn("font-black text-[15px] tracking-tight", assignmentLevel === 'transaction' ? "text-[#5A5FF2]" : "text-slate-900")}>Transaction Only</span>
                          <span className="text-[12px] text-slate-400 font-medium leading-[1.3]">Specific deal related access</span>
                       </div>
                    </Label>
                 </RadioGroup>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6">
               <Button 
                variant="outline" 
                className="flex-1 h-16 rounded-[24px] border-2 border-slate-100 text-slate-400 font-black hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 text-[15px] tracking-tight"
                onClick={() => onOpenChange(false)}
               >
                 Go Back
               </Button>
               <Button 
                className="flex-1 h-16 rounded-[24px] bg-[#5A5FF2] text-white font-black hover:bg-[#5A5FF2]/90 shadow-2xl shadow-[#5A5FF2]/30 disabled:grayscale transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-[15px] tracking-tight hover:gap-4 disabled:opacity-50"
                disabled={!selectedCollab || isSubmitting}
                onClick={handleConfirm}
               >
                 {isSubmitting ? <><Loader2 className="h-6 w-6 animate-spin stroke-[3px]" /> Processing...</> : <><Plus className="h-5 w-5 stroke-[3px]" /> Assign Partner</>}
               </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
