import * as React from "react"
import { 
  ChevronLeft, 
  ChevronDown, 
  Plus, 
  Clock, 
  Edit2, 
  Users,
  Settings,
  MoreHorizontal,
  FileText,
  Mail,
  ShieldCheck,
  ChevronRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { CollaboratorAvatarStack } from "../../Shared/components/CollaboratorAvatarStack"
import { Transaction, Collaborator } from "../types"
import { AssignCollaboratorModal } from "../../Clients/components/AssignCollaboratorModal"
import { GLOBAL_COLLABORATOR_POOL } from "../../Clients/mockData"
import { INITIAL_COLLABORATORS } from "../../TeamSettings/collaborators/mockData"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

interface TransactionDetailPageProps {
  transaction: Transaction
  onBack: () => void
  onUpdateTransaction: (updatedTx: Transaction) => void
}

export function TransactionDetailPage({ transaction, onBack, onUpdateTransaction }: TransactionDetailPageProps) {
  const [activeTab, setActiveTab] = React.useState("Document preparation")
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)

  const tabs = ["Document preparation", "Sent envelopes"]

  const handleAssign = (collaboratorId: string, _type: 'client' | 'transaction', _transactionIds?: string[]) => {
    const collab = INITIAL_COLLABORATORS.find(c => c.id === collaboratorId)
    if (collab) {
      const newCollaborator: Collaborator = {
        id: collab.id,
        name: collab.name,
        role: collab.type.toUpperCase(),
        status: 'active'
      }
      
      onUpdateTransaction({
        ...transaction,
        collaborators: [...transaction.collaborators, newCollaborator]
      })
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-[#F8FAFC] min-h-screen animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto pb-20 no-scrollbar">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#EFEFEF] sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#5A5FF2] font-bold hover:bg-[#5A5FF2]/5 px-4 py-2 rounded-full transition-all active:scale-95"
        >
          <div className="size-8 rounded-full border-2 border-[#5A5FF2]/20 flex items-center justify-center">
            <ChevronLeft className="size-4 stroke-[3px]" />
          </div>
          Back to transactions
        </button>
        <Button variant="outline" className="rounded-full border-[#5A5FF2] text-[#5A5FF2] font-bold px-6 h-10 hover:bg-[#5A5FF2] hover:text-white transition-all">
          Purchase Details <ChevronDown className="size-4 ml-2" />
        </Button>
      </div>

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        {/* Page Title */}
        <h1 className="text-[32px] font-black text-[#111827] tracking-tight">Preparing Purchase Agreement</h1>

        {/* Transaction Header Card */}
        <div className="bg-white border border-[#E0E7FF] rounded-[24px] shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md">
          {/* Left Border Accent */}
          <div className="absolute top-0 left-0 w-[6px] h-full bg-[#5A5FF2]" />
          
          {/* Top Section */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Transaction name</span>
              <div className="flex items-center gap-3">
                <h2 className="text-[28px] font-black text-[#111827] tracking-tight leading-tight">
                  {transaction.address}
                </h2>
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-[#5A5FF2] transition-all">
                  <Edit2 className="size-5 stroke-[2.5px]" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-1">
                {/* Prominent Collaborator Slot */}
                <div className="flex items-center gap-2 group/collab transition-all">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Collaborators</span>
                  <div className="flex items-center gap-2">
                    {transaction?.collaborators && transaction.collaborators.length > 0 ? (
                      <CollaboratorAvatarStack 
                        collaborators={transaction.collaborators}
                        onManage={() => setIsAssignModalOpen(true)}
                      />
                    ) : (
                      <span className="text-[13px] font-bold text-slate-300 italic tracking-tight">Not assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="flex flex-col items-end gap-3 shrink-0">
                {/* Status Badge */}
                <Badge className="bg-[#FEF9C3] hover:bg-[#FEF9C3] text-[#854D0E] border-none px-4 py-3 rounded-full font-black text-[12px] flex items-center gap-2 shadow-sm transition-all cursor-pointer group/badge">
                  <div className="size-2 rounded-full bg-[#EAB308] animate-pulse" />
                  PENDING 
                  <ChevronDown className="size-4 opacity-40 group-hover/badge:translate-y-0.5 transition-transform" />
                </Badge>

                {/* Toggle Switch */}
                <div className="flex items-center gap-4 bg-[#F8FAFC]/50 px-4 py-2.5 rounded-full border border-slate-100 group/toggle cursor-pointer hover:border-[#5A5FF2]/20 transition-all">
                  <span className="text-[14px] font-black text-[#373758] tracking-tight">Accepted Contract</span>
                  <div className="w-11 h-6 bg-slate-200 rounded-full relative transition-colors group-hover/toggle:bg-slate-300">
                    <div className="absolute left-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-50" />

          {/* Bottom Grid Section */}
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-6 bg-slate-50/20">
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Agent</span>
              <p className="text-[15px] font-black text-[#111827]">{transaction.agentName}</p>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Co-agent</span>
              <p className="text-[15px] font-black text-[#111827]">John Peterson</p>
            </div>

            {/* Collaborator Column - Clean Grid View */}
            <div className="space-y-3 min-w-[180px]">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Collaborators</span>
              <CollaboratorAvatarStack 
                collaborators={transaction.collaborators}
                onManage={() => setIsAssignModalOpen(true)}
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Buyer</span>
              <p className="text-[15px] font-black text-[#111827]">{transaction.clientName}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Seller</span>
              <p className="text-[15px] font-black text-[#111827]">David Wilson</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Acceptance Date</span>
              <p className="text-[15px] font-black text-[#111827]">{transaction.acceptanceDate || '01/15/2025'}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Closing Date</span>
              <p className="text-[15px] font-black text-[#111827]">{transaction.closeOfEscrow || '02/28/2025'}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Gross Commission</span>
              <p className="text-[15px] font-black text-emerald-600 tracking-tight">$26,250</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Representation</span>
              <Badge className="bg-[#EFF6FF] text-[#1E40AF] border-none font-bold text-[11px] rounded-lg">Buyer</Badge>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Checklist Type</span>
              <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[11px] rounded-lg">Residential Purchase</Badge>
            </div>

            <div className="col-span-1 lg:col-span-full flex justify-end gap-3 mt-4">
               <Button variant="outline" className="rounded-full border-[#E2E8F0] px-6 h-11 text-[14px] font-black text-slate-600 gap-2">
                 <Mail className="size-4" /> Comments
               </Button>
               <Button className="rounded-full bg-[#5A5FF2] hover:bg-[#4B50D9] text-white px-8 h-11 text-[14px] font-black gap-2 shadow-lg shadow-[#5A5FF2]/20">
                 <Edit2 className="size-4" /> Edit
               </Button>
            </div>
          </div>
        </div>

        {/* Tabs & Content Area */}
        <div className="space-y-6">
          <div className="flex p-1 bg-white border border-[#E0E7FF] rounded-[24px] w-fit shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-3 rounded-full text-[14px] font-black transition-all flex items-center gap-2",
                  activeTab === tab
                    ? "bg-[#5A5FF2] text-white shadow-lg shadow-[#5A5FF2]/20"
                    : "text-slate-500 hover:text-[#5A5FF2] hover:bg-slate-50"
                )}
              >
                {tab}
                {tab === "Document preparation" && (
                  <Badge className={cn(
                    "rounded-full h-5 min-w-5 flex items-center justify-center p-1 text-[10px] font-black ml-1",
                    activeTab === tab ? "bg-white/20 text-white" : "bg-[#5A5FF2]/10 text-[#5A5FF2]"
                  )}>3</Badge>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recommended Forms */}
            <div className="bg-white border border-[#EFEFEF] rounded-[32px] p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-black text-[#111827] flex items-center gap-3 uppercase italic tracking-tight">
                  Recommended Forms
                  <div className="h-px w-20 bg-slate-100" />
                </h3>
                <Button variant="ghost" className="text-[#5A5FF2] font-black gap-2 hover:bg-[#5A5FF2]/5 rounded-xl">
                  <Plus className="size-4 stroke-[3px]" /> Add documents <ChevronDown className="size-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded border-2 border-slate-200" />
                  <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Select all</span>
                </div>
                <div className="flex items-center gap-6">
                  <button className="text-[12px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 opacity-30 cursor-not-allowed">Delete</button>
                  <button className="text-[12px] font-black text-[#5A5FF2] uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-4">
                    Download
                  </button>
                </div>
              </div>

              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-5 rounded-[24px] border border-slate-50 hover:border-[#5A5FF2]/20 hover:bg-slate-50/30 transition-all cursor-pointer group">
                  <div className="size-5 rounded border-2 border-slate-200 mt-1 shrink-0 group-hover:border-[#5A5FF2]/40 transition-colors" />
                  <div className="flex flex-col gap-4 flex-1">
                    <p className="text-[14px] font-bold text-[#111827] leading-relaxed group-hover:text-[#5A5FF2] transition-colors line-clamp-2">
                      {i === 0 && "RPA_Residential Purchase Agreement (Rev 12/24)/Tenant Permission to Access Property_Referral Agreement"}
                      {i === 1 && "AAA_Additional Agent Acknowledgement/Tenant Permission to Access Property_Referral Agreement"}
                      {i === 2 && "FVAC_FHA VA Amendatory Clause and Tenant Permission to Access Property_Referral Agreement"}
                    </p>
                    <Button variant="outline" className="w-fit h-9 rounded-full bg-emerald-50 border-emerald-100 text-emerald-600 font-black text-[11px] gap-2 px-4 shadow-sm group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                      <div className="size-1.5 rounded-full bg-emerald-500 group-hover:bg-white animate-pulse" />
                      View <ChevronRight className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button className="w-full h-14 rounded-[16px] bg-slate-100 text-slate-400 font-black text-[15px] cursor-not-allowed uppercase shadow-none border-none">
                Create & send envelope
              </Button>
            </div>

            {/* Envelopes */}
            <div className="bg-white border border-[#EFEFEF] rounded-[32px] p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-black text-[#111827] flex items-center gap-3 uppercase italic tracking-tight">
                  Envelopes
                  <div className="h-px w-20 bg-slate-100" />
                </h3>
                <Button variant="ghost" className="text-[#5A5FF2] font-black gap-2 hover:bg-[#5A5FF2]/5 rounded-xl">
                  <Plus className="size-4 stroke-[3px]" /> Add pre-signed paperwork <ChevronDown className="size-4" />
                </Button>
              </div>

              <div className="border border-slate-100 rounded-[28px] overflow-hidden">
                <div className="flex items-center justify-between p-6 bg-amber-50/50 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-white flex items-center justify-center border border-amber-200 shadow-sm">
                      <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <span className="text-[15px] font-black text-amber-700 tracking-tight">In-progress envelopes</span>
                  </div>
                  <ChevronDown className="size-5 text-amber-300" />
                </div>
                
                <div className="p-16 flex flex-col items-center justify-center text-center gap-6 bg-white relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                  <div className="size-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 relative z-10 shadow-inner">
                    <FileText className="size-10 opacity-60" />
                  </div>
                  <div className="flex flex-col gap-1 relative z-10">
                    <p className="text-[18px] font-black text-[#373758] tracking-tight">No Envelopes created yet</p>
                    <p className="text-slate-400 font-medium max-w-[240px]">Start by adding documents from the library to build your first envelope.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssignCollaboratorModal 
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={handleAssign}
        onOpenInvite={() => toast.info("Opening invite...")}
        globalPool={INITIAL_COLLABORATORS.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.type.toUpperCase() as any,
          type: c.type,
          status: 'active'
        }))}
        clientName={transaction.address}
        defaultType="transaction"
        defaultTransactionId={transaction.id}
        context="transaction-detail"
      />
    </div>
  )
}
