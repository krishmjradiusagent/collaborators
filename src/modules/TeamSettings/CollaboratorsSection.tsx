import { useState } from "react";
import { useCollaborators } from "./collaborators/hooks/useCollaborators";
import { CollaboratorTable } from "./collaborators/components/CollaboratorTable";
import { InviteCollaboratorModal } from "./collaborators/components/InviteCollaboratorModal";
import { RemoveCollaboratorConfirm } from "./collaborators/components/RemoveCollaboratorConfirm";
import { Collaborator } from "./collaborators/types";
import { Info } from "lucide-react";

export function CollaboratorsSection() {
  const {
    collaborators,
    totalCount,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    inviteCollaborator,
    removeCollaborator,
    resendInvite,
    existingEmails,
    allClients,
    allTransactions,
  } = useCollaborators();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Collaborator | null>(null);

  const handleInvite = (data: { type: any; email: string }) => {
    inviteCollaborator(data);
  };

  const handleRemoveClick = (c: Collaborator) => {
    setRemoveTarget(c);
  };

  const activeCollaborators = collaborators.filter(c => c.status === "active");

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Informational Header */}
      <div className="bg-blue-50 border border-blue-200 px-6 py-4 rounded-xl flex items-center justify-between group/header shadow-sm transition-all hover:bg-blue-100/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 group-hover/header:rotate-12 transition-transform duration-300">
             <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
             <h4 className="text-[14px] font-semibold text-slate-900">Collaborator Network</h4>
             <p className="text-[12px] text-slate-500 font-medium">Invite TCs, Lenders, and Vendors to work on your team's transactions directly.</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xl font-black text-blue-600 leading-none">{totalCount}</p>
           <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-1">Total Members</p>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex items-center justify-between">
         <div className="space-y-1.5">
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold text-[#111827]">Collaborators</h2>
               <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Manage invitations, roles, and assignments for your external partners.</p>
         </div>
      </div>

      {/* The Table - Pass a light mode prop or handle it inside */}
      <CollaboratorTable 
        collaborators={collaborators}
        allClients={allClients}
        allTransactions={allTransactions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onAddCollaborator={() => setIsInviteModalOpen(true)}
        onRemove={handleRemoveClick}
        onResend={resendInvite}
      />

      {/* Modals */}
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
