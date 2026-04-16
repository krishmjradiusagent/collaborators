import React, { useState } from 'react';
import {
  Dialog,
  DialogContent
} from '@/components/ui/Dialog';
import {
  CheckCircle2,
  ChevronDown,
  MoreVertical,
  Plus,
  Clock,
  Calendar,
  Sparkles,
  ArrowLeft,
  MapPin,
  User,
  Bell,
  Users,
  UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Transaction } from '../types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CollaboratorAvatarStack } from '../../Shared/components/CollaboratorAvatarStack';
import { AssignCollaboratorModal } from '../../Clients/components/AssignCollaboratorModal';
import { InviteCollaboratorModal } from '../../TeamSettings/collaborators/components/InviteCollaboratorModal';
import { CollaboratorCard } from '../../Clients/components/CollaboratorCard';
import { ManageCollaboratorsModal } from '../../Clients/components/ManageCollaboratorsModal';
import { GLOBAL_COLLABORATOR_POOL, MOCK_ASSIGNMENTS } from '../../Clients/mockData';
import { INITIAL_COLLABORATORS } from '../../TeamSettings/collaborators/mockData';
import { useRole } from "@/contexts/RoleContext";

interface TransactionDetailSidePanelProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  initialCollabExpanded?: boolean;
}

export const TransactionDetailSidePanel: React.FC<TransactionDetailSidePanelProps> = ({
  transaction,
  isOpen,
  onClose,
  initialCollabExpanded = true
}) => {
  const { canInvite, canAssign } = useRole();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCollabExpanded, setIsCollabExpanded] = useState(initialCollabExpanded);

  // Use state for assignments
  const [localAssignments, setLocalAssignments] = useState<any[]>([]);

  // Use state for collaborators assigned to this specific transaction
  const [assignedCollabs, setAssignedCollabs] = useState<any[]>(
    transaction?.collaborators?.map(c => ({
      ...c,
      email: `${c.name.toLowerCase().replace(' ', '.')}@example.com`,
      status: c.status || 'active',
      type: c.role.toLowerCase().includes('t.c') ? 'tc' : 'lender',
      invitationExpiry: c.invitationExpiry
    })) || []
  );

  // Initialize assignments
  React.useEffect(() => {
    if (isOpen && transaction) {
      setLocalAssignments(MOCK_ASSIGNMENTS.filter(a => a.transactionId === transaction.id || a.clientName === transaction.clientName));
    }
  }, [isOpen, transaction?.id, transaction?.clientName]);

  const collabSectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && initialCollabExpanded && collabSectionRef.current) {
      setTimeout(() => {
        collabSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [isOpen, initialCollabExpanded]);

  const handleUpdateAccess = (collaboratorId: string, newType: 'client' | 'transaction') => {
    const collab = GLOBAL_COLLABORATOR_POOL.find(c => c.id === collaboratorId);

    setLocalAssignments(prev => {
      const existing = prev.find(a => a.collaboratorId === collaboratorId);
      if (existing) {
        return prev.map(a =>
          a.collaboratorId === collaboratorId
            ? { ...a, type: newType, transactionId: newType === 'client' ? undefined : a.transactionId }
            : a
        );
      }
      return [...prev, { collaboratorId, type: newType, transactionId: newType === 'transaction' ? transaction.id : undefined }];
    });

    if (collab && !assignedCollabs.find(c => c.id === collaboratorId)) {
      setAssignedCollabs(prev => [...prev, {
        ...collab,
        email: `${collab.name.toLowerCase().replace(' ', '.')}@example.com`,
        status: 'active',
        role: collab.type.toUpperCase(),
        invitationExpiry: '24h'
      }]);
    }

    if (newType === 'client') {
      toast.success("Access Level Updated", {
        description: `Collaborator upgraded to Client Level access.`,
      });
    }
  };

  const tabs = [
    'Overview',
    'Documents',
    'Collaborators',
    'Escrow info',
    'Commission',
    'Task list'
  ];

  if (!transaction) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
        <DialogContent
          className="fixed top-0 !right-0 h-full w-[1100px] max-w-[95vw] bg-white p-0 shadow-2xl transition-all duration-300 ease-in-out font-sans flex flex-col border-none rounded-none !left-auto !translate-x-0 !translate-y-0 outline-none z-[200] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:!slide-in-from-right-full data-[state=closed]:!slide-out-to-right-full"
          overlayClassName="z-[200]"
        >
          <div className="flex-1 overflow-y-auto no-scrollbar pt-6 px-10 pb-20 bg-[#fcfdff]">
            {/* Header Card */}
            <div className="bg-white border-[#e5e5e5] border-[1px] flex flex-col items-start p-8 relative rounded-[32px] shadow-[0px_4px_32px_rgba(0,0,0,0.02)] w-full mb-8 mt-2">
              <div className="flex gap-6 items-start w-full">
                <button
                  onClick={onClose}
                  className="size-12 bg-white border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group"
                  aria-label="Back"
                >
                  <ArrowLeft className="size-6 text-[#5a5ff2] group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-indigo-50 text-[#5a5ff2] border-none font-black text-[10px] px-3 h-7 tracking-widest uppercase rounded-full">{transaction.clientType}</Badge>
                        <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[10px] px-3 h-7 tracking-widest uppercase rounded-full">{transaction.status}</Badge>
                      </div>
                      <h1 className="text-[28px] font-black text-[#111827] tracking-tight leading-tight mb-2">{transaction.address}</h1>
                      <div className="flex items-center gap-4 text-slate-400 font-bold text-[14px]">
                        <div className="flex items-center gap-1.5 hover:text-[#5a5ff2] transition-colors cursor-pointer">
                          <User className="size-4" /> {transaction.clientName}
                        </div>
                        <span className="size-1 bg-slate-200 rounded-full" />
                        <div className="flex items-center gap-1.5 hover:text-[#5a5ff2] transition-colors cursor-pointer">
                          <MapPin className="size-4" /> Austin, TX
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end mr-6">
                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Purchase Price</span>
                        <span className="text-[24px] font-black text-[#111827] leading-none tracking-tight">${transaction.purchasePrice.toLocaleString()}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="size-12 rounded-2xl bg-slate-50 text-[#737373] hover:bg-slate-100 transition-all">
                        <MoreVertical className="size-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#f1f4f9] my-8" />

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-8 w-full">
                {[
                  { label: "Acceptance Date", value: transaction.acceptanceDate || "--", icon: Calendar },
                  { label: "COE Date", value: transaction.closeOfEscrow || "--", icon: Bell },
                  { label: "Last Activity", value: "Today, 12:26 AM", icon: Clock },
                  { label: "Primary Agent", value: transaction.agentName, icon: User },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-[#a3a3a3] text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <stat.icon className="size-3 text-[#5A5FF2]/60" /> {stat.label}
                    </p>
                    <span className="text-[#171717] text-[15px] font-black tracking-tight block">{stat.value}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-[#f1f4f9] my-8" />

              {/* Collaborators Accordion */}
              <div className="w-full">
                <div className="flex items-center justify-between w-full h-[40px] cursor-pointer py-1 group" onClick={() => setIsCollabExpanded(!isCollabExpanded)}>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5a5ff2]">
                      <Users className="size-5" />
                    </div>
                    <span className="text-[#111827] text-[16px] font-black tracking-wide uppercase">Collaborators</span>

                    {assignedCollabs.length > 0 && (
                      <div className="ml-2 scale-90 origin-left" onClick={(e) => e.stopPropagation()}>
                        <CollaboratorAvatarStack
                          collaborators={assignedCollabs}
                          max={4}
                          onManage={() => setIsManageModalOpen(true)}
                        />
                      </div>
                    )}
                  </div>
                  <div className={cn("transition-transform duration-300", isCollabExpanded ? "rotate-180" : "")}>
                    <ChevronDown className="size-6 text-[#111827]" />
                  </div>
                </div>

                {isCollabExpanded && (
                  <div className="pt-6 space-y-4">
                    {assignedCollabs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignedCollabs.map((collab) => (
                          <CollaboratorCard
                            key={collab.id}
                            collaborator={collab as any}
                            assignmentType={localAssignments.find(a => a.collaboratorId === collab.id)?.type || 'transaction'}
                            onResendInvite={() => toast.success("Invitation Resent")}
                            onChat={() => toast.info("Opening Chat...")}
                            onUpgrade={() => handleUpdateAccess(collab.id, 'client')}
                            onRemoveAccess={canAssign ? () => {
                              setAssignedCollabs(prev => prev.filter(c => c.id !== collab.id));
                              toast.info("Access Removed");
                            } : undefined}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
                        <Users className="size-12 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-[15px] mb-4">No team members assigned</p>
                        {canAssign && (
                          <Button
                            className="rounded-full bg-[#5a5ff2] hover:bg-[#5055ff] text-white text-[14px] font-bold px-8 h-12 shadow-lg shadow-indigo-200"
                            onClick={() => setIsAssignModalOpen(true)}
                          >
                            + Assign Collaborator
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI Action Header */}
            <div className="flex gap-4 mb-10">
              <Button className="flex-1 bg-[#1a1a2e] hover:bg-[#121225] text-white rounded-[24px] h-[64px] flex items-center justify-center gap-3 group shadow-2xl transition-all">
                <Sparkles className="size-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[16px] font-black uppercase tracking-widest">Analyze Transaction Flow</span>
              </Button>
            </div>

            {/* Tabs Section */}
            <div>
              <div className="flex gap-10 border-b border-[#f1f4f9] overflow-x-auto no-scrollbar mb-8 px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "pb-4 text-[15px] font-black transition-all whitespace-nowrap relative px-1 uppercase tracking-[0.1em]",
                      activeTab === tab ? "text-[#5a5ff2]" : "text-[#94a3b8] hover:text-[#525252]"
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5a5ff2] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[500px]">
                {activeTab === 'Overview' ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#373758] text-[13px] font-black tracking-[0.2em] uppercase">Escrow Timeline</h3>
                      <Button variant="ghost" className="text-[#5a5ff2] font-black underline uppercase tracking-widest text-[11px]">Sync Calendar</Button>
                    </div>

                    <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm space-y-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -mr-16 -mt-16 blur-3xl" />

                      <div className="space-y-12 relative before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-50">
                        {[
                          { title: "Opening of Escrow", date: "April 06, 2024", completed: true },
                          { title: "Inspections Completed", date: "April 12, 2024", completed: true },
                          { title: "Loan Approval", date: "April 20, 2024", current: true },
                          { title: "Close of Escrow", date: "May 06, 2024", pending: true },
                        ].map((milestone, i) => (
                          <div key={i} className="flex gap-6 relative z-10">
                            <div className={cn(
                              "size-8 shrink-0 rounded-full flex items-center justify-center transition-all shadow-md",
                              milestone.completed ? "bg-[#5A5FF2] text-white" :
                                milestone.current ? "bg-white border-4 border-[#5A5FF2] text-[#5A5FF2] ring-8 ring-indigo-50" :
                                  "bg-white border border-slate-200 text-slate-300"
                            )}>
                              {milestone.completed ? <CheckCircle2 className="size-4" /> : <div className="size-2 rounded-full bg-current" />}
                            </div>
                            <div className="space-y-1">
                              <p className={cn("text-[16px] font-black tracking-tight", milestone.pending ? "text-slate-400" : "text-[#111827]")}>{milestone.title}</p>
                              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{milestone.date}</p>
                            </div>
                            {milestone.current && (
                              <div className="ml-auto">
                                <Badge className="bg-indigo-50 text-[#5a5ff2] border-none font-black text-[10px] h-8 px-4 uppercase tracking-widest">In Progress</Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 bg-[#fcfdff] rounded-[48px] border-2 border-dashed border-slate-100">
                    <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <Sparkles className="size-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-black tracking-widest uppercase text-[13px]">Coming Soon</p>
                    <p className="text-slate-500 font-medium text-[15px] mt-2">The {activeTab} module is under development.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AssignCollaboratorModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={(id, type, txId) => {
          setIsAssignModalOpen(false);
          toast.success("Assignment Confirmed");
        }}
        onOpenInvite={() => {
          setIsAssignModalOpen(false)
          setIsInviteModalOpen(true)
        }}
        globalPool={INITIAL_COLLABORATORS.map(c => ({
          ...c,
          role: c.type.toUpperCase() as any,
          status: 'active'
        }))}
        transactions={[{ id: transaction.id, address: transaction.address, status: transaction.status } as any]}
        clientName={transaction.clientName}
        canInvite={canInvite}
        defaultType="transaction"
        defaultTransactionId={transaction.id}
      />

      <ManageCollaboratorsModal
        open={isManageModalOpen}
        onOpenChange={setIsManageModalOpen}
        contextType="transaction"
        client={{ id: transaction.id, name: transaction.address }}
        assignedCollabs={assignedCollabs.map(c => ({
          id: c.id,
          name: c.name,
          role: c.role || (c.type === 'tc' ? 'TC' : 'Lender'),
          status: c.status || 'active'
        }))}
        assignments={localAssignments}
        globalPool={GLOBAL_COLLABORATOR_POOL}
        transactions={[transaction]}
        onAssign={(collabId, type) => {
          handleUpdateAccess(collabId, type);
        }}
        onUpdateAccess={handleUpdateAccess}
        onRemove={(collabId) => {
          setLocalAssignments(prev => prev.filter(a => a.collaboratorId !== collabId));
          setAssignedCollabs(prev => prev.filter(c => c.id !== collabId));
          toast.info("Access Removed");
        }}
      />

      <InviteCollaboratorModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInviteSent={(data) => {
          toast.success("Invitation successful");
        }}
        existingEmails={[]}
      />
    </>
  );
};
