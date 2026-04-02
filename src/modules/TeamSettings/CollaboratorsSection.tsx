import { useState } from "react";
import { useCollaborators } from "./collaborators/hooks/useCollaborators";
import { CollaboratorTable } from "./collaborators/components/CollaboratorTable";
import { InviteCollaboratorModal } from "./collaborators/components/InviteCollaboratorModal";
import { RemoveCollaboratorConfirm } from "./collaborators/components/RemoveCollaboratorConfirm";
import { Collaborator } from "./collaborators/types";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

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
    <div className="w-full space-y-6 font-sans">
      <div className="pt-8 border-t border-[#EFEFEF] -mx-8 px-8 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#111827]">Collaborators</h2>
            <div className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">{totalCount} Members</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Manage invitations, roles, and assignments for your external collaborators.</p>
        </div>

        <Button 
          className="rounded-full bg-blue-600 hover:bg-blue-700 h-10 px-6 gap-2 shadow-lg shadow-blue-100 mt-1 font-bold"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Collaborator
        </Button>
      </div>

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
