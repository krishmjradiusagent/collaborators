import * as React from "react"
import { Check, Loader2, UserPlus, Sparkles, Calendar, ChevronDown, User, Home } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/Separator"
import { Collaborator, Transaction } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"

interface AssignCollaboratorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (collaboratorId: string, type: 'client' | 'transaction', transactionId?: string) => void
  onOpenInvite: () => void
  globalPool: Collaborator[]
  transactions?: Transaction[]
  clientName: string
  canInvite?: boolean
  defaultType?: 'client' | 'transaction'
  defaultTransactionId?: string
}

export function AssignCollaboratorModal({
  open,
  onOpenChange,
  onAssign,
  onOpenInvite,
  globalPool,
  transactions = [],
  clientName,
  canInvite = true,
  defaultType = 'client',
  defaultTransactionId
}: AssignCollaboratorModalProps) {
  const [selectedCollabId, setSelectedCollabId] = React.useState<string | null>(null)
  const [assignmentType, setAssignmentType] = React.useState<'client' | 'transaction'>(defaultType)
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(defaultTransactionId || null)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Sync with props when modal opens
  React.useEffect(() => {
    if (open) {
      setAssignmentType(defaultType)
      setSelectedTransactionId(defaultTransactionId || null)
    }
  }, [open, defaultType, defaultTransactionId])

  const selectedCollab = globalPool.find((c) => c.id === selectedCollabId)

  const handleAssign = async () => {
    if (!selectedCollabId) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    onAssign(selectedCollabId, assignmentType, selectedTransactionId || undefined)
    
    toast.success("Assignment Confirmed", {
      description: `${selectedCollab?.name} assigned to ${clientName} at ${assignmentType === 'transaction' ? 'Transaction' : 'Client'} Level.`,
      icon: <Check className="size-4 text-white" />,
      className: "bg-[#5A5FF2] text-white border-none rounded-2xl",
    })
    
    setIsSubmitting(false)
    onOpenChange(false)
    reset()
  }

  const reset = () => {
    setSelectedCollabId(null)
    setAssignmentType(defaultType)
    setSelectedTransactionId(defaultTransactionId || null)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) reset()
      onOpenChange(val)
    }}>
      <DialogContent 
        className="sm:max-w-[500px] bg-white rounded-[32px] border-none shadow-[0px_20px_50px_rgba(0,0,0,0.2)] p-0 overflow-hidden z-[9999] animate-in zoom-in-95 duration-200" 
        overlayClassName="z-[9999]"
      >
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-[#171717]">Assign Collaborator</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Step 1: Search & Select */}
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-[#737373] tracking-widest uppercase">SELECT COLLABORATOR</label>
              
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full h-14 justify-between bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-[16px] px-4 font-medium transition-all group",
                      !selectedCollab && "text-slate-500"
                    )}
                  >
                    {selectedCollab ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={selectedCollab.avatar} />
                          <AvatarFallback className="text-[10px]">{selectedCollab.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-slate-900">{selectedCollab.name}</span>
                        <Badge className="bg-[#5A5FF2]/10 text-[#5A5FF2] border-none text-[10px] h-5 px-2 uppercase font-bold">
                          {selectedCollab.role}
                        </Badge>
                      </div>
                    ) : (
                      "Search team members by name or role..."
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[436px] p-0 rounded-[24px] shadow-[0px_10px_40px_rgba(0,0,0,0.15)] border-[#E2E8F0] overflow-hidden z-[9999]">
                  <Command className="border-none">
                    <CommandInput 
                      placeholder="Search name, role, or team..." 
                      className="h-12 border-none ring-0 focus:ring-0 text-[14px]"
                    />
                    <CommandList className="max-h-[320px]">
                      <CommandEmpty className="py-8 text-center">
                        <UserPlus className="size-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">No collaborator found.</p>
                        {canInvite && (
                          <Button 
                            variant="link" 
                            className="text-[#5A5FF2] font-bold mt-1"
                            onClick={() => {
                              setIsPopoverOpen(false);
                              onOpenChange(false);
                              onOpenInvite();
                            }}
                          >
                            Invite new member?
                          </Button>
                        )}
                      </CommandEmpty>
                      <CommandGroup heading="Team Members" className="p-2">
                        {globalPool.map((collab) => (
                          <CommandItem
                            key={collab.id}
                            value={collab.name}
                            onSelect={() => {
                              setSelectedCollabId(collab.id);
                              setIsPopoverOpen(false);
                            }}
                            className="flex items-center justify-between p-3 rounded-[12px] cursor-pointer hover:bg-slate-50 aria-selected:bg-[#5A5FF2]/5 transition-all group mb-1"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={collab.avatar} />
                                <AvatarFallback className="text-[10px]">{collab.name.substring(0,2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-[#171717]">{collab.name}</span>
                                <span className="text-[12px] text-[#737373] font-medium">{collab.role} • {collab.email}</span>
                              </div>
                            </div>
                            {selectedCollabId === collab.id && (
                              <div className="bg-[#5A5FF2] p-1 rounded-full">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {canInvite && (
                      <>
                        <Separator className="bg-slate-100" />
                        <div className="p-2">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-[14px] font-bold text-[#5A5FF2] hover:bg-[#5A5FF2]/5 rounded-xl h-12 gap-2 px-3"
                            onClick={() => {
                              setIsPopoverOpen(false);
                              onOpenChange(false);
                              onOpenInvite();
                            }}
                          >
                            <div className="size-8 rounded-full bg-[#5A5FF2]/10 flex items-center justify-center">
                              <UserPlus className="h-4 w-4" />
                            </div>
                            Invite New Collaborator
                          </Button>
                        </div>
                      </>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Step 2: Assignment Level */}
            <div className="space-y-4">
              <label className="text-[12px] font-bold text-[#737373] tracking-widest uppercase">ASSIGNMENT LEVEL</label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Client Level */}
                <div 
                  className={cn(
                    "relative flex flex-col p-5 rounded-[28px] border-2 cursor-pointer transition-all duration-300",
                    assignmentType === 'client' 
                      ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-[0px_10px_20px_rgba(90,95,242,0.1)] scale-[1.02]" 
                      : "border-slate-100 bg-white hover:border-slate-200 hover:scale-[1.01]"
                  )}
                  onClick={() => setAssignmentType('client')}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={cn(
                      "p-2.5 rounded-2xl transition-colors",
                      assignmentType === 'client' ? "bg-[#5A5FF2] text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <User className="size-5" />
                    </div>
                    <div className={cn(
                      "size-[20px] rounded-full border-2 flex items-center justify-center transition-all",
                      assignmentType === 'client' ? "border-[#5A5FF2] bg-[#5A5FF2]" : "border-slate-200"
                    )}>
                      {assignmentType === 'client' && <div className="size-2 rounded-full bg-white shadow-sm" />}
                    </div>
                  </div>
                  <span className="text-[16px] font-bold text-[#171717]">Client Level</span>
                  <p className="text-[12px] text-slate-500 font-medium leading-tight mt-1.5 px-0.5">Access to entire client profile & details.</p>
                </div>

                {/* Transaction Level */}
                <div 
                  className={cn(
                    "relative flex flex-col p-5 rounded-[28px] border-2 cursor-pointer transition-all duration-300",
                    assignmentType === 'transaction' 
                      ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-[0px_10px_20px_rgba(90,95,242,0.1)] scale-[1.02]" 
                      : "border-slate-100 bg-white hover:border-slate-200 hover:scale-[1.01]"
                  )}
                  onClick={() => setAssignmentType('transaction')}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={cn(
                      "p-2.5 rounded-2xl transition-colors",
                      assignmentType === 'transaction' ? "bg-[#5A5FF2] text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Home className="size-5" />
                    </div>
                    <div className={cn(
                      "size-[20px] rounded-full border-2 flex items-center justify-center transition-all",
                      assignmentType === 'transaction' ? "border-[#5A5FF2] bg-[#5A5FF2]" : "border-slate-200"
                    )}>
                      {assignmentType === 'transaction' && <div className="size-2 rounded-full bg-white shadow-sm" />}
                    </div>
                  </div>
                  <span className="text-[16px] font-bold text-[#171717]">Transaction Level</span>
                  <p className="text-[12px] text-slate-500 font-medium leading-tight mt-1.5 px-0.5">Access limited to a specific transaction.</p>
                </div>
              </div>
            </div>

            {/* Transaction Selection Dropdown (Only if Transaction Level) */}
            {assignmentType === 'transaction' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="text-[12px] font-bold text-[#737373] tracking-widest uppercase">SELECT TRANSACTION</label>
                <RadioGroup 
                  value={selectedTransactionId || ''} 
                  onValueChange={setSelectedTransactionId}
                  className="grid gap-2.5"
                >
                  {transactions.map((tx) => (
                    <div 
                      key={tx.id}
                      onClick={() => setSelectedTransactionId(tx.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                        selectedTransactionId === tx.id 
                          ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-sm" 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-white transition-colors shrink-0">
                        <Home className={cn("size-5", selectedTransactionId === tx.id ? "text-[#5A5FF2]" : "text-slate-400")} />
                      </div>
                      
                      <div className="flex flex-1 items-center justify-between min-w-0 gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-bold text-[#171717] truncate leading-tight">{tx.address}</span>
                          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mt-0.5">Active Transaction</span>
                        </div>
                        <Badge className="bg-[#EEFDF6] text-[#10B981] border-none font-bold text-[9px] px-2 h-5 uppercase whitespace-nowrap shrink-0 tracking-wider">
                          {tx.status}
                        </Badge>
                      </div>

                      <div className={cn(
                        "size-[18px] rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                        selectedTransactionId === tx.id ? "border-[#5A5FF2] bg-[#5A5FF2]" : "border-slate-200"
                      )}>
                        {selectedTransactionId === tx.id && <div className="size-1.5 rounded-full bg-white shadow-sm" />}
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] text-center">
                      <p className="text-sm text-slate-500 font-medium">No active transactions found for this client.</p>
                      <Button variant="link" className="text-[#5A5FF2] font-bold p-0 h-auto mt-1">Create new transaction</Button>
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <Button
              variant="ghost"
              className="flex-1 h-16 rounded-[24px] text-slate-500 font-bold hover:bg-slate-50 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "flex-[1.5] h-16 rounded-[24px] font-bold text-white transition-all shadow-xl",
                (assignmentType === 'client' || selectedTransactionId) && selectedCollabId
                  ? "bg-[#5A5FF2] hover:bg-[#4a4ed2] shadow-[#5A5FF2]/20 hover:translate-y-[-2px]" 
                  : "bg-slate-200 cursor-not-allowed shadow-none"
              )}
              disabled={!selectedCollabId || (assignmentType === 'transaction' && !selectedTransactionId) || isSubmitting}
              onClick={handleAssign}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : "Confirm Assignment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
