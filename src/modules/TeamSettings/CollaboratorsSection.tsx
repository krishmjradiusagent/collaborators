import { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useCollaborators } from "./collaborators/hooks/useCollaborators";
import { CollaboratorTable } from "./collaborators/components/CollaboratorTable";
import { InviteCollaboratorModal } from "./collaborators/components/InviteCollaboratorModal";
import { RemoveCollaboratorConfirm } from "./collaborators/components/RemoveCollaboratorConfirm";
import { AgentCollaborationSettingsModal } from "./collaborators/components/AgentCollaborationSettingsModal";
import { Collaborator } from "./collaborators/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown,
  ShieldCheck,
  UserPlus,
  Shield,
  ArrowRight,
  Users,
  Settings
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
} from "@/components/ui/DropdownMenu";
import { AddRadiusApprovedModal } from "./collaborators/components/AddRadiusApprovedModal";
import { toast } from "sonner";
import { RADIUS_APPROVED_POOL } from "./collaborators/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

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
  } = useCollaborators();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Collaborator | null>(null);

  const { canAssign, currentRole } = useRole();
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

  const handleAddApproved = (collab: Collaborator) => {
    // In a real app, this would be an API call to add the approved member to the team
    inviteCollaborator({
      type: collab.type as any,
      email: collab.email,
      firstName: collab.name.split(' ')[0],
      lastName: collab.name.split(' ').slice(1).join(' ')
    });
    setIsApprovedModalOpen(false);
    toast.success("Network Member Added", {
      description: `${collab.name} has been added to your collaborator list.`,
      icon: <Plus className="size-4" />,
      className: "bg-[#171717] text-white border-none rounded-2xl",
    });
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

        <div className="flex items-center gap-3">
          {currentRole !== 'AGENT' && (
            <Button 
              variant="outline"
              className="h-10 px-4 rounded-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all hidden md:flex"
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <Settings className="size-4 mr-2" />
              Manage Defaults
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="rounded-full bg-[#5A5FF2] hover:bg-[#5A5FF2]/90 h-10 px-6 gap-2 shadow-lg shadow-[#5A5FF2]/10 font-bold shrink-0 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Collaborator
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border-slate-100 shadow-3xl p-2 rounded-2xl z-50">
              <DropdownMenuItem 
                className="gap-3 p-3 cursor-pointer focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] rounded-xl font-bold text-[13px]"
                onClick={() => setIsApprovedModalOpen(true)}
              >
                <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="size-4" />
                </div>
                Radius Approved
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-50 my-1.5" />
              <DropdownMenuItem 
                className="gap-3 p-3 cursor-pointer focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] rounded-xl font-bold text-[13px]"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <UserPlus className="size-4" />
                </div>
                Add New Collaborator
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      {collaborators.length > 0 ? (
        <CollaboratorTable 
          collaborators={collaborators}
          onRemove={handleRemoveClick}
          onResend={resendInvite}
        />
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-slate-100 p-8 text-center space-y-10">
          <div className="space-y-4">
            <div className="mx-auto size-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-6">
              <Users className="size-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-[#171717] tracking-tighter">No Collaborators Yet</h3>
            <p className="text-slate-500 text-[15px] font-medium max-w-sm mx-auto">
              You haven't added any team collaborators to your workspace. Start by exploring our vetted partner network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
            {/* Suggestion Card: Radius Approved */}
            <div 
              className="group p-6 rounded-3xl bg-amber-50/30 border-2 border-amber-100 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer text-left relative overflow-hidden active:scale-[0.98]"
              onClick={() => setIsApprovedModalOpen(true)}
            >
              <div className="flex flex-col gap-4 relative z-10">
                <div className="size-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h4 className="font-black text-[#171717] text-[16px] tracking-tight">Vetted Expert Network</h4>
                  <p className="text-[12px] text-amber-700/70 font-bold mt-1 uppercase tracking-wider">Radius Approved Network</p>
                </div>
                
                <div className="flex -space-x-3 mt-2">
                   {RADIUS_APPROVED_POOL.slice(0, 3).map((p, i) => (
                     <Avatar key={p.id} className="size-10 ring-4 ring-white shadow-sm border-none">
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-black text-[11px]">{p.name.substring(0, 2)}</AvatarFallback>
                     </Avatar>
                   ))}
                   <div className="size-10 rounded-full bg-amber-500 ring-4 ring-white flex items-center justify-center shadow-lg z-10">
                      <Plus className="size-4 text-white" />
                   </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-amber-500 opacity-20 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="size-5" />
              </div>
            </div>

            {/* Suggestion Card: New Invite */}
            <div 
              className="group p-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-[#5A5FF2]/30 hover:shadow-2xl hover:shadow-[#5A5FF2]/10 transition-all cursor-pointer text-left relative overflow-hidden active:scale-[0.98]"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <div className="flex flex-col gap-4 relative z-10">
                <div className="size-12 rounded-2xl bg-[#5A5FF2] text-white flex items-center justify-center shadow-lg shadow-[#5A5FF2]/20">
                  <UserPlus className="size-6" />
                </div>
                <div>
                  <h4 className="font-black text-[#171717] text-[16px] tracking-tight">Invite Existing Member</h4>
                  <p className="text-[12px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Custom Team Member</p>
                </div>
                
                <p className="text-[13px] text-slate-500 font-medium leading-tight mt-2 pb-2">
                  Already have members? Invite them directly via email.
                </p>
              </div>
              <div className="absolute top-4 right-4 text-slate-200 group-hover:text-[#5A5FF2] opacity-40 group-hover:opacity-100 transition-all">
                <Plus className="size-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      <InviteCollaboratorModal 
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInviteSent={handleInvite}
        existingEmails={existingEmails}
      />

      <AddRadiusApprovedModal
        open={isApprovedModalOpen}
        onOpenChange={setIsApprovedModalOpen}
        onAdd={handleAddApproved}
        existingCollaboratorIds={collaborators.map(c => c.id)}
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

      <AgentCollaborationSettingsModal 
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        globalPool={collaborators}
      />
    </div>
  );
}
