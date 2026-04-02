import { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useCollaborators } from "./collaborators/hooks/useCollaborators";
import { CollaboratorTable } from "./collaborators/components/CollaboratorTable";
import { InviteCollaboratorModal } from "./collaborators/components/InviteCollaboratorModal";
import { RemoveCollaboratorConfirm } from "./collaborators/components/RemoveCollaboratorConfirm";
import { Collaborator } from "./collaborators/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
} from "@/components/ui/DropdownMenu";

export function CollaboratorsSection() {
  const {
    collaborators,
    totalCount,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    inviteCollaborator,
    removeCollaborator,
    resendInvite,
    existingEmails,
    allClients,
    allTransactions,
  } = useCollaborators();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Collaborator | null>(null);

  const { canAssign } = useRole();
  const hasAccess = canAssign;

  if (!hasAccess) {
    return (
      <div className="w-full py-20 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-4 opacity-50">
          <Plus className="h-6 w-6 text-slate-300" />
        </div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Access Restricted</h3>
        <p className="text-[13px] text-slate-500 max-w-xs mx-auto">
          Only Team Leads, Co-Team Leads, Operations, and Admins can manage collaborators.
        </p>
      </div>
    );
  }

  const handleInvite = (data: { type: any; email: string }) => {
    inviteCollaborator(data);
  };

  const handleRemoveClick = (c: Collaborator) => {
    setRemoveTarget(c);
  };

  const activeCollaborators = collaborators.filter(c => c.status === "active");

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Title Row */}
      <div className="pt-8 border-t border-[#EFEFEF] -mx-8 px-8 flex flex-row items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#111827]">Collaborators</h2>
            <div className="px-2 py-0.5 rounded-full bg-[#5A5FF2]/5 border border-[#5A5FF2]/10 flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-[#5A5FF2] uppercase tracking-widest leading-none">{totalCount} Members</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Manage invitations, roles, and assignments for your external collaborators.</p>
        </div>

        <Button 
          className="rounded-full bg-[#5A5FF2] hover:bg-[#5A5FF2]/90 h-10 px-6 gap-2 shadow-lg shadow-[#5A5FF2]/10 font-bold shrink-0"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Collaborator
        </Button>
      </div>

      {/* Filter Row */}
      <div className="px-0 flex flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search collaborators..." 
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-[14px] focus-visible:ring-[#5A5FF2]/10 focus-visible:border-[#5A5FF2] shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-5 gap-2.5 border-slate-200 bg-white text-slate-600 hover:text-slate-900 border rounded-xl font-bold text-[13px] shadow-sm hover:bg-slate-50 transition-all">
                <Filter className="h-3.5 w-3.5 text-slate-400" /> 
                {filterType === "all" ? "Filter Type" : filterType.toUpperCase()}
                <ChevronDown className="h-4 w-4 opacity-40 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-100 text-slate-700 py-2 rounded-xl shadow-2xl z-50">
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 font-medium text-[13px]" onClick={() => setFilterType("all")}>All Collaborators</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 font-medium text-[13px]" onClick={() => setFilterType("tc")}>Transaction Coordinator</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 font-medium text-[13px]" onClick={() => setFilterType("lender")}>Lender</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 font-medium text-[13px]" onClick={() => setFilterType("vendor")}>Vendor</DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 rounded-lg mx-1 font-medium text-[13px]" onClick={() => setFilterType("va")}>Virtual Assistant</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CollaboratorTable 
        collaborators={collaborators}
        allClients={allClients}
        allTransactions={allTransactions}
        onRemove={handleRemoveClick}
        onResend={resendInvite}
      />

      <InviteCollaboratorModal 
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInviteSent={handleInvite}
        existingEmails={existingEmails}
      />

      <RemoveCollaboratorConfirm 
        open={!!removeTarget}
        onOpenChange={(val) => !val && setRemoveTarget(null)}
        collaborator={removeTarget}
        activeCollaborators={activeCollaborators}
        onConfirm={(id, reassignId) => {
          removeCollaborator(id, reassignId);
          setRemoveTarget(null);
        }}
      />
    </div>
  );
}
