import { Search, Filter, Plus, Users, ChevronDown } from "lucide-react";
import { Collaborator, CollaboratorType, Status, Client, Transaction } from "../types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../components/ui/Table";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { CollaboratorRow } from "./CollaboratorRow";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
} from "../../../../components/ui/DropdownMenu";
import { useState } from "react";

interface CollaboratorTableProps {
  collaborators: Collaborator[];
  allClients: Client[];
  allTransactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: CollaboratorType | "all";
  setFilterType: (t: CollaboratorType | "all") => void;
  filterStatus: Status | "all";
  setFilterStatus: (s: Status | "all") => void;
  onAddCollaborator: () => void;
  onRemove: (c: Collaborator) => void;
  onResend: (id: string) => void;
}

export function CollaboratorTable({
  collaborators,
  allClients,
  allTransactions,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  onAddCollaborator,
  onRemove,
  onResend,
}: CollaboratorTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const isEmpty = collaborators.length === 0 && searchQuery === "" && filterType === "all" && filterStatus === "all";

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-700">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-[450px] group/search ">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search collaborators..." 
            className="pl-12 h-12 bg-white border-slate-200 text-slate-900 border-2 focus:border-blue-500/50 shadow-sm rounded-xl font-medium placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-5 gap-3 border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-2 rounded-xl font-bold">
                <Filter className="h-4 w-4" /> 
                {filterType === "all" ? "Filter Type" : filterType.toUpperCase()}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-slate-100 text-slate-700 py-2 rounded-xl shadow-2xl">
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-black p-3 tracking-[.25em]">Collaborator Type</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50 my-1" />
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterType("all")}>All Collaborators</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterType("tc")}>Transaction Coordinator</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterType("lender")}>Lender</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterType("vendor")}>Vendor</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterType("va")}>Virtual Assistant</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-5 gap-3 border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-2 rounded-xl font-bold">
                <Filter className="h-4 w-4" /> 
                {filterStatus === "all" ? "Filter Status" : filterStatus.toUpperCase()}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-slate-100 text-slate-700 py-2 rounded-xl shadow-2xl">
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-black p-3 tracking-[.25em]">Access Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50 my-1" />
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 text-emerald-600 focus:text-emerald-700" onClick={() => setFilterStatus("active")}>Active Members</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 text-blue-600 focus:text-blue-700" onClick={() => setFilterStatus("invited")}>Open Invitations</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 text-amber-600 focus:text-amber-700" onClick={() => setFilterStatus("paused")}>Paused Access</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 text-red-600 focus:text-red-700" onClick={() => setFilterStatus("removed")}>Revoked Access</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-6 gap-2 shadow-lg shadow-blue-100 mt-1"
            onClick={onAddCollaborator}
          >
            <Plus className="h-4 w-4" /> Add Collaborator
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center p-24 text-center space-y-8">
             <div className="p-8 rounded-[32px] bg-slate-50 ring-1 ring-slate-200 shadow-sm relative">
                <Users className="h-14 w-14 text-slate-300" />
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-500 border-4 border-white animate-bounce" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-wide">No Collaborators Connected</h3>
                <p className="text-[15px] text-slate-500 font-bold max-w-[340px] leading-relaxed mx-auto">
                   Build your core collaboration network by inviting TCs, Lenders, and Vendors to your team hub.
                </p>
             </div>
             <Button 
               size="lg" 
               className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100"
               onClick={onAddCollaborator}
             >
               Start Collaborating
             </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9FAFB]">
              <TableRow className="hover:bg-transparent border-b-[#F0F0F0]">
                <TableHead className="w-[340px] pl-8 text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Identity</TableHead>
                <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-center">Category</TableHead>
                <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Authentication</TableHead>
                <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Access Level</TableHead>
                <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Volume</TableHead>
                <TableHead className="w-[100px] text-right pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {collaborators.map((collaborator) => (
                <CollaboratorRow 
                  key={collaborator.id}
                  collaborator={collaborator}
                  isExpanded={expandedId === collaborator.id}
                  onToggleExpand={() => toggleExpand(collaborator.id)}
                  allClients={allClients}
                  allTransactions={allTransactions}
                  onRemove={onRemove}
                  onResend={onResend}
                />
              ))}
              {collaborators.length === 0 && !isEmpty && (
                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50 text-slate-400">
                       <Filter className="h-12 w-12 text-slate-300 mb-2" />
                       <p className="font-black uppercase text-xs tracking-widest">No matching results found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        )}
      </div>
    </div>
  );
}
