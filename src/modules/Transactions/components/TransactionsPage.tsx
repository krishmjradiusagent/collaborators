import * as React from "react"
import { 
  Plus, 
  ChevronDown, 
  Bell, 
  ArrowUpRight, 
  Search,
  Filter,
  Download,
  Trash2,
  Home,
  User,
  Info,
  Clock,
  ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
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
import { useRole } from "../../../contexts/RoleContext"

import { MOCK_CLIENTS } from "../../Clients/mockData"
import { ClientDetailSidePanel } from "../../Clients/components/ClientDetailSidePanel"

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    address: "123 Mission St",
    addressLine2: "San Francisco, CA",
    clientType: "Buyer",
    clientName: "Jessica Taylor",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Pending signature",
    agentName: "Sarah Chen",
    acceptanceDate: "April 6, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "April 6, 2024",
    collaborators: [
      { id: "c-1", name: "Sarah Miller", role: "T.C.", status: "active" },
      { id: "c-2", name: "Robert Fox", role: "Lender", status: "active" },
      { id: "c-3", name: "Jessica Taylor", role: "Co-Agent", status: "invited", invitationExpiry: "EXP 7D" }
    ]
  },
  {
    id: "tx-2",
    address: "456 Castro Ave",
    addressLine2: "Denver, CO",
    clientType: "Seller",
    clientName: "Sophia Brown",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Pending signature",
    agentName: "Michael Ross",
    acceptanceDate: "-",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "-",
    collaborators: [
      { id: "c-1", name: "Sarah Miller", role: "T.C.", status: "active" },
      { id: "c-4", name: "Emily Davis", role: "Assistant", status: "active" }
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
    agentName: "Sarah Chen",
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
    agentName: "Michael Ross",
    acceptanceDate: "April 7, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "April 7, 2024",
    collaborators: [
      { id: "c-1", name: "Sarah Miller", role: "T.C.", status: "active" }
    ]
  }
];

import { motion } from "framer-motion"
import { CreateTransactionWizard } from "./CreateTransactionWizard"
import { InviteCollaboratorModal } from "../../TeamSettings/collaborators/components/InviteCollaboratorModal"

export function TransactionsPage() {
  const { role, activeContext, activeTeam } = useRole()
  const [activeTab, setActiveTab] = React.useState("All")
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isCreateWizardOpen, setIsCreateWizardOpen] = React.useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false)
  const [isClientDetailOpen, setIsClientDetailOpen] = React.useState(false)
  const [selectedTxId, setSelectedTxId] = React.useState<string | undefined>()
  const [selectedTx, setSelectedTx] = React.useState<Transaction | undefined>()
  const [selectedClient, setSelectedClient] = React.useState<any>(null)

  const isCollaborator = ['TC/VA', 'Lender', 'Vendor'].includes(role)

  const filteredTransactions = React.useMemo(() => {
    if (!activeContext) return mockTransactions
    if (activeContext.type === 'transaction') {
      return mockTransactions.filter(t => t.id === activeContext.id || t.address.includes(activeContext.name))
    }
    if (activeContext.type === 'agent') {
      return mockTransactions.filter(t => t.agentName === activeContext.name)
    }
    return mockTransactions
  }, [activeContext])

  const handleOpenClientProfile = (tx: Transaction) => {
    const client = MOCK_CLIENTS.find(c => c.name === tx.clientName) || MOCK_CLIENTS[0];
    setSelectedClient(client);
    setIsClientDetailOpen(true);
  };

  const tableTabs = isCollaborator 
    ? ["All", "Active Listings", "Pending"] 
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
        <div className="flex flex-col">
          <h1 className="text-[28px] font-black text-[#111827] tracking-tight">
            {isCollaborator ? "Your Transactions" : "My Transactions"}
          </h1>
          {isCollaborator && (
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.05em]">Mirror CRM Perspective</p>
          )}
        </div>
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
        {/* Statistics & Overview Section */}
        <div className="p-8 pb-4 space-y-6">
           <div className="flex items-center gap-2 mb-4">
              <Badge 
                className="text-white px-4 py-1.5 rounded-full font-bold border-none"
                style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
              >
                {activeContext?.name} OVERVIEW
              </Badge>
              {!isCollaborator && (
                <Badge variant="slate" className="text-slate-400 px-4 py-1.5 rounded-full font-bold hover:bg-slate-50 cursor-pointer transition-all">Team's Overview</Badge>
              )}
           </div>
           
           <div className="grid grid-cols-5 gap-4 h-[120px]">
              <div className={cn(isCollaborator ? "col-span-5" : "col-span-4", "grid gap-4")} style={{ gridTemplateColumns: isCollaborator ? "repeat(2, 1fr)" : "repeat(4, 1fr)" }}>
                 {[
                   { label: "Active Transactions", value: filteredTransactions.length.toString(), color: "text-[#171717]", bg: "bg-slate-50", border: "border-slate-100" },
                   { label: "Pending Signatures", value: "2", color: "text-[#5A5FF2]", bg: "bg-[#5A5FF2]/5", border: "border-[#5A5FF2]/10" },
                   ...(!isCollaborator ? [
                     { label: "Closed YTD", value: "20", color: "text-[#EF4444]", bg: "bg-[#FEF2F2]/50", border: "border-[#EF4444]/20" },
                     { label: "Earnings YTD", value: "$100,000", color: "text-[#0EA5E9]", bg: "bg-[#F0F9FF]/50", border: "border-[#0EA5E9]/20" }
                   ] : [])
                 ].map((stat, i) => (
                   <div key={i} className={cn("p-5 rounded-[24px] border flex flex-col justify-between transition-all hover:scale-[1.02]", stat.bg, stat.border)}>
                     <span className={cn("text-[11px] font-black uppercase tracking-widest leading-none", stat.color === "text-[#171717]" ? "text-slate-400" : stat.color)}>{stat.label}</span>
                     <span className={cn("text-[28px] font-black tracking-tighter leading-none mt-2", stat.color)}>{stat.value}</span>
                   </div>
                 ))}
              </div>
              {!isCollaborator && (
                <div className="p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Progress to Cap</p>
                   <div className="space-y-1">
                      <p className="text-[16px] font-black text-[#111827]">$250/$25,000</p>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full">
                         <div 
                           className="h-full rounded-full" 
                           style={{ width: '30%', backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }} 
                         />
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 text-right">30% achieved</p>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Filters and Table Section */}
        <div className="mt-6 px-8 flex flex-col">
           {/* Tab Bar - Exact Figma Style */}
           <div className="flex border border-slate-100 rounded-[28px] p-1.5 bg-white mb-6 w-fit shadow-sm">
              {tableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[13px] font-black transition-all relative flex items-center gap-2",
                    activeTab === tab 
                      ? "text-white shadow-xl" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                  style={activeTab === tab ? { backgroundColor: activeTeam?.primaryColor || "#5A5FF2" } : {}}
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
                  placeholder="Search context..." 
                  className="pl-11 h-12 bg-slate-50 border-none rounded-2xl text-[14px] font-medium"
                />
              </div>
              
              <Button variant="outline" className="h-12 rounded-2xl bg-white border-slate-100 px-6 gap-2 text-[#374151] font-bold text-[13px] shadow-sm">
                 Type: All <ChevronDown className="size-4 text-slate-300" />
              </Button>
              
              <Button variant="outline" className="h-12 rounded-2xl bg-white border-slate-100 px-6 gap-2 text-[#374151] font-bold text-[13px] shadow-sm">
                 Status <ChevronDown className="size-4 text-slate-300" />
              </Button>

              <Button variant="ghost" size="icon" className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                <Filter className="size-5" />
              </Button>

              {!isCollaborator && (
                <Button variant="outline" className="h-12 rounded-2xl bg-white border-slate-100 px-6 gap-2 text-slate-900 font-bold text-[13px] shadow-sm">
                  <Download className="size-4" /> Export Data
                </Button>
              )}

              <button className="text-slate-300 text-[13px] font-bold px-4 hover:text-[#EF4444] transition-colors">{isCollaborator ? "REFRESH" : "CLEAR ALL"}</button>
           </div>

           {/* Permission Warning for Mirror View */}
           {isCollaborator && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                 <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <ShieldAlert className="size-5 text-amber-600" />
                 </div>
                 <div>
                    <p className="text-[14px] font-black text-amber-900 leading-none mb-1">Restricted Access Enabled</p>
                    <p className="text-[12px] text-amber-700 font-bold opacity-80">You are currently viewing data limited to your active assignments. Sensitive financial indicators and management tools are hidden.</p>
                 </div>
              </div>
           )}

           {/* Data Table */}
           <div className="border border-slate-100 rounded-[28px] overflow-hidden shadow-sm shadow-slate-200/40">
             <Table>
                <TableHeader className="bg-slate-50">
                   <TableRow className="hover:bg-transparent border-b border-slate-100 h-14">
                      <TableHead className="pl-8 text-[11px] uppercase font-black text-slate-400 tracking-widest">Transaction Address <ChevronDown className="size-3 inline-block ml-1 opacity-50" /></TableHead>
                      <TableHead className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Client Type</TableHead>
                      <TableHead className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Primary Client</TableHead>
                      <TableHead className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Transaction Value</TableHead>
                      <TableHead className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Stage</TableHead>
                      <TableHead className="text-[11px] uppercase font-black text-slate-400 tracking-widest">{isCollaborator ? "Manager" : "Collaborators"}</TableHead>
                      {!isCollaborator && <TableHead className="text-[11px] uppercase font-black text-slate-400 tracking-widest whitespace-nowrap text-center">Delete</TableHead>}
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {filteredTransactions.map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        className="group h-[80px] border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedTx(tx);
                          setIsSidePanelOpen(true);
                        }}
                      >
                         <TableCell className="pl-8 py-3">
                           <div className="flex flex-col">
                              <span className="text-[15px] font-black text-[#171717] leading-tight group-hover:text-[#5A5FF2] transition-colors">{tx.address}</span>
                              {tx.addressLine2 && <span className="text-[12px] text-slate-400 font-bold">{tx.addressLine2}</span>}
                           </div>
                         </TableCell>
                         <TableCell>
                            <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight", getClientTypeStyles(tx.clientType))}>
                               {getClientTypeIcon(tx.clientType)}
                               {tx.clientType}
                            </div>
                         </TableCell>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="text-[14px] font-black text-[#171717] leading-tight">{tx.clientName}</span>
                               <span className="text-[11px] text-slate-400 font-bold opacity-80 uppercase tracking-tighter">Verified Identity</span>
                            </div>
                         </TableCell>
                         <TableCell className="text-[14px] font-black text-[#171717]">
                            ${tx.purchasePrice.toLocaleString()}
                         </TableCell>
                         <TableCell>
                            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                               <Clock className="size-3" />
                               {tx.status}
                            </div>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-3">
                               <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                  <User className="size-5 text-slate-400" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[14px] font-black text-[#171717] leading-none mb-1">{isCollaborator ? tx.agentName : tx.collaborators[0]?.name || "Unassigned"}</span>
                                  <Badge className="bg-slate-50 text-slate-400 border-none h-4 px-1.5 text-[8px] font-black uppercase tracking-widest rounded-md w-fit">
                                     {isCollaborator ? "AGENT" : tx.collaborators[0]?.role || "SYSTEM"}
                                  </Badge>
                               </div>
                            </div>
                         </TableCell>
                         {!isCollaborator && (
                           <TableCell className="text-center">
                              <button className="p-2 text-slate-200 hover:text-red-400 transition-colors">
                                <Trash2 className="size-4" />
                              </button>
                           </TableCell>
                         )}
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
           </div>
        </div>
      </div>

      {selectedTx && (
        <TransactionDetailSidePanel 
          transaction={selectedTx}
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      {selectedClient && (
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
      )}

      <AssignCollaboratorModal 
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={(collabId, _type, txnIds) => {
          const collab = INITIAL_COLLABORATORS.find(c => c.id === collabId);
          if (collab) {
            toast.success("Assignment Confirmed", {
              description: `Collaborator assigned to ${txnIds?.length || 0} Transactions.`,
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
        transactions={filteredTransactions.map(t => ({ 
          id: t.id, 
          clientId: 'client-1',
          address: t.address, 
          status: 'Active' as any
        }))}
        clientName="Transaction Portal"
        defaultType="transaction"
        defaultTransactionId={selectedTxId}
      />
      
      <CreateTransactionWizard 
        open={isCreateWizardOpen}
        onOpenChange={setIsCreateWizardOpen}
      />

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
    </div>
  )
}
