import { Search, Filter, ChevronDown } from "lucide-react";
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
  onRemove,
  onResend,
}: CollaboratorTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredCollaborators = collaborators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || c.type === filterType;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search collaborators..." 
            className="pl-10 h-10 bg-white border-slate-200 rounded-md text-[13px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4 gap-2 border-slate-200 bg-white text-slate-600 hover:text-slate-900 border rounded-md font-bold text-[13px]">
                <Filter className="h-3.5 w-3.5" /> 
                {filterType === "all" ? "Filter Type" : filterType.toUpperCase()}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-slate-100 text-slate-700 py-2 rounded-xl shadow-2xl z-50">
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
              <Button variant="outline" className="h-10 px-4 gap-2 border-slate-200 bg-white text-slate-600 hover:text-slate-900 border rounded-md font-bold text-[13px]">
                <Filter className="h-3.5 w-3.5" /> 
                {filterStatus === "all" ? "Filter Status" : filterStatus.toUpperCase()}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-slate-100 text-slate-700 py-2 rounded-xl shadow-2xl z-50">
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-black p-3 tracking-[.25em]">Access Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50 my-1" />
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterStatus("all")}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterStatus("active")}>Active Members</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterStatus("invited")}>Open Invitations</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterStatus("paused")}>Paused Access</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1" onClick={() => setFilterStatus("removed")}>Revoked Access</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="hover:bg-transparent border-b-[#F0F0F0]">
              <TableHead className="w-[200px] pl-8 text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Identity</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-center">Category</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Authentication</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-center">Access Level</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-right pr-8">Volume</TableHead>
              <TableHead className="w-[50px] pr-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-center">
            {filteredCollaborators.map((collaborator) => (
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
            {filteredCollaborators.length === 0 && (
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-40 text-slate-400">
                     <Filter className="h-8 w-8 text-slate-300" />
                     <p className="font-bold uppercase text-[10px] tracking-widest">No matching collaborators found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
