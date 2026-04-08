import * as React from "react"
import { Loader2, UserPlus, Trash2, Shield, User, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Collaborator, Transaction } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Separator } from "@/components/ui/Separator"

interface ManageCollaboratorsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: { id: string; name: string }
  assignedCollabs: Collaborator[]
  assignments: any[]
  globalPool: Collaborator[]
  transactions: Transaction[]
  onRemove: (collaboratorId: string) => void
  onUpdateAccess: (collaboratorId: string, newType: 'client' | 'transaction') => void
  onRemoveAll: () => void
  onAssign: (collaboratorId: string, type: 'client' | 'transaction', transactionIds?: string[]) => void
  onOpenInvite: () => void
}

export function ManageCollaboratorsModal({
  open,
  onOpenChange,
  client,
  assignedCollabs,
  assignments,
  transactions,
  onRemove,
  onUpdateAccess,
  onRemoveAll,
  onOpenInvite
}: ManageCollaboratorsModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"current" | "add">("current")

  const handleRemove = async (id: string, name: string) => {
    setIsSubmitting(id)
    await new Promise(r => setTimeout(r, 600))
    onRemove(id)
    toast.success("Collaborator Removed", {
      description: `${name} has been removed from this client.`,
      icon: <Trash2 className="size-4 text-white" />,
      className: "bg-[#EF4444] text-white border-none rounded-2xl",
    })
    setIsSubmitting(null)
  }

  const handleUpdateAccess = (id: string, type: 'client' | 'transaction') => {
    onUpdateAccess(id, type)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-[32px] border-none shadow-[0px_20px_50px_rgba(0,0,0,0.2)] p-0 overflow-hidden">
        <div className="flex flex-col h-[700px]">
          {/* Header */}
          <div className="p-8 pb-4">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-[#171717]">Manage Collaborators</DialogTitle>
                  <p className="text-slate-500 font-medium mt-1">For {client.name}</p>
                </div>
                {assignedCollabs.length > 0 && (
                  <Button 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl px-4 gap-2 h-10 transition-all text-xs uppercase tracking-wider"
                    onClick={() => {
                        onRemoveAll()
                    }}
                  >
                    Remove All
                  </Button>
                )}
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="px-8 border-b border-slate-100">
              <div className="bg-slate-100/50 p-1 rounded-2xl h-12 w-full max-w-[400px] mb-4 flex">
                <button 
                  onClick={() => setActiveTab("current")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${activeTab === "current" ? "bg-white shadow-sm text-[#5A5FF2]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <User className="size-4" /> Current
                  {assignedCollabs.length > 0 && (
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "current" ? "bg-[#5A5FF2]/10 text-[#5A5FF2]" : "bg-slate-200 text-slate-500"}`}>
                        {assignedCollabs.length}
                     </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("add")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${activeTab === "add" ? "bg-white shadow-sm text-[#5A5FF2]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <UserPlus className="size-4" /> Add New
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === "current" ? (
                <div className="p-8 pt-6">
                  {assignedCollabs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="size-16 rounded-[24px] bg-slate-50 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                        <Shield className="size-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-[#171717]">No active collaborators</h3>
                      <p className="text-slate-400 max-w-[260px] text-sm mt-2 leading-relaxed">
                        Start by adding a TC, Lender, or Title partner to this client.
                      </p>
                      <Button 
                        className="mt-8 bg-[#5A5FF2] hover:bg-[#4a4ed2] rounded-full px-8 h-12 font-bold shadow-lg shadow-[#5A5FF2]/20 gap-2"
                        onClick={() => setActiveTab("add")}
                      >
                        <UserPlus className="size-4" /> Add Collaborator
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {assignedCollabs.map((collab) => {
                          const assignment = assignments.find(a => a.collaboratorId === collab.id && a.clientId === client.id)
                          return (
                            <motion.div
                              key={collab.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              layout
                              className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all hover:border-[#5A5FF2]/20 group"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12 ring-4 ring-slate-50 transition-all group-hover:ring-[#5A5FF2]/10">
                                    <AvatarImage src={collab.avatar} />
                                    <AvatarFallback className="font-bold text-[#5A5FF2]">{collab.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-bold text-[#171717]">{collab.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] uppercase h-5 px-2">
                                        {collab.role}
                                      </Badge>
                                      <span className="text-[11px] text-[#A3A3A3] font-medium tracking-wide">• ACTIVE</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                  onClick={() => handleRemove(collab.id, collab.name)}
                                  disabled={isSubmitting === collab.id}
                                >
                                  {isSubmitting === collab.id ? <Loader2 className="size-4 animate-spin text-red-500" /> : <Trash2 className="size-4" />}
                                </Button>
                              </div>

                              <Separator className="bg-slate-50 mb-4" />

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-[#A3A3A3] uppercase tracking-widest pl-1">Access Segmentation</label>
                                  <Select 
                                    value={assignment?.assignmentType || "client"} 
                                    onValueChange={(val: 'client' | 'transaction') => handleUpdateAccess(collab.id, val)}
                                  >
                                    <SelectTrigger className="h-11 bg-slate-50 border-none rounded-xl font-bold text-[#171717] group-hover:bg-white transition-colors pl-4">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl overflow-hidden p-1 z-[9999]">
                                      <SelectItem value="client" className="rounded-lg font-bold p-2.5">
                                        Client Access
                                      </SelectItem>
                                      <SelectItem value="transaction" className="rounded-lg font-bold p-2.5">
                                        Transaction Only
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-[#A3A3A3] uppercase tracking-widest pl-1">Assigned Property</label>
                                  <div className="h-11 flex items-center px-4 bg-slate-50 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                                    {assignment?.assignmentType === 'transaction' ? (
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-[12px] font-bold text-[#171717] truncate">
                                          {transactions.find(t => t.id === assignment.transactionId)?.address || "Property ID: " + assignment.transactionId}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#171717]">Full Client Context</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 pt-4">
                  <div className="bg-slate-50/50 rounded-[28px] p-6 border border-slate-100 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-[#171717] flex items-center gap-2">
                        <UserPlus className="size-4 text-[#5A5FF2]" /> Quick Add
                      </h4>
                      <Button variant="link" className="text-[#5A5FF2] font-bold p-0 text-sm h-auto" onClick={onOpenInvite}>
                        Invite new member?
                      </Button>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                        Search through your global collaborator pool to assign them to this client.
                    </p>
                    {/* Inline search logic or trigger Assign modal */}
                    <div className="flex justify-center py-4">
                        <Button 
                             className="bg-white border-2 border-[#5A5FF2] text-[#5A5FF2] hover:bg-[#5A5FF2] hover:text-white rounded-2xl px-10 h-14 font-bold shadow-sm transition-all"
                             onClick={() => {
                                 onOpenChange(false);
                                 setTimeout(() => {
                                    // Trigger the parent's assign modal
                                    const event = new CustomEvent('open-assign-collab', { detail: { client } });
                                    window.dispatchEvent(event);
                                 }, 200)
                             }}
                        >
                            Select from Pool
                        </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Information */}
            <div className="p-8 pt-4 border-t border-slate-50 bg-slate-50/20">
               <div className="flex items-center gap-3 text-[#A3A3A3]">
                  <AlertCircle className="size-4 shrink-0" />
                  <p className="text-[11px] font-bold leading-relaxed">
                    Collaborators assigned at the client level will automatically have access to all future transactions for this client.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
