import * as React from "react"
import {
  Plus,
  ChevronDown,
  Bell,
  Search,
  Filter,
  Download,
  Trash2,
  Info,
  Clock,
  Home,
  User,
  ArrowUpRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { toast } from "sonner"
import { Transaction } from "../types"
import { AssignCollaboratorModal } from "../../Clients/components/AssignCollaboratorModal"
import { INITIAL_COLLABORATORS } from "../../TeamSettings/collaborators/mockData"
import { TransactionDetailSidePanel } from "./TransactionDetailSidePanel"
import { CreateTransactionWizard } from "./CreateTransactionWizard"
import { InviteCollaboratorModal } from "../../TeamSettings/collaborators/components/InviteCollaboratorModal"
import { ManageCollaboratorsModal } from "../../Clients/components/ManageCollaboratorsModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { MoreHorizontal, Settings } from "lucide-react"
import { TypeBadge } from "../../TeamSettings/collaborators/components/badges/TypeBadge"

import { GLOBAL_COLLABORATOR_POOL, MOCK_ASSIGNMENTS } from "../../Clients/mockData"
import { ClientDetailSidePanel } from "../../Clients/components/ClientDetailSidePanel"
import { useRole } from "@/contexts/RoleContext"

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    address: "123 Elm St, Austin, 2nd street",
    addressLine2: "San Francisco, CA",
    clientType: "Buyer",
    clientName: "Jessica Taylor",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Pending signature",
    agentName: "Jessica Taylor",
    acceptanceDate: "April 6, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "April 6, 2024",
    collaborators: [
      { id: "c1", name: "Sarah Johnson", role: "T.C." },
      { id: "c2", name: "Robert Martinez", role: "Lender" }
    ]
  },
  {
    id: "t2",
    address: "456 Castro Avenue",
    addressLine2: "Denver, CO",
    clientType: "Seller",
    clientName: "Sophia Brown",
    subClientName: "Sophia Brown",
    purchasePrice: 980000,
    status: "Listing Prepped",
    agentName: "Any Williams",
    acceptanceDate: "-",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "-",
    collaborators: [
      { id: "c1", name: "Sarah Johnson", role: "T.C." }
    ]
  },
  {
    id: "tx-3",
    address: "456 Maple Ave, 5th avenue",
    addressLine2: "Los Angeles, CA",
    clientType: "Landlord",
    clientName: "Emily Davis",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Pending signature",
    agentName: "Jessica Taylor",
    acceptanceDate: "-",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "-",
    collaborators: []
  },
  {
    id: "tx-4",
    address: "987 Birch Ln, Ocean view",
    addressLine2: "Phoenix, AZ",
    clientType: "Tenant",
    clientName: "Michael Johnson",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Pending signature",
    agentName: "Jessica Taylor",
    acceptanceDate: "April 7, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "April 7, 2024",
    collaborators: [
      { id: "c1", name: "Sarah Johnson", role: "T.C." }
    ]
  }
];




export function TransactionsPage() {
  const [activeTab, setActiveTab] = React.useState("All")
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false)
  const [isCreateWizardOpen, setIsCreateWizardOpen] = React.useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false)
  const [isClientDetailOpen, setIsClientDetailOpen] = React.useState(false)
  const [selectedTxId, setSelectedTxId] = React.useState<string | undefined>()
  const [selectedTx, setSelectedTx] = React.useState<Transaction | undefined>()
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [selectedClient] = React.useState<any>(null)
  const [transactions, setTransactions] = React.useState(mockTransactions)
  const [localAssignments, setLocalAssignments] = React.useState<any[]>(MOCK_ASSIGNMENTS)

  const { isCollaborator, selectedTransaction, canInvite } = useRole()

  const displayedTransactions = React.useMemo(() => {
    if (isCollaborator && selectedTransaction) {
      return transactions.filter(t => t.id === selectedTransaction.id)
    }
    return transactions
  }, [transactions, isCollaborator, selectedTransaction])

  const tableTabs = isCollaborator
    ? ["All", "Active Listings", "Pending", "Closing Soon", "My Closed (YTD)"].filter(t => t !== "Referrals")
    : ["All", "Active Listings", "Pending", "Closing Soon", "My Closed (YTD)", "Referrals"]

  const getClientTypeIcon = (type: Transaction['clientType']) => {
    switch (type) {
      case 'Buyer': return <User className="size-3 text-blue-500" />;
      case 'Seller': return <Home className="size-3 text-emerald-500" />;
      case 'Landlord': return <Home className="size-3 text-orange-500" />;
      case 'Tenant': return <User className="size-3 text-purple-500" />;
      case 'Referral': return <ArrowUpRight className="size-3 text-rose-500" />;
      default: return null;
    }
  }

  const getClientTypeStyles = (type: Transaction['clientType']) => {
    switch (type) {
      case 'Buyer': return "bg-[#eff8fe] text-[#0c4a6e] border-[#0c4a6e]/10";
      case 'Seller': return "bg-[#f0fdf4] text-[#134e4a] border-[#134e4a]/10";
      case 'Landlord': return "bg-[#f0fdfa] text-[#365314] border-[#365314]/10";
      case 'Tenant': return "bg-[#f5f3ff] text-[#4c1d95] border-[#4c1d95]/10";
      case 'Referral': return "bg-[#ffe4e6] text-[#881337] border-[#881337]/10";
      default: return "";
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-white relative h-[calc(100vh-64px)] overflow-hidden font-sans">
      {/* View Header */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#EFEFEF]">
        <h1 className="text-[28px] font-bold text-[#111827]">My Transactions</h1>
        <div className="flex items-center gap-3">
          {!isCollaborator && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                onClick={() => setIsCreateWizardOpen(true)}
                className="h-10 rounded-full bg-[#5A5FF2] border-[#5A5FF2] text-white hover:bg-[#4d52e0] hover:shadow-lg hover:shadow-[#5A5FF2]/30 transition-all shadow-md shadow-[#5A5FF2]/20 font-bold px-6 border-none"
              >
                <Plus className="size-4 stroke-[3px]" /> Transaction
              </Button>
            </motion.div>
          )}
          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-50 relative">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-10">
        {/* Statistics & Signing Queue (already implemented, keeping but ensuring parity) */}
        <div className="p-8 pb-4 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-[#5A5FF2] text-white px-4 py-1.5 rounded-full font-bold">My Overview</Badge>
            <Badge variant="slate" className="text-slate-400 px-4 py-1.5 rounded-full font-bold hover:bg-slate-50 cursor-pointer transition-all">Team's Overview</Badge>
          </div>

          <div className="grid grid-cols-5 gap-4 h-[120px]">
            <div className="col-span-4 grid grid-cols-4 gap-4">
              {[
                { label: "Active Listings", value: "100", color: "text-[#5A5FF2]", bg: "bg-[#EEF2FF]/50", border: "border-[#5A5FF2]/20" },
                { label: "Pending Transactions", value: "5", color: "text-[#10B981]", bg: "bg-[#F0FDF4]/50", border: "border-[#10B981]/20" },
                { label: "Closed Transactions(YTD)", value: "20", color: "text-[#EF4444]", bg: "bg-[#FEF2F2]/50", border: "border-[#EF4444]/20" },
                { label: "Earnings (YTD)", value: "$100,000", color: "text-[#0EA5E9]", bg: "bg-[#F0F9FF]/50", border: "border-[#0EA5E9]/20" },
              ].map((stat, i) => (
                <div key={i} className={cn("p-5 rounded-[24px] border flex flex-col justify-between transition-all hover:scale-[1.02]", stat.bg, stat.border)}>
                  <span className={cn("text-[11px] font-bold uppercase tracking-wider", stat.color)}>{stat.label}</span>
                  <span className={cn("text-[28px] font-black tracking-tight", stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Progress to Cap</p>
              <div className="space-y-1">
                <p className="text-[16px] font-black text-[#111827]">$250/$25,000</p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '30%' }} />
                </div>
                <p className="text-[9px] font-bold text-slate-400 text-right">30% achieved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="mt-6 px-8 flex flex-col">
          {/* Tab Bar - Exact Figma Style */}
          <div className="flex border border-[#c7d2fe] rounded-[24px] p-1 bg-white mb-6 w-fit">
            {tableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-full text-[13px] font-bold transition-all relative flex items-center gap-2",
                  activeTab === tab
                    ? "bg-[#5A5FF2] text-white shadow-md shadow-[#5A5FF2]/20"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {tab}
                {tab === "Closing Soon" && <Info className="size-3.5 opacity-60" />}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative max-w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by address or client name"
                className="pl-11 h-10 bg-[#f3f4f6]/50 border-none rounded-full text-[14px]"
              />
            </div>

            <Button variant="outline" className="h-10 rounded-full bg-[#f3f4f6]/50 border-none px-5 gap-2 text-[#374151] font-medium text-[14px]">
              Client Type: All <ChevronDown className="size-4" />
            </Button>

            <Button variant="outline" className="h-10 rounded-full bg-[#f3f4f6]/50 border-none px-5 gap-2 text-[#374151] font-medium text-[14px]">
              Status <ChevronDown className="size-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-10 w-10 bg-[#eef2ff] text-[#5A5FF2] rounded-full hover:bg-[#e0e7ff] transition-all">
              <Filter className="size-4" />
            </Button>

            <Button variant="outline" className="h-10 rounded-full bg-[#eef2ff] border-[#e0e7ff] px-6 gap-2 text-[#5A5FF2] font-semibold text-[13px] shadow-sm">
              <Download className="size-4" /> Export
            </Button>

            <button className="text-[#EF4444] text-[14px] font-medium px-4 hover:underline">Clear all</button>
          </div>

          {/* Heritage Bulk Selection Bar */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="flex items-center justify-between bg-[#171717] rounded-[30px] p-3 shadow-2xl ring-1 ring-white/10 mb-6"
              >
                <div className="flex items-center gap-4 pl-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center size-7 rounded-full bg-[#5A5FF2] text-white text-[13px] font-black shadow-lg shadow-[#5A5FF2]/30">
                      {selectedIds.length}
                    </span>
                    <span className="text-[14px] font-black text-white uppercase tracking-widest">
                      Transactions Selected
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <button 
                    onClick={() => setSelectedIds([])}
                    className="text-[12px] font-bold text-white/50 hover:text-white transition-colors uppercase tracking-[0.1em]"
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="flex items-center gap-3 pr-1">
                  <Button 
                    onClick={() => {
                      setSelectedTxId(selectedIds[0]); // Default to first selected for management context
                      setIsAssignModalOpen(true);
                    }}
                    className="bg-[#5A5FF2] hover:bg-[#4B50D9] text-white rounded-[30px] px-8 h-12 font-black text-[14px] gap-3 shadow-xl shadow-[#5A5FF2]/20 border-none active:scale-95 transition-all group/bulk-btn"
                  >
                    <Plus className="size-5 stroke-[4px] group-hover:rotate-90 transition-transform" />
                    Assign Collaborator
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data Table */}
          <div className="border border-slate-100 rounded-[12px] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="hover:bg-transparent border-b border-slate-100 h-10">
                  <TableHead className="w-12 pl-6">
                    <Checkbox 
                      checked={selectedIds.length === displayedTransactions.length && displayedTransactions.length > 0}
                      onCheckedChange={() => {
                        if (selectedIds.length === displayedTransactions.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(displayedTransactions.map(t => t.id));
                        }
                      }}
                      className="border-slate-300 data-[state=checked]:bg-[#5A5FF2] data-[state=checked]:border-[#5A5FF2]"
                    />
                  </TableHead>
                  <TableHead className="pl-0 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Property Address <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client Type <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client Name <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Purchase Price <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Agent Name <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Collaborators <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">Acceptance Date <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Last updated <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">Close Of Escrow <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Delete</TableHead>
                   </TableRow >
                </TableHeader >
    <TableBody>
      {displayedTransactions.map((tx) => (
        <TableRow
          key={tx.id}
          className="group h-[50px] border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer"
          onClick={() => {
            setSelectedTx(tx);
            setIsSidePanelOpen(true);
          }}
        >
          <TableCell className="pl-6 w-12" onClick={(e) => e.stopPropagation()}>
            <Checkbox 
              checked={selectedIds.includes(tx.id)}
              onCheckedChange={() => {
                setSelectedIds(prev => 
                  prev.includes(tx.id) ? prev.filter(id => id !== tx.id) : [...prev, tx.id]
                );
              }}
              className="border-slate-300 data-[state=checked]:bg-[#5A5FF2] data-[state=checked]:border-[#5A5FF2]"
            />
          </TableCell>
          <TableCell className="pl-0 py-3">
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[#5a5ff2] underline leading-tight decoration-[#5a5ff2]/30 hover:decoration-[#5a5ff2] truncate max-w-[200px]">{tx.address}</span>
              {tx.addressLine2 && <span className="text-[11px] text-[#5a5ff2] underline decoration-[#5a5ff2]/30 hover:decoration-[#5a5ff2]">{tx.addressLine2}</span>}
            </div>
          </TableCell>
          <TableCell>
            <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium", getClientTypeStyles(tx.clientType))}>
              {getClientTypeIcon(tx.clientType)}
              {tx.clientType}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#1f2937] leading-tight">{tx.clientName}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-slate-400 font-medium">{tx.subClientName}</span>
                <Badge className="bg-[#f5f3ff] text-[#8b5cf6] border-none text-[8.5px] scale-90 px-1.5 py-0 rounded-full font-bold">+2 more</Badge>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-[13px] font-semibold text-[#1f2937]">
            ${tx.purchasePrice.toLocaleString()}
          </TableCell>
          <TableCell>
            <div className="inline-flex items-center gap-1.5 bg-[#FEF4E6] text-[#E18308] px-3 py-1 rounded-full text-[10px] font-bold">
              <Clock className="size-3" />
              {tx.status}
            </div>
          </TableCell>
                          <TableCell>
                             <div className="flex flex-col">
                                <span className="text-[13px] font-semibold text-[#1f2937] leading-tight">{tx.agentName}</span>
                                <span className="text-[11px] text-slate-400 font-medium tracking-wide border-b border-dotted border-slate-200 w-fit">Primary Agent</span>
                             </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-2 min-w-[200px] max-w-[320px] py-1">
                              {tx.collaborators.slice(0, 2).map((collab, idx, arr) => {
                                const poolCollab = GLOBAL_COLLABORATOR_POOL.find(c => c.name === collab.name);
                                return (
                                  <div key={collab.id} className="flex items-center gap-2 group/collab transition-colors cursor-pointer w-fit" onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTx(tx);
                                      setIsManageModalOpen(true);
                                  }}>
                                    <Avatar className="h-6 w-6">
                                      {poolCollab?.avatar && <AvatarImage src={poolCollab.avatar} />}
                                      <AvatarFallback className="text-[10px] bg-[#5A5FF2]/10 text-[#5A5FF2]">{collab.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-[13px] font-black text-[#373758] truncate leading-none max-w-[130px] group-hover/collab:text-[#5A5FF2] transition-colors">{collab.name}</span>
                                    {poolCollab && <TypeBadge type={poolCollab.type as any} className="h-[14px] px-1.5 text-[8px]" />}
                                    
                                    {idx === arr.length - 1 && tx.collaborators.length > 2 && (
                                      <div className="flex items-center gap-1 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5A5FF2] px-2 py-0.5 rounded-full transition-colors ml-1">
                                        <span className="text-[11px] font-bold">+{tx.collaborators.length - 2}</span>
                                        <ChevronRight className="h-3 w-3 opacity-80" />
                                      </div>
                                    )}
                                    {idx === arr.length - 1 && tx.collaborators.length <= 2 && (
                                      <div className="flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 text-[#5A5FF2] transition-colors ml-1">
                                        <ChevronRight className="h-4 w-4" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                              {tx.collaborators.length === 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTx(tx);
                                    setIsManageModalOpen(true);
                                  }}
                                  className="text-[13px] font-bold text-[#5A5FF2] underline underline-offset-2 leading-none hover:text-[#4B50D9] transition-colors w-fit"
                                >
                                  Assign
                                </button>
                              )}
                            </div>
                          </TableCell>
                         <TableCell className="text-[12px] text-[#1f2937] font-medium">
                            {tx.acceptanceDate}
                         </TableCell>
                         <TableCell className="text-[11px] text-slate-400 leading-tight">
                            {tx.lastUpdated.split('\n')[0]}<br/>
                            {tx.lastUpdated.split('\n')[1]}
                         </TableCell>
                         <TableCell className="text-[12px] text-[#1f2937] font-medium whitespace-nowrap">
                            {tx.closeOfEscrow}
                         </TableCell>
                         <TableCell className="text-center">
                            <button className="p-2 text-slate-200 hover:text-red-400 transition-colors">
                              <Trash2 className="size-4" />
                            </button>
                         </TableCell>
                      </TableRow >
                   ))
}
                </TableBody >
             </Table >
           </div >
        </div >
      </div >

  { selectedTx && (
    <TransactionDetailSidePanel
      transaction={selectedTx}
      isOpen={isSidePanelOpen}
      onClose={() => setIsSidePanelOpen(false)}
    />
  )}

{
  selectedClient && (
    <ClientDetailSidePanel
      client={selectedClient}
      isOpen={isClientDetailOpen}
      onClose={() => setIsClientDetailOpen(false)}
      collaborators={INITIAL_COLLABORATORS.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        role: c.type.toUpperCase() as any,
        type: c.type,
        status: 'active' as const
      }))}
      initialTab="Transactions"
    />
  )
}

      <AssignCollaboratorModal 
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={(collabId, _type, txnId) => {
          const collab = INITIAL_COLLABORATORS.find(c => c.id === collabId);
          if (collab) {
            setTransactions(prev => prev.map(t => {
              if (t.id === (txnId || selectedTxId)) {
                return {
                  ...t,
                  collaborators: [...t.collaborators, {
                    id: collab.id,
                    name: collab.name,
                    role: collab.type.toUpperCase(),
                    status: 'active'
                  }]
                }
              }
              return t;
            }));
            toast.success("Assignment Confirmed", {
              description: `Collaborator assigned to Transaction Level access.`,
              className: "bg-[#5A5FF2] text-white",
            });
          }
          setIsAssignModalOpen(false);
        }}
        onOpenInvite={() => toast.info("Opening invite...")}
        globalPool={INITIAL_COLLABORATORS.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.type.toUpperCase() as any,
          type: c.type,
          status: 'active'
        }))}
        transactions={transactions.map(t => ({ 
          id: t.id, 
          clientId: 'client-1',
          address: t.address, 
          status: 'Active' as any
        }))}
        clientName="Transaction Portal"
        defaultType="transaction"
        defaultTransactionId={selectedTxId}
        canInvite={canInvite}
      />
      <CreateTransactionWizard 
        open={isCreateWizardOpen}
        onOpenChange={setIsCreateWizardOpen}
      />

{
  selectedTx && (
    <ManageCollaboratorsModal
      open={isManageModalOpen}
      onOpenChange={setIsManageModalOpen}
      contextType="transaction"
      client={{ id: selectedTx.id, name: selectedTx.address }}
      assignedCollabs={GLOBAL_COLLABORATOR_POOL.filter(c =>
        selectedTx.collaborators.some(ac => ac.name === c.name) // Matching by name in mock
      )}
      assignments={localAssignments}
      globalPool={GLOBAL_COLLABORATOR_POOL}
      transactions={transactions.map(t => ({
        id: t.id,
        clientId: 'client-1',
        address: t.address,
        status: 'Active' as any
      }))}
      onRemove={(id) => {
        const collab = GLOBAL_COLLABORATOR_POOL.find(c => c.id === id);
        if (collab) {
          setTransactions(prev => prev.map(t => t.id === selectedTx.id ? { ...t, collaborators: t.collaborators.filter(c => c.name !== collab.name) } : t));
        }
      }}
      onRemoveAll={() => {
        setTransactions(prev => prev.map(t => t.id === selectedTx.id ? { ...t, collaborators: [] } : t));
        setIsManageModalOpen(false);
      }}
      onUpdateAccess={(_id, newType) => {
        if (newType === 'client') {
            toast.success("Access Level Updated", {
                description: `Collaborator upgraded to Client Level access.`,
                className: "bg-[#5A5FF2] text-white",
            });
        }
      }}
      onAssign={(collabId, type, txnIds) => {
        const ids = txnIds || [selectedTx.id];
        const collab = GLOBAL_COLLABORATOR_POOL.find(c => collabId === c.id);
        
        if (collab) {
          // Update transactions for the table view
          setTransactions(prev => prev.map(t => ids.includes(t.id) ? { ...t, collaborators: [...t.collaborators, { id: collab.id, name: collab.name, role: collab.type.toUpperCase(), status: 'active' }] } : t));
          
          // Update assignments for the modal view
          setLocalAssignments(prev => [
            ...prev,
            ...ids.map(tid => ({
              id: `a-${Date.now()}-${tid}`,
              clientId: '1',
              collaboratorId: collabId,
              transactionId: tid,
              assignmentType: type,
              assignedAt: new Date().toISOString()
            }))
          ]);
        }
      }}
      onOpenInvite={() => setIsInviteModalOpen(true)}
    />
  )
}

<InviteCollaboratorModal
  open={isInviteModalOpen}
  onOpenChange={setIsInviteModalOpen}
  onInviteSent={(data) => {
    toast.success("Invitation Sent", {
      description: `Collaborator ${data.firstName} ${data.lastName} invited.`
    });
  }}
  existingEmails={INITIAL_COLLABORATORS.map(c => c.email)}
/>
    </div >
  )
}
