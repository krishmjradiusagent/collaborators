import * as React from "react"
import { Loader2, Plus, Shield, AlertCircle, Search, X, Check, Building2, ChevronRight, ArrowUpCircle } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog"
import { Collaborator, Transaction } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ManageCollaboratorsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: { id: string; name: string }
  assignedCollabs: Collaborator[]
  assignments: any[]
  globalPool: Collaborator[]
  transactions: Transaction[]
  onRemove: (collaboratorId: string) => void
  onUpdateAccess: (collaboratorId: string, newType: 'client' | 'transaction', transactionIds?: string[]) => void
  onRemoveAll: () => void
  onAssign: (collabId: string, type: 'client' | 'transaction', transactionIds?: string[]) => void
  onOpenInvite: () => void
  isGlobal?: boolean
  contextType?: 'client' | 'transaction'
}
export function ManageCollaboratorsModal({
  open,
  onOpenChange,
  client = { id: '', name: '' },
  assignedCollabs = [],
  assignments = [],
  transactions = [],
  globalPool = [],
  onRemove = () => { },
  onUpdateAccess = () => { },
  onRemoveAll = () => { },
  onAssign = () => { },
  onOpenInvite = () => { },
  isGlobal = false,
  contextType = 'client'
}: ManageCollaboratorsModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [expandedCollabId, setExpandedCollabId] = React.useState<string | null>(null)

  const filteredPool = (globalPool || []).filter(c =>
    !(assignedCollabs || []).some(ac => ac.name === c.name) && // Matching by name in mock
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleRemove = async (id: string, name: string) => {
    setIsSubmitting(id)
    await new Promise(r => setTimeout(r, 600))
    onRemove(id)
    toast.success("Team member removed", {
      description: `${name}'s access has been revoked.`,
    })
    setIsSubmitting(null)
  }

  const handleUpgrade = (id: string) => {
    setIsSubmitting(id)
    // Simulating API call
    setTimeout(() => {
      onUpdateAccess(id, 'client')
      setIsSubmitting(null)
      setExpandedCollabId(id) // Open to show new context
      toast.success("Access Upgraded", {
        description: "Collaborator now has global client access.",
        className: "bg-emerald-500 text-white border-none rounded-2xl",
      })
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="manage-collabs-description"
        className="sm:max-w-[480px] bg-white rounded-[32px] border-none shadow-[0px_32px_80px_rgba(0,0,0,0.18)] p-0 overflow-hidden flex flex-col"
      >
        {/* Header Section */}
        <div className="p-6 pb-4 border-b border-slate-50 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-xl font-bold text-[#171717] tracking-tight flex items-center gap-2">
                Manage
                <Badge variant="brand" className="h-5 px-1.5 rounded-md text-[9px]">{assignedCollabs.length}</Badge>
              </DialogTitle>
              <DialogDescription id="manage-collabs-description" className="text-slate-400 font-medium text-[12px]">
                Managing collaborators for <span className="text-slate-900 font-bold">{client.name}</span>
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 font-bold rounded-xl px-3 h-8 text-[10px] uppercase tracking-wider"
                onClick={onRemoveAll}
              >
                Revoke All
              </Button>
            </div>
          </DialogHeader>

          {/* Inline Search Bar */}
          <div className="mt-4 relative group">
            <div className={cn(
              "flex items-center gap-3 px-4 h-11 bg-slate-100/50 border border-slate-200/50 rounded-2xl transition-all duration-300",
              isSearching && "bg-white border-[#5A5FF2] ring-4 ring-[#5A5FF2]/5 shadow-sm"
            )}>
              <Search className={cn("size-4 transition-colors", isSearching ? "text-[#5A5FF2]" : "text-slate-400")} />
              <input
                placeholder="Search team members to add..."
                className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="hover:text-slate-900 text-slate-400">
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearching && searchQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] p-1.5 overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar"
                >
                  {filteredPool.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-slate-400 text-[12px] font-medium">No members found in pool</p>
                      <Button variant="link" className="text-[#5A5FF2] text-[12px] mt-1 h-auto p-0" onClick={onOpenInvite}>
                        Invite new email
                      </Button>
                    </div>
                  ) : (
                    filteredPool.map(c => (
                      <motion.button
                        key={c.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          onAssign(c.id, 'transaction', [client.id])
                          setSearchQuery("")
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#5A5FF2]/5 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={c.avatar} />
                            <AvatarFallback className="text-[10px] bg-slate-100">{c.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="text-[13px] font-bold text-slate-900 leading-none">{c.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">{c.role}</p>
                          </div>
                        </div>
                        <div className="size-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#5A5FF2] transition-colors">
                          <Plus className="size-3.5 text-slate-400 group-hover:text-white" />
                        </div>
                      </motion.button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[480px]">
          {assignedCollabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <div className="size-16 rounded-[24px] bg-slate-50 flex items-center justify-center mb-4 border border-slate-100/50 shadow-inner">
                <Shield className="size-8 text-slate-200" />
              </div>
              <h3 className="text-[15px] font-bold text-[#171717]">No active collaborators</h3>
              <p className="text-slate-400 max-w-[240px] text-[12px] mt-2 font-medium leading-relaxed">
                Add team members from your pool to manage this property context.
              </p>
            </div>
          ) : (
            <div className="p-6 pt-3 space-y-3">
              <AnimatePresence mode="popLayout">
                {assignedCollabs.map((collab) => {
                  const memberAssignments = assignments.filter(a => a.collaboratorId === collab.id)
                  const isClientAccess = memberAssignments.some(a => a.assignmentType === 'client')
                  const primaryAssignment = memberAssignments[0]
                  const otherCount = memberAssignments.length - 1

                  return (
                    <motion.div
                      key={collab.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group/card relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <Avatar className="size-10 ring-2 ring-transparent group-hover/card:ring-[#5A5FF2]/20 transition-all shadow-sm">
                            <AvatarImage src={collab.avatar} />
                            <AvatarFallback className="font-bold text-[#5A5FF2] bg-[#5A5FF2]/5">{collab.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-[14px] text-[#171717]">{collab.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="slate" className="h-4 px-1.5 rounded text-[8px] font-black tracking-wider uppercase">{collab.role}</Badge>
                              {!isClientAccess && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpgrade(collab.id);
                                  }}
                                  className="text-[9px] font-bold text-[#5A5FF2] hover:text-[#4A4FE2] uppercase tracking-wide flex items-center gap-1 transition-all"
                                >
                                  <ArrowUpCircle className="size-3" /> Upgrade to Client
                                </button>
                              )}
                              {isClientAccess && (
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide flex items-center gap-1">
                                  <Check className="size-2.5" /> Full access
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(collab.id, collab.name);
                          }}
                          disabled={isSubmitting === collab.id}
                        >
                          {isSubmitting === collab.id ? <Loader2 className="size-3 animate-spin text-red-500" /> : <X className="size-4" />}
                        </Button>
                      </div>

                      <Separator className="bg-slate-50 my-3" />

                      <button
                        onClick={() => setExpandedCollabId(expandedCollabId === collab.id ? null : collab.id)}
                        className="w-full flex items-center justify-between bg-slate-50/50 rounded-xl px-3 py-2 border border-slate-100/50 hover:bg-white hover:border-slate-100 transition-all group/toggle"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 text-left">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Access Level</span>
                          {isClientAccess ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="size-3 text-[#5A5FF2]" />
                              <span className="text-[11px] font-bold text-slate-900">All Client Transactions</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-white border-slate-100 text-slate-700 shadow-sm rounded-lg h-6 px-2 font-bold text-[10px] gap-1.5 max-w-[120px]">
                                <span className="truncate">{transactions.find(t => t.id === primaryAssignment?.transactionId)?.address?.split(',')[0] || (client.name || 'Unknown').split(',')[0]}</span>
                                {otherCount > 0 && <span className="text-[#5A5FF2]">+{otherCount}</span>}
                              </Badge>

                              {!isGlobal && (
                                <Popover>
                                  <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button className="size-6 rounded-lg border border-dashed border-slate-300 flex items-center justify-center hover:border-[#5A5FF2] hover:text-[#5A5FF2] text-slate-400 transition-all bg-white">
                                      <Plus className="size-3" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[200px] p-1.5 rounded-xl border-slate-100 shadow-2xl z-[300] bg-white/95 backdrop-blur-xl"
                                    align="start"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <p className="px-2 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Add more properties</p>
                                    <div className="space-y-1 mt-1 max-h-[200px] overflow-y-auto no-scrollbar">
                                      {(transactions || []).filter(t => t?.address && !memberAssignments.some(ma => ma.transactionId === t.id)).map(t => (
                                        <button
                                          key={t.id}
                                          onClick={() => {
                                            onAssign(collab.id, 'transaction', [t.id])
                                            toast.success("Transaction Added", {
                                              description: `${(t.address || '').split(',')[0]} linked to ${collab.name}.`
                                            })
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#5A5FF2] text-[11px] font-bold text-slate-700 hover:text-white flex items-center justify-between group/row transition-all"
                                        >
                                          <span className="truncate">{(t.address || '').split(',')[0]}</span>
                                          <Plus className="size-3 opacity-0 group-hover/row:opacity-100 text-white" />
                                        </button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          )}
                          {contextType === 'client' && !isClientAccess && (
                            <div className="flex flex-col gap-1 mt-2 pl-1">
                              <p className="text-[10px] text-slate-400">
                                Want to add transaction?{" "}
                                <button
                                  onClick={() => {
                                    toast.info("Opening Transaction View", { icon: "🏘️" });
                                  }}
                                  className="text-[#5A5FF2] hover:underline font-bold"
                                >
                                  Click here
                                </button>
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "text-[10px] font-bold transition-colors",
                            expandedCollabId === collab.id ? "text-slate-900" : "text-[#5A5FF2]"
                          )}>
                            {expandedCollabId === collab.id ? "Minimize" : "Context"}
                          </span>
                          <motion.div
                            animate={{ rotate: expandedCollabId === collab.id ? 90 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <ChevronRight className={cn(
                              "size-3 transition-colors",
                              expandedCollabId === collab.id ? "text-slate-900" : "text-[#5A5FF2]"
                            )} />
                          </motion.div>
                        </div>
                      </button>

                      {/* Expanded Explorer View */}
                      <AnimatePresence>
                        {expandedCollabId === collab.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-3">
                              <div className="flex flex-col gap-2">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Active Locations</h5>
                                <div className="space-y-1.5">
                                  {isClientAccess ? (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                      <div className="size-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                        <Building2 className="size-4 text-[#5A5FF2]" />
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-bold text-slate-900">Global Hierarchy</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Automatic access to all {transactions.length} properties</p>
                                      </div>
                                    </div>
                                  ) : (
                                    (memberAssignments || []).map(ma => {
                                      const tx = (transactions || []).find(t => t.id === ma.transactionId) || { address: client.name || 'Unknown' };
                                      return (
                                        <div key={ma.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                              <Building2 className="size-4 text-slate-400" />
                                            </div>
                                            <div>
                                              <p className="text-[11px] font-bold text-slate-900">
                                                {(tx.address || '').split(',')[0]}
                                              </p>
                                              <p className="text-[10px] text-slate-400 font-medium">Linked Transaction Context</p>
                                            </div>
                                          </div>
                                          <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold text-red-500 hover:bg-red-50 uppercase px-2 rounded-lg">
                                            Revoke
                                          </Button>
                                        </div>
                                      )
                                    })
                                  )}
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-[#5A5FF2]/5 border border-[#5A5FF2]/10 flex items-center gap-2">
                                <Shield className="size-3.5 text-[#5A5FF2]" />
                                <p className="text-[10px] font-bold text-[#5A5FF2]">
                                  Permissions sync automatically across context.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Compact Success Banner / Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
          <div className="size-7 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
            <AlertCircle className="size-3.5 text-[#5A5FF2]" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 leading-tight">
            Client-level access syncs across all transaction contexts automatically.
          </p>
          <div className="flex-1" />
          <Button
            className="h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border-none px-4 text-[11px] font-bold text-white transition-all shadow-md shadow-slate-900/10"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
