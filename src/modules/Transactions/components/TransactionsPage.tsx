import * as React from "react"
import { 
  Plus, 
  ChevronDown, 
  Bell, 
  ArrowUpRight, 
  Search,
  Filter,
  Download,
  Mail,
  Trash2,
  MoreHorizontal,
  Home,
  User,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/Avatar"
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

const stats = [
  { label: "Active Listings", value: "100", color: "bg-[#EEF2FF] text-[#5A5FF2] border-[#5A5FF2]/20" },
  { label: "Pending Transactions", value: "5", color: "bg-[#F0FDF4] text-[#10B981] border-[#10B981]/20" },
  { label: "Closed Transactions(YTD)", value: "20", color: "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20" },
  { label: "Earnings (YTD)", value: "$100,000", color: "bg-[#F0F9FF] text-[#0EA5E9] border-[#0EA5E9]/20" },
]

const signingQueue = [
  { id: 1, address: "500 Pearl St, California", document: "Contract for Unit 4B", name: "Jane Doe", date: "Sent on 05 Jan, 2:15 PM" },
  { id: 2, address: "500 Pearl St, California", document: "Contract for Unit 4B", name: "Jane Doe", date: "Sent on 05 Jan, 2:15 PM" },
  { id: 3, address: "500 Pearl St, California", document: "Contract for Unit 4B", name: "Jane Doe", date: "Sent on 05 Jan, 2:15 PM" },
  { id: 4, address: "500 Pearl St, California", document: "Contract for Unit 4B", name: "Jane Doe", date: "Sent on 05 Jan, 2:15 PM" },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    address: "123 Elm St, Austin, TX",
    clientType: "Buyer",
    clientName: "Jessica Taylor",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Under Contract",
    agentName: "Jessica Taylor",
    acceptanceDate: "April 6, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "April 30, 2024",
    collaborators: [
      { id: "c-1", name: "Sarah Miller", role: "T.C." },
      { id: "c-2", name: "Robert Fox", role: "Lender" }
    ]
  },
  {
    id: "tx-2",
    address: "654 Cedar St, Seattle, WA",
    clientType: "Seller",
    clientName: "Sophia Brown",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Active Listing",
    agentName: "Jessica Taylor",
    acceptanceDate: "May 10, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "June 15, 2024",
    collaborators: [
      { id: "c-1", name: "Sarah Miller", role: "T.C." }
    ]
  },
  {
    id: "tx-3",
    address: "456 Maple Ave, Los Angeles, CA",
    clientType: "Landlord",
    clientName: "Emily Davis",
    subClientName: "Sophia Brown",
    purchasePrice: 400000,
    status: "Negotiation",
    agentName: "Jessica Taylor",
    acceptanceDate: "June 1, 2024",
    lastUpdated: "April 6, 2024\n12:26 AM",
    closeOfEscrow: "July 1, 2024",
    collaborators: []
  },
]

export function TransactionsPage() {
  const [activeTableTab, setActiveTableTab] = React.useState("All")
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false)
  const [selectedTxId, setSelectedTxId] = React.useState<string | undefined>()
  const [selectedTx, setSelectedTx] = React.useState<Transaction | undefined>()

  const tableTabs = ["All", "Active Listings", "Pending", "Closing Soon", "My Closed (YTD)", "Referrals"]

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

  const getClientTypeColor = (type: Transaction['clientType']) => {
    switch (type) {
      case 'Buyer': return "bg-blue-50 text-blue-600 border-blue-100";
      case 'Seller': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Landlord': return "bg-orange-50 text-orange-600 border-orange-100";
      case 'Tenant': return "bg-purple-50 text-purple-600 border-purple-100";
      case 'Referral': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "";
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full relative h-[calc(100vh-64px)] overflow-hidden">
      {/* View Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#EFEFEF]">
        <h1 className="text-[28px] font-bold text-[#111827]">My Transactions</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-[24px] border-[#EFEFEF] bg-white gap-2 text-[#5A5FF2] hover:bg-[#EEF2FF] hover:border-[#5A5FF2]/20 font-bold transition-all shadow-sm">
            <Plus className="size-4" /> Buyer/Tenant <ChevronDown className="size-4 opacity-50" />
          </Button>
          <Button variant="outline" className="h-10 rounded-[24px] border-[#EFEFEF] bg-white gap-2 text-[#5A5FF2] hover:bg-[#EEF2FF] hover:border-[#5A5FF2]/20 font-bold transition-all shadow-sm">
            <Plus className="size-4" /> Seller/Landlord <ChevronDown className="size-4 opacity-50" />
          </Button>
          <Button variant="outline" className="h-10 rounded-[24px] border-[#EFEFEF] bg-white gap-2 text-[#5A5FF2] hover:bg-[#EEF2FF] hover:border-[#5A5FF2]/20 font-bold transition-all shadow-sm">
            <Plus className="size-4" /> Referral <ChevronDown className="size-4 opacity-50" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-50 transition-all rounded-full relative">
            <Bell className="size-5" />
            <span className="absolute top-2.5 right-2.5 size-2.5 bg-red-500 rounded-full border-2 border-white" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full bg-[#f8fbff]/30 p-8 pt-6 space-y-10 overflow-y-auto custom-scrollbar">
        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-6">
           <div className="col-span-4 grid grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className={cn("p-6 rounded-[28px] border border-transparent shadow-sm flex flex-col justify-between h-[140px] transition-all hover:scale-[1.02] cursor-pointer", stat.color)}>
                  <span className="text-[12px] font-bold tracking-widest opacity-80 uppercase">{stat.label}</span>
                  <span className="text-[34px] font-black tracking-tight leading-none">{stat.value}</span>
                </div>
              ))}
           </div>
           {/* Progress Card */}
           <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[140px]">
              <div className="flex justify-between items-start">
                 <div className="space-y-0.5">
                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">My Progress to Cap</p>
                    <p className="text-[18px] font-black text-[#171717]">$250/$25,000</p>
                 </div>
              </div>
              <div className="w-full space-y-2">
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full shadow-[0px_0px_10px_rgba(251,191,36,0.3)]" style={{ width: '30%' }} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 text-right uppercase tracking-[0.2em]">30% achieved</p>
              </div>
           </div>
        </div>

        {/* Signing Queue Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <h2 className="text-[18px] font-black text-[#373758] uppercase tracking-[0.2em]">Signing Queue</h2>
                 <div className="size-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-[#5A5FF2] ring-1 ring-[#5055ff]/10">4</div>
              </div>
              <Button variant="ghost" className="text-[12px] font-bold text-[#5A5FF2] p-0 h-auto hover:bg-transparent uppercase tracking-wider">View All Items</Button>
           </div>
           <div className="grid gap-3">
              {signingQueue.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-5 bg-white rounded-[32px] border border-slate-100 shadow-[0px_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0px_12px_40px_rgba(90,95,242,0.08)] hover:border-indigo-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="size-14 rounded-[22px] bg-indigo-50/50 flex items-center justify-center text-indigo-600 transition-all group-hover:bg-indigo-100 group-hover:scale-105">
                      <Mail className="size-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[16px] font-bold text-[#111827] leading-none transition-colors group-hover:text-[#5A5FF2]">{item.address} - <span className="font-medium text-slate-500">{item.document}</span></p>
                      <div className="flex items-center gap-2.5 text-[12px] mt-2">
                         <span className="font-black text-[#5A5FF2] uppercase tracking-[0.1em]">{item.name}</span>
                         <span className="size-1 bg-slate-300 rounded-full" />
                         <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full border-[#5A5FF2] text-[#5A5FF2] hover:bg-[#5A5FF2] hover:text-white font-black uppercase text-[12px] tracking-[0.1em] h-11 px-8 gap-2.5 transition-all shadow-sm">
                    Sign Now <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              ))}
           </div>
        </div>

        {/* Filters & Table Section */}
        <div className="bg-white rounded-[40px] shadow-[0px_40px_80px_rgba(90,95,242,0.06)] border border-slate-100 overflow-hidden flex flex-col pb-12">
           {/* Table Tabs */}
           <div className="flex items-center p-8 pb-4 overflow-x-auto gap-4">
              <div className="flex items-center gap-2 p-2 bg-[#f8fbff] rounded-[24px] border border-slate-100">
                {tableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTableTab(tab)}
                    className={cn(
                      "px-8 py-3 text-[13px] font-black uppercase tracking-widest rounded-full transition-all whitespace-nowrap",
                      activeTableTab === tab ? "bg-white text-[#5A5FF2] shadow-[0_8px_20px_rgba(90,95,242,0.15)] ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
           </div>

           {/* Table Filters */}
           <div className="px-8 py-6 flex items-center justify-between gap-8 border-b border-slate-50">
              <div className="flex-1 max-w-xl relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-[#5A5FF2] transition-colors" />
                <Input 
                  placeholder="Filter by Property, Client or Collaborator..." 
                  className="pl-13 h-14 bg-slate-50/50 border-none rounded-[20px] text-[15px] font-medium placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner"
                />
              </div>
              <div className="flex items-center gap-4">
                 <Button variant="outline" className="h-14 rounded-[20px] bg-white border-slate-100 px-7 gap-3 text-slate-600 hover:bg-slate-50 font-bold text-[14px] transition-all shadow-sm">
                    Client Type <ChevronDown className="size-4 opacity-50" />
                 </Button>
                 <Button variant="outline" className="h-14 rounded-[20px] bg-white border-slate-100 px-7 gap-3 text-slate-600 hover:bg-slate-50 font-bold text-[14px] transition-all shadow-sm">
                    Status <ChevronDown className="size-4 opacity-50" />
                 </Button>
                 <div className="w-px h-10 bg-slate-100 mx-2" />
                 <Button variant="outline" className="size-14 rounded-[20px] bg-white border-slate-100 flex items-center justify-center p-0 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter className="size-5" />
                 </Button>
                 <Button variant="outline" className="h-14 rounded-[20px] border-[#5A5FF2]/20 px-8 gap-3 text-[#5A5FF2] hover:bg-indigo-50 font-black uppercase text-[13px] tracking-widest shadow-sm transition-all bg-white">
                    <Download className="size-5" /> Export
                 </Button>
              </div>
           </div>

           {/* Main Data Table */}
           <div className="flex-1">
             <Table>
                <TableHeader className="bg-slate-50/30">
                   <TableRow className="hover:bg-transparent border-0 h-16">
                      <TableHead className="pl-10 text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Property Address & Client</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Client Type</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Collaborators</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Escrow Status</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">Contract Price</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400 text-right pr-10">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {MOCK_TRANSACTIONS.map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        className="group h-28 hover:bg-indigo-50/10 border-b-[#f4f7f9] transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedTx(tx);
                          setIsSidePanelOpen(true);
                        }}
                      >
                         <TableCell className="pl-10">
                           <div className="flex flex-col">
                              <span className="font-bold text-[16px] text-[#111827] leading-tight group-hover:text-[#5A5FF2] transition-colors">{tx.address}</span>
                              <span className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{tx.clientName}</span>
                           </div>
                         </TableCell>
                         <TableCell>
                            <Badge variant="outline" className={cn("inline-flex items-center gap-2 font-black text-[10px] px-4 h-9 shadow-sm rounded-full border-none tracking-widest", getClientTypeColor(tx.clientType))}>
                               {getClientTypeIcon(tx.clientType)}
                               {tx.clientType.toUpperCase()}
                            </Badge>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-3">
                               <div className="flex -space-x-3.5 transition-transform group-hover:translate-x-1 duration-500">
                                  {tx.collaborators.slice(0, 2).map((collab, i) => (
                                    <Avatar key={i} className="size-11 border-4 border-white shadow-md ring-1 ring-slate-100">
                                       <AvatarFallback className="text-[11px] font-black bg-slate-50 text-slate-400">{collab.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {tx.collaborators.length > 2 && (
                                     <div className="size-11 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-[10px] font-black text-slate-500 ring-1 ring-slate-100">
                                        +{tx.collaborators.length - 2}
                                     </div>
                                  )}
                                  {tx.collaborators.length === 0 && (
                                     <div className="size-11 rounded-full bg-white border-4 border-slate-100 border-dashed shadow-sm flex items-center justify-center text-slate-300">
                                        <Users className="size-4" />
                                     </div>
                                  )}
                               </div>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedTxId(tx.id);
                                   setIsAssignModalOpen(true);
                                 }}
                                 className="size-9 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#5A5FF2] hover:text-[#5A5FF2] hover:bg-white hover:shadow-xl transition-all scale-0 group-hover:scale-100 group-hover:rotate-180 duration-700"
                               >
                                  <Plus className="size-5" />
                                </button>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[9px] uppercase h-7 px-4 tracking-[0.15em] w-fit shadow-xs">
                               {tx.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="font-black text-[18px] text-[#111827] tracking-tight">
                            ${tx.purchasePrice.toLocaleString()}
                         </TableCell>
                         <TableCell className="text-right pr-10">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                               <Button variant="ghost" size="icon" className="h-11 w-11 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-[18px] transition-all">
                                  <Trash2 className="size-5" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-11 w-11 text-slate-300 hover:bg-slate-50 rounded-[18px] transition-all">
                                  <MoreHorizontal className="size-5" />
                                </Button>
                            </div>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
           </div>
        </div>
      </div>

      <TransactionDetailSidePanel 
        transaction={selectedTx!}
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />

      <AssignCollaboratorModal 
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={(collabId, type, txnId) => {
          console.log(`Assigning ${collabId} to ${type} at level`, txnId);
          setIsAssignModalOpen(false);
          toast.success("Assignment Confirmed", {
            description: "Collaborator added to Transaction Level access.",
            className: "bg-[#5A5FF2] text-white",
          });
        }}
        onOpenInvite={() => console.log("Open invite")}
        globalPool={INITIAL_COLLABORATORS.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.type.toUpperCase() as any,
          type: c.type,
          status: 'active'
        }))}
        transactions={MOCK_TRANSACTIONS.map(t => ({ 
          id: t.id, 
          clientId: 'client-1',
          address: t.address, 
          status: 'Active' as any
        }))}
        clientName="Transaction Portal"
        defaultType="transaction"
        defaultTransactionId={selectedTxId}
      />
    </div>
  )
}
