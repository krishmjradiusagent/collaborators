import * as React from "react"
import { 
  X, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Check, 
  Lightbulb,
  CheckCircle2,
  Loader2,
  Sparkles
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { GLOBAL_COLLABORATOR_POOL } from "../../../modules/Clients/mockData"
import { Collaborator } from "../../../modules/Clients/types"
import { toast } from "sonner"

interface CreateTransactionWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type WizardStep = 1 | 2

export function CreateTransactionWizard({
  open,
  onOpenChange
}: CreateTransactionWizardProps) {
  const [step, setStep] = React.useState<WizardStep>(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Step 1 State
  const [txType, setTxType] = React.useState<string>("")
  const [status, setStatus] = React.useState<string>("")

  // Step 2 State
  const [behalfOf, setBehalfOf] = React.useState<string>("MohammedTeamLead123 Sayyaf12 (For Me)")
  const [state, setState] = React.useState<string>("California")
  const [purchaseType, setPurchaseType] = React.useState<string>("Standard Purchase")
  const [searchMethod, setSearchMethod] = React.useState<'mls' | 'property'>('property')
  const [propertyAddress, setPropertyAddress] = React.useState("")
  const [selectedCollabIds, setSelectedCollabIds] = React.useState<string[]>([])
  const [isCollabPopoverOpen, setIsCollabPopoverOpen] = React.useState(false)

  const selectedCollabs = GLOBAL_COLLABORATOR_POOL.filter((c: Collaborator) => selectedCollabIds.includes(c.id))

  const handleCreate = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Transaction created successfully", {
      description: `Transaction for ${propertyAddress || "new deal"} created and ${selectedCollabIds.length} collaborators assigned.`,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      className: "bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-2xl",
    })

    setIsSubmitting(false)
    onOpenChange(false)
    reset()
  }

  const reset = () => {
    setStep(1)
    setTxType("")
    setStatus("")
    setPropertyAddress("")
    setSelectedCollabIds([])
  }

  const isStep1Valid = txType !== "" && status !== ""
  const isStep2Valid = behalfOf !== "" && state !== "" && purchaseType !== ""

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) reset()
      onOpenChange(val)
    }}>
      <DialogContent className={cn(
        "bg-white p-0 overflow-hidden border-none shadow-[0px_30px_90px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-300 rounded-[32px] outline-none stroke-none flex flex-col max-h-[92vh]",
        step === 1 ? "max-w-[540px]" : "max-w-[700px]"
      )}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="p-10 overflow-y-auto flex-1 no-scrollbar"
            >
              <DialogHeader className="mb-10 text-left relative">
                <DialogTitle className="text-[28px] font-black text-[#171717] tracking-tighter">Transaction Details</DialogTitle>
                <p className="text-[#737373] text-[15px] font-bold mt-2">Select the transaction type and current status</p>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="absolute right-0 top-0 size-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="size-5 text-slate-400" />
                </button>
              </DialogHeader>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-black text-[#737373] tracking-widest uppercase ml-1">Transaction Type <span className="text-rose-500">*</span></label>
                  <Select value={txType} onValueChange={setTxType}>
                    <SelectTrigger className="h-16 rounded-[22px] bg-[#F8FAFC] border-2 border-slate-50 focus:border-[#5A5FF2]/20 font-bold text-[16px] px-6 transition-all ring-offset-0 focus:ring-4 focus:ring-[#5A5FF2]/5 shadow-sm">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[24px] border-slate-100 shadow-2xl p-2 z-[9999]">
                      <SelectItem value="Agreement_1501" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] transition-colors">Residential Buyer Representation Agreement (1501)</SelectItem>
                      <SelectItem value="Agreement_1502" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] transition-colors">Residential Listing Agreement (1502)</SelectItem>
                      <SelectItem value="Referral" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] transition-colors">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-black text-[#737373] tracking-widest uppercase ml-1">Current Status <span className="text-rose-500">*</span></label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-16 rounded-[22px] bg-[#F8FAFC] border-2 border-slate-50 focus:border-[#5A5FF2]/20 font-bold text-[16px] px-6 transition-all ring-offset-0 focus:ring-4 focus:ring-[#5A5FF2]/5 shadow-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[24px] border-slate-100 shadow-2xl p-2 z-[9999]">
                      <SelectItem value="Pending" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2]">Pending</SelectItem>
                      <SelectItem value="Incomplete" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2]">Incomplete - Pending</SelectItem>
                      <SelectItem value="Prospect" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2]">Prospect</SelectItem>
                      <SelectItem value="New Offer" className="rounded-xl h-12 font-bold focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2]">New Offer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[12px] text-slate-400 font-bold ml-1">Status depends on transaction type</p>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-16 rounded-[28px] text-slate-500 font-bold text-[16px] hover:bg-slate-50 transition-all active:scale-95"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className={cn(
                    "flex-1 h-16 rounded-[28px] font-bold text-[16px] transition-all shadow-xl active:scale-95",
                    isStep1Valid ? "bg-[#CBD5E1] text-[#334155] hover:bg-slate-300" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                  onClick={() => isStep1Valid && setStep(2)}
                  disabled={!isStep1Valid}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="p-10 overflow-y-auto flex-1 no-scrollbar"
            >
              <div className="flex justify-between items-start mb-8">
                <DialogTitle className="text-[24px] font-black text-[#171717] tracking-tight leading-7 pr-12 max-w-[500px]">
                  Let's get some basic details about your transaction.
                </DialogTitle>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="size-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="size-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Section 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#5A5FF2] text-white flex items-center justify-center text-[11px] font-black">1</div>
                    <label className="text-[14px] font-black text-[#5A5FF2] tracking-normal">Create on behalf of:</label>
                  </div>
                  <Select value={behalfOf} onValueChange={setBehalfOf}>
                    <SelectTrigger className="h-14 rounded-[16px] bg-[#F8FAFC] border-[#E2E8F0] font-bold text-[15px] px-5 transition-all text-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl z-[9999]">
                      <SelectItem value="MohammedTeamLead123 Sayyaf12 (For Me)">MohammedTeamLead123 Sayyaf12 (For Me)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Section 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#5A5FF2] text-white flex items-center justify-center text-[11px] font-black">2</div>
                    <label className="text-[14px] font-black text-[#5A5FF2] tracking-normal">Select a purchase type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[12px] font-bold text-slate-400 ml-1">State</label>
                       <Select value={state} onValueChange={setState}>
                         <SelectTrigger className="h-14 rounded-[16px] bg-[#F8FAFC] border-[#E2E8F0] font-bold text-[15px] px-5 transition-all text-slate-600">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl z-[9999]">
                           <SelectItem value="California">California</SelectItem>
                           <SelectItem value="Texas">Texas</SelectItem>
                           <SelectItem value="Florida">Florida</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[12px] font-bold text-slate-400 ml-1">Purchase Type</label>
                       <Select value={purchaseType} onValueChange={setPurchaseType}>
                         <SelectTrigger className="h-14 rounded-[16px] bg-[#F8FAFC] border-[#E2E8F0] font-bold text-[15px] px-5 transition-all text-slate-600">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl z-[9999]">
                           <SelectItem value="Standard Purchase">Standard Purchase</SelectItem>
                           <SelectItem value="Investment">Investment</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                </div>

                {/* PRO TIP */}
                <div className="p-6 bg-[#EEF2FF]/40 rounded-[24px] border-2 border-[#5A5FF2]/10 space-y-3 relative overflow-hidden">
                   <div className="flex items-center gap-2.5 text-[#5A5FF2]">
                      <Lightbulb className="size-4 fill-current" />
                      <span className="text-[12px] font-black tracking-widest uppercase">PRO TIP</span>
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[14px] font-black text-[#171717]">Have an MLS ID at your disposal?</p>
                      <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                        Enter it to auto-fill parts of the property and seller sections. Don't have an ID? No worries. You can manually input the info below.
                      </p>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles className="size-20" />
                   </div>
                </div>

                {/* Section 3 */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#5A5FF2] text-white flex items-center justify-center text-[11px] font-black">3</div>
                    <label className="text-[14px] font-black text-[#5A5FF2] tracking-normal">Search using MLS ID or Property address</label>
                  </div>
                  <div className="space-y-5">
                     <div className="flex p-1 bg-slate-100 rounded-[18px] w-fit">
                        <button 
                          onClick={() => setSearchMethod('mls')}
                          className={cn(
                            "px-6 h-10 rounded-2xl text-[13px] font-bold transition-all",
                            searchMethod === 'mls' ? "bg-white text-[#5A5FF2] shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Search using MLS
                        </button>
                        <button 
                          onClick={() => setSearchMethod('property')}
                          className={cn(
                            "px-6 h-10 rounded-2xl text-[13px] font-bold transition-all",
                            searchMethod === 'property' ? "bg-white text-[#5A5FF2] shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Search using property address
                        </button>
                     </div>
                     <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1">
                           <Search className="size-5 text-slate-300" />
                        </div>
                        <input 
                          type="text"
                          placeholder="Search by property address"
                          className="w-full h-16 pl-14 pr-16 bg-white border-2 border-slate-100 focus:border-[#5A5FF2]/20 rounded-[22px] font-bold text-[16px] outline-none transition-all placeholder:text-slate-300 shadow-sm"
                          value={propertyAddress}
                          onChange={(e) => setPropertyAddress(e.target.value)}
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-2xl bg-[#5A5FF2]/10 flex items-center justify-center text-[#5A5FF2] hover:bg-[#5A5FF2]/20 transition-all">
                           <ChevronRight className="size-5 stroke-[3px]" />
                        </button>
                     </div>
                  </div>
                </div>

                {/* Mandatory Step 4: Add Collaborators */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#5A5FF2] text-white flex items-center justify-center text-[11px] font-black">4</div>
                    <label className="text-[14px] font-black text-[#5A5FF2] tracking-normal uppercase tracking-widest">Add Collaborators</label>
                  </div>
                  
                  <div className="space-y-3">
                    <Popover open={isCollabPopoverOpen} onOpenChange={setIsCollabPopoverOpen}>
                      <PopoverTrigger asChild>
                        <div className={cn(
                          "min-h-[64px] p-2 pr-12 w-full rounded-[20px] bg-slate-50 border-2 border-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center relative group",
                          isCollabPopoverOpen && "bg-white border-[#5A5FF2]/10 shadow-lg ring-4 ring-[#5A5FF2]/5"
                        )}>
                          {selectedCollabs.length > 0 ? (
                            <div className="flex items-center gap-3 pl-2 overflow-hidden">
                              <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0 rounded-2xl">
                                 <AvatarImage src={selectedCollabs[0].avatar} />
                                 <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-600 font-black uppercase tracking-tight">
                                    {selectedCollabs[0].name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-[15px] font-black text-[#171717] truncate max-w-[200px]">
                                  {selectedCollabs[0].name}
                                </span>
                                {selectedCollabs.length > 1 && (
                                  <span className="text-[13px] font-bold text-slate-400 shrink-0 bg-slate-100/50 px-3 py-1 rounded-full border border-slate-100">
                                    + {selectedCollabs.length - 1} others
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-bold ml-4 text-[14px]">Search team members by name or role...</span>
                          )}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 group-hover:text-slate-400 transition-colors">
                             <ChevronDown className="size-5" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[620px] p-0 rounded-[28px] shadow-[0px_20px_60px_rgba(0,0,0,0.15)] border-slate-100 overflow-hidden z-[9999]" align="start">
                        <Command className="border-none">
                          <CommandInput 
                            placeholder="Search name, role, or team..." 
                            className="h-14 border-none ring-0 focus:ring-0 text-[15px] font-bold" 
                          />
                          <CommandList className="max-h-[300px]">
                            <CommandEmpty className="py-12 text-center">
                               <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-100/50">
                                  <Search className="size-8 text-slate-200" />
                               </div>
                               <p className="text-[14px] font-black text-[#171717]">No team member found</p>
                               <p className="text-[12px] text-slate-400 font-medium">Try searching for a different name or role</p>
                            </CommandEmpty>
                            <CommandGroup heading={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block">Team Members</span>} className="p-3">
                              {GLOBAL_COLLABORATOR_POOL.map((collab) => (
                                <CommandItem
                                  key={collab.id}
                                  onSelect={() => {
                                    if (selectedCollabIds.includes(collab.id)) {
                                      setSelectedCollabIds(prev => prev.filter(id => id !== collab.id));
                                    } else {
                                      setSelectedCollabIds(prev => [...prev, collab.id]);
                                    }
                                  }}
                                  className="flex items-center justify-between p-4 rounded-3xl cursor-pointer hover:bg-slate-50 aria-selected:bg-[#5A5FF2]/5 transition-all group mb-2 border-2 border-transparent aria-selected:border-[#5A5FF2]/10"
                                >
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 rounded-2xl shadow-sm border border-slate-100">
                                      <AvatarImage src={collab.avatar} />
                                      <AvatarFallback className="text-[12px] font-black bg-indigo-50 text-indigo-600 uppercase tracking-tight">
                                        {collab.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-0.5 text-left">
                                      <span className="text-[15px] font-black text-[#171717]">{collab.name}</span>
                                      <span className="text-[12px] text-slate-400 font-bold">{collab.role} • {collab.email}</span>
                                    </div>
                                  </div>
                                  <div className={cn(
                                    "size-7 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedCollabIds.includes(collab.id) ? "bg-[#5A5FF2] border-[#5A5FF2] shadow-lg shadow-[#5A5FF2]/30 scale-110" : "border-slate-100 group-hover:border-slate-200"
                                  )}>
                                    {selectedCollabIds.includes(collab.id) && <Check className="size-4 text-white stroke-[4px]" />}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-16 rounded-[28px] text-slate-500 font-bold text-[16px] hover:bg-slate-50 transition-all active:scale-95"
                  onClick={() => setStep(1)}
                >
                  Cancel
                </Button>
                <Button 
                  className={cn(
                    "flex-[1.5] h-16 rounded-[28px] font-bold text-[16px] transition-all shadow-xl active:scale-95 text-white flex items-center justify-center gap-2",
                    isStep2Valid ? "bg-[#5A5FF2] hover:bg-[#4d52e0] shadow-[#5A5FF2]/30" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                  onClick={() => isStep2Valid && handleCreate()}
                  disabled={!isStep2Valid || isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="size-6 animate-spin stroke-[3px]" /> Creating Transaction...</>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
