import { useState } from "react";
import { useCollaborators } from "./collaborators/hooks/useCollaborators";
import { CollaboratorTable } from "./collaborators/components/CollaboratorTable";
import { InviteCollaboratorModal } from "./collaborators/components/InviteCollaboratorModal";
import { RemoveCollaboratorConfirm } from "./collaborators/components/RemoveCollaboratorConfirm";
import { Collaborator } from "./collaborators/types";
import { Users } from "lucide-react";

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
    <div className="w-full space-y-12 font-sans px-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
         <div className="space-y-1.5">
            <div className="flex items-center gap-2">
               <h2 className="text-2xl font-bold text-[#111827]">Collaborators</h2>
               <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)] animate-pulse" />
            </div>
            <p className="text-[15px] text-slate-500 font-medium max-w-[500px]">Manage invitations, roles, and assignments for your external collaborators.</p>
         </div>

         <div className="flex items-center gap-4">
            {/* Informational Header - Mini version with subtle counts */}
            <div className="px-5 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
               <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
               </div>
               <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-900 leading-none">{totalCount}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.05em]">Total Network</span>
               </div>
            </div>
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
