import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/Dialog';
import { 
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Clock,
  Calendar,
  Sparkles,
  Star,
  ArrowLeft
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Client, Collaborator, ClientAssignment } from '../types';
import { MOCK_TRANSACTIONS, MOCK_ASSIGNMENTS } from '../mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRole } from '@/contexts/RoleContext';
import { AssignCollaboratorModal } from './AssignCollaboratorModal';
import { InviteCollaboratorModal } from '../../TeamSettings/collaborators/components/InviteCollaboratorModal';
import { CollaboratorCard } from './CollaboratorCard';

interface ClientDetailSidePanelProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  collaborators: Collaborator[];
  initialCollabExpanded?: boolean;
  initialTab?: string;
}

export const ClientDetailSidePanel: React.FC<ClientDetailSidePanelProps> = ({
  client,
  isOpen,
  onClose,
  collaborators,
  initialCollabExpanded = true,
  initialTab = 'Activity'
}) => {
  const { isCollaborator, selectedTransaction, canInvite, canAssign } = useRole();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCollabExpanded, setIsCollabExpanded] = useState(initialCollabExpanded);
  const [modalDefaultType, setModalDefaultType] = useState<'client' | 'transaction'>('client');
  const [modalDefaultTxId, setModalDefaultTxId] = useState<string | undefined>(undefined);
  const [assignments, setAssignments] = useState<ClientAssignment[]>(
    MOCK_ASSIGNMENTS.filter(a => a.clientId === client.id)
  );

  React.useEffect(() => {
    if (isOpen) {
      setIsCollabExpanded(initialCollabExpanded);
    }
  }, [isOpen, initialCollabExpanded]);

  const clientTransactions = React.useMemo(() => {
    const txs = MOCK_TRANSACTIONS.filter(t => t.clientId === client.id);
    if (isCollaborator && selectedTransaction) {
      return txs.filter(t => t.id === selectedTransaction.id);
    }
    return txs;
  }, [client.id, isCollaborator, selectedTransaction]);

  // Derived: Current collaborators for this client
  const assignedCollabs = collaborators.filter(c => 
    assignments.some(a => a.collaboratorId === c.id)
  );

  const handleAssign = (collaboratorId: string, type: 'client' | 'transaction', transactionIds?: string[]) => {
    // Union Logic: Client-level access supersedes transaction-level access.
    const isAlreadyAtClient = assignments.some(a => a.collaboratorId === collaboratorId && a.assignmentType === 'client');
    
    if (type === 'client') {
      if (isAlreadyAtClient) {
        toast.info("Collaborator already has client-wide access.");
        return;
      }
      
      const newAssignment: ClientAssignment = {
        id: `a${Date.now()}`,
        clientId: client.id,
        collaboratorId,
        assignmentType: 'client',
        assignedAt: new Date().toISOString()
      };
      
      setAssignments(prev => [
        ...prev.filter(a => !(a.collaboratorId === collaboratorId && a.assignmentType === 'transaction')), 
        newAssignment
      ]);
    } else if (transactionIds) {
      if (isAlreadyAtClient) {
        toast.info("Collaborator already has client-wide access (covers all transactions).");
        return;
      }
      
      const newAssignments: ClientAssignment[] = transactionIds.map(txId => ({
        id: `a${Date.now()}-${txId}`,
        clientId: client.id,
        collaboratorId,
        assignmentType: 'transaction',
        transactionId: txId,
        assignedAt: new Date().toISOString()
      }));

      setAssignments(prev => [...prev.filter(a => !transactionIds.includes(a.transactionId || '')), ...newAssignments]);
    }
  };

  const openAssignModal = (type: 'client' | 'transaction' = 'client', txId?: string) => {
    setModalDefaultType(type);
    setModalDefaultTxId(txId);
    setIsAssignModalOpen(true);
  };

  const tabs = isCollaborator 
    ? ['Activity', 'Transactions', 'Notes', 'Reminders']
    : ['Activity', 'Searches', 'Property recommendations', 'Transactions', 'Notes', 'Reminders'];

  if (!client) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
        <DialogContent 
          className="fixed top-0 !right-0 h-full w-[1100px] max-w-[95vw] bg-white p-0 shadow-2xl transition-all duration-300 ease-in-out font-sans flex flex-col border-none rounded-none !left-auto !translate-x-0 !translate-y-0 outline-none z-[200] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:!slide-in-from-right-full data-[state=closed]:!slide-out-to-right-full"
          overlayClassName="z-[200]"
        >
          <div className="flex-1 overflow-y-auto no-scrollbar pt-6 px-6 pb-20">
            {/* Original Card Design Reverted */}
            <div className="bg-white border-[#e5e5e5] border-[0.909px] border-solid flex flex-col items-start p-6 relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full">
              {/* Profile Header Row */}
              <div className="flex gap-4 items-center w-full mb-4">
                <button 
                  onClick={onClose} 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors group"
                  aria-label="Back"
                >
                  <ArrowLeft className="size-5 text-[#5a5ff2] group-hover:scale-110 transition-transform" />
                </button>
                <Avatar className="size-[48px]">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-[18px] font-semibold text-[#171717] tracking-tight">{client.name}</h2>
                      <div className="flex gap-1.5 mt-1">
                        {client.types.map((type, i) => (
                           <Badge key={i} className="bg-[#eff8fe] text-[#0c4a6e] hover:bg-[#eff8fe] border-none font-medium px-2 py-0.5 text-[11px] rounded-full uppercase">{type}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="text-[#5a5ff2] font-semibold text-[14px] hover:text-[#5a5ff2]/80 gap-1 pr-1 py-1">
                        SEND APP INVITE
                        <ChevronDown className="size-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[#737373]">
                        <MoreVertical className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#e5e5e5] mb-4" />

              {/* Status & Agent Select Row */}
              <div className="flex items-center gap-4 w-full mb-4">
                <div className="bg-[#dcfce7] border-[#86efac] border-[0.909px] flex h-[38px] items-center justify-between px-3 rounded-[10px] w-[220px] cursor-pointer hover:bg-[#dcfce7]/80">
                  <span className="text-[#166534] text-[14px] font-medium uppercase tracking-wider">New Client</span>
                  <ChevronDown className="size-4 text-[#166534]" />
                </div>

                {/* Assigned Agent */}
                <div className="bg-[#f5f5f5] flex items-center px-3 py-1 rounded-[8px] h-[38px] flex-1 cursor-pointer hover:bg-[#efeff0]">
                  <div className="flex items-center gap-2 flex-1">
                    <Avatar className="size-5">
                      <AvatarImage src="https://i.pravatar.cc/150?u=monica" />
                      <AvatarFallback className="text-[8px]">MM</AvatarFallback>
                    </Avatar>
                    <span className="text-[#525252] text-[14px] font-medium">Monica Miller</span>
                  </div>
                  <ChevronDown className="size-4 text-[#525252]" />
                </div>
              </div>

              <Separator className="bg-[#e5e5e5] mb-4" />

              {/* Contact Details Grid */}
              <div className="grid grid-cols-4 gap-4 w-full mb-4">
                <div>
                  <p className="text-[#a3a3a3] text-[12px] mb-1 font-medium">Email</p>
                  <span className="text-[#525252] text-[14px] font-semibold truncate block">{client.email}</span>
                </div>
                <div>
                  <p className="text-[#a3a3a3] text-[12px] mb-1 font-medium">Phone</p>
                  <span className="text-[#525252] text-[14px] font-semibold">{client.phone}</span>
                </div>
                <div>
                  <p className="text-[#a3a3a3] text-[12px] mb-1 font-medium">Added on</p>
                  <span className="text-[#525252] text-[14px] font-semibold">{client.addedOn}</span>
                </div>
                <div>
                  <p className="text-[#a3a3a3] text-[12px] mb-1 font-medium">Source</p>
                  <span className="text-[#525252] text-[14px] font-semibold leading-none">{client.source || "-"}</span>
                </div>
              </div>

              <Separator className="bg-[#e5e5e5] mb-3" />

              {/* Accordion Sections with Integrated Logic */}
              <div className="w-full space-y-3">
                {!isCollaborator && (
                  <>
                    <div className="flex items-center justify-between w-full h-[32px]">
                      <span className="text-[#111827] text-[14px] font-semibold">AI Prospecting</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#5a5ff2] text-[14px] font-medium cursor-pointer hover:underline">Edit</span>
                        <div className="w-[38px] h-[22px] bg-[#e5e5e5] rounded-full relative cursor-pointer">
                          <div className="absolute left-[3px] top-[3px] size-4 bg-white rounded-full transition-all" />
                        </div>
                      </div>
                    </div>
                    <Separator className="bg-[#e5e5e5]" />
                  </>
                )}

                <div className="flex items-center justify-between w-full h-[32px] cursor-pointer group">
                  <span className="text-[#111827] text-[14px] font-semibold">Additional Details</span>
                  <ChevronRight className="size-5 text-[#111827] group-hover:translate-x-1 transition-transform" />
                </div>

                <Separator className="bg-[#e5e5e5]" />

                <div className="flex items-center justify-between w-full h-[32px] cursor-pointer group">
                  <span className="text-[#111827] text-[14px] font-semibold">Tags</span>
                  <ChevronRight className="size-5 text-[#111827] group-hover:translate-x-1 transition-transform" />
                </div>

                <Separator className="bg-[#e5e5e5]" />

                <div className="flex items-center justify-between w-full h-[32px] cursor-pointer">
                  <span className="text-[#111827] text-[14px] font-semibold">Family Members</span>
                  <div className="flex items-center gap-3">
                     {canAssign && (
                       <div className="size-6 rounded-full border border-[#5a5ff2] flex items-center justify-center hover:bg-[#5a5ff2]/5 transition-colors">
                         <Plus className="size-3 text-[#5a5ff2]" />
                       </div>
                     )}
                     <ChevronRight className="size-5 text-[#111827]" />
                  </div>
                </div>

                <Separator className="bg-[#e5e5e5]" />

                {/* Innovative Collaborator Cards */}
                <div className="w-full">
                  <div className="flex items-center justify-between w-full h-[32px] cursor-pointer py-1" onClick={() => setIsCollabExpanded(!isCollabExpanded)}>
                    <div className="flex items-center gap-2">
                      <span className="text-[#111827] text-[14px] font-bold">Collaborators</span>
                      {assignedCollabs.length > 0 && (
                        <Badge className="bg-[#5a5ff2] hover:bg-[#5a5ff2] text-white text-[12px] h-[20px] px-1.5 min-w-[20px] flex items-center justify-center rounded-full border-none">
                          {assignedCollabs.length}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {canAssign && (
                        <div 
                          className="size-6 rounded-full border border-[#5a5ff2] flex items-center justify-center hover:bg-[#5a5ff2]/5 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssignModal('client');
                          }}
                        >
                          <Plus className="size-3 text-[#5a5ff2]" />
                        </div>
                      )}
                      {isCollabExpanded ? (
                        <ChevronDown className="size-5 text-[#111827]" />
                      ) : (
                        <ChevronRight className="size-5 text-[#111827]" />
                      )}
                    </div>
                  </div>
                  
                  {isCollabExpanded && (
                    <div className="pt-2">
                      {assignedCollabs.length > 0 ? (
                        <div className="space-y-4 py-4">
                          {assignedCollabs.map((collab) => {
                            const assignment = assignments.find(a => a.collaboratorId === collab.id);
                            const tx = clientTransactions.find(t => t.id === assignment?.transactionId);
                            
                            return (
                              <CollaboratorCard 
                                key={collab.id}
                                collaborator={collab}
                                assignmentType={assignment?.assignmentType}
                                transaction={tx}
                                onResendInvite={() => {
                                  toast.success("Invitation successful", {
                                    description: `Link sent to ${collab.email}.`,
                                  });
                                }}
                                onChat={() => {
                                  toast.info(`Opening chat with ${collab.name}...`);
                                }}
                                onRemoveAccess={canAssign ? () => {
                                   setAssignments(prev => prev.filter(a => a.collaboratorId !== collab.id));
                                   toast.info("Collaborator access removed.");
                                } : undefined}
                              />
                            );
                          })}
                           {canAssign && (
                            <Button 
                              variant="ghost" 
                              className="text-[#5A5FF2] hover:text-[#5A5FF2] hover:bg-transparent font-black text-[14px] flex items-center gap-1.5 p-0 h-9 mt-2 bg-transparent transition-all group"
                              onClick={() => {
                                setModalDefaultType('client');
                                setIsAssignModalOpen(true);
                              }}
                            >
                              <Plus className="size-4" />
                              Collaborator
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-[#9ca3af] text-[14px] text-center mb-3">No connected collaborators</p>
                          {canAssign && (
                            <Button 
                              variant="outline" 
                              className="rounded-full border-[#5a5ff2] text-[#5a5ff2] text-[13px] font-bold px-5 h-9 hover:bg-[#5a5ff2]/5"
                              onClick={() => openAssignModal('client')}
                            >
                              + Collaborator
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator className="bg-[#e5e5e5]" />

                <div className="flex items-center justify-between w-full h-[32px] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-[#111827] text-[14px] font-semibold">Buyer Representation</span>
                    <Badge className="bg-[#5a5ff2] hover:bg-[#5a5ff2] text-white text-[12px] h-[20px] px-1.5 min-w-[20px] flex items-center justify-center rounded-full border-none">1</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="size-6 rounded-full border border-[#5a5ff2] flex items-center justify-center hover:bg-[#5a5ff2]/5 transition-colors">
                       <Plus className="size-3 text-[#5a5ff2]" />
                     </div>
                     <ChevronRight className="size-5 text-[#111827]" />
                  </div>
                </div>
              </div>
            </div>

            {!isCollaborator && (
              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-[#262626] hover:bg-[#1a1a1a] text-white rounded-[20px] h-[52px] flex items-center justify-center gap-2 group shadow-xl">
                  <Sparkles className="size-5 text-[#a78bfa] group-hover:animate-pulse" />
                  <span className="text-[14px] font-bold">Jarvis, summarize {client.name.split(' ')[0].toLowerCase()}</span>
                </Button>
                <Button variant="outline" className="flex-1 bg-[#f0f2f5] border-none hover:bg-[#e4e7eb] rounded-[20px] h-[52px] flex items-center justify-center gap-2 shadow-sm">
                  <Star className="size-5 text-amber-500 fill-amber-500" />
                  <span className="text-[14px] font-bold text-[#171717]">{client.score || "9.5"}/10 | View Last Summary</span>
                </Button>
              </div>
            )}

            {/* Tabs Section */}
            <div className="mt-8">
              <div className="flex gap-8 border-b border-[#e5e5e5] overflow-x-auto no-scrollbar mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "pb-3 text-[14px] font-bold transition-colors whitespace-nowrap relative px-1",
                      activeTab === tab ? "text-[#5a5ff2]" : "text-[#737373] hover:text-[#525252]"
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5a5ff2]" />
                    )}
                  </button>
                ))}
              </div>

          <div className="min-h-[400px]">
            {activeTab === 'Activity' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#737373] text-[12px] font-bold tracking-widest uppercase">ALL ACTIVITY</h3>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-[#737373] hover:bg-gray-100 rounded-[10px]">
                      <MoreVertical className="size-5" />
                    </Button>
                    <Button variant="outline" className="border-[#5a5ff2] text-[#5a5ff2] h-[36px] rounded-[8px] hover:bg-[#5a5ff2]/5 flex items-center gap-2 px-4 shadow-sm font-bold text-[13px]">
                      <Plus className="size-4" />
                      Export activity
                    </Button>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border-y border-[#efeff4] px-6 py-3 -mx-6 mb-4">
                  <span className="text-[#737373] text-[13px] font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Today 15 Jan 2026
                  </span>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="h-[40px] w-[40px] rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm">
                        <Calendar className="h-4 w-4 text-slate-500" />
                      </div>
                      <span className="text-[14px] font-bold text-slate-900">Thursday, Jan 15 2026</span>
                    </div>
                    
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4 relative z-10 pl-1">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-white border-2 border-[#5A5FF2] flex items-center justify-center shadow-lg shadow-[#5A5FF2]/10">
                          <CheckCircle2 className="h-5 w-5 text-[#5A5FF2]" />
                        </div>
                        <div className="flex-1 bg-white p-6 rounded-[28px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[15px] font-bold text-slate-900">Document Signature Secured</h4>
                            <span className="text-[12px] text-slate-400 font-medium">10:45 AM</span>
                          </div>
                          <p className="text-[14px] text-slate-600 leading-relaxed">
                            Violet Cole signed the <span className="text-[#5A5FF2] font-bold">Buyer Representation Agreement</span> for the property at 456 Castro Avenue.
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src="https://i.pravatar.cc/150?u=monica" />
                              <AvatarFallback>MM</AvatarFallback>
                            </Avatar>
                            <span className="text-[12px] text-slate-500 font-medium">Processed by Monica Miller</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 'Transactions' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#737373] text-[12px] font-bold tracking-widest uppercase">ACTIVE TRANSACTIONS</h3>
                </div>

                <div className="space-y-4">
                  {clientTransactions.map((tx) => {
                    return (
                      <div key={tx.id} className="bg-white border border-[#F1F4F9] p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="text-[18px] font-black text-[#111827] tracking-tight group-hover:text-[#5A5FF2] transition-colors cursor-pointer">{tx.address}</h4>
                            <div className="flex items-center gap-2">
                               <p className="text-[16px] font-black text-[#10B981]">${(tx.price || 400000).toLocaleString()}</p>
                               <span className="text-slate-300">•</span>
                               <p className="text-[13px] font-bold text-slate-400">3 Beds, 2 Baths, 3000 Sq.ft</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <Badge className="bg-[#EFF8FE] text-[#0C4A6E] border-none font-black text-[10px] px-3 h-7 tracking-widest uppercase rounded-full">Buyer</Badge>
                             <div className="bg-[#F0FDF4] border-[#DCFCE7] border-[1px] flex h-7 items-center justify-between px-3 rounded-full cursor-pointer hover:bg-[#F0FDF4]/80 transition-all gap-2">
                                <span className="text-[#15803D] text-[10px] font-black uppercase tracking-widest">New Offer</span>
                                <ChevronDown className="size-3 text-[#15803D]" />
                             </div>
                             
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors outline-none">
                                     <MoreVertical className="size-5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px] rounded-[16px] p-2 border-slate-100 shadow-xl bg-white z-[301]">
                                  {canAssign && (
                                    <DropdownMenuItem 
                                      className="rounded-[10px] py-2.5 font-bold text-[#374151] flex items-center gap-2 cursor-pointer focus:bg-[#F5F3FF] focus:text-[#5A5FF2]"
                                      onClick={() => openAssignModal('transaction', tx.id)}
                                    >
                                      <Plus className="size-4" />
                                      Collaborator
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                  <DropdownMenuItem className="rounded-[10px] py-2.5 font-medium text-slate-500 cursor-pointer">
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-4 pt-4 border-t border-[#F1F4F9]">
                          <div>
                            <p className="text-[#A3A3A3] text-[10px] font-black uppercase tracking-widest mb-1">Client name</p>
                            <div className="flex items-center gap-1.5 overflow-hidden">
                               <div className="size-4 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                  <div className="size-1.5 rounded-full bg-[#5a5ff2]" />
                               </div>
                               <div className="flex items-center gap-1 overflow-hidden">
                                 <span className="text-[13px] font-bold text-[#374151] truncate">
                                   {client.name}
                                 </span>
                                 <Badge className="bg-[#F5F3FF] text-[#8B5CF6] border-none text-[8.5px] px-1.5 h-3.5 flex items-center justify-center rounded-full font-bold uppercase tracking-tight shrink-0">+2 more</Badge>
                               </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-[#A3A3A3] text-[10px] font-black uppercase tracking-widest mb-1">Acceptance</p>
                            <span className="text-[13px] font-bold text-[#374151] truncate block">{tx.acceptanceDate || "Nov 28, 2024"}</span>
                          </div>
                          <div>
                            <p className="text-[#A3A3A3] text-[10px] font-black uppercase tracking-widest mb-1">Close of escrow</p>
                            <span className="text-[13px] font-bold text-[#374151] truncate block">{tx.closeOfEscrow || "Nov 28, 2024"}</span>
                          </div>
                          <div>
                            <p className="text-[#A3A3A3] text-[10px] font-black uppercase tracking-widest mb-1">Agent name</p>
                            <div className="flex items-center gap-1.5 overflow-hidden">
                               <div className="size-4 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                  <div className="size-1.5 rounded-full bg-[#5a5ff2]" />
                               </div>
                               <span className="text-[13px] font-bold text-[#374151] truncate">
                                 {tx.agentName || "Any Williams"}
                               </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[#A3A3A3] text-[10px] font-black uppercase tracking-widest mb-1">Collaborator</p>
                            <div className="flex items-center gap-1.5 overflow-hidden">
                               <div className="size-4 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                  <div className="size-1.5 rounded-full bg-[#5a5ff2]" />
                               </div>
                               <div className="flex items-center gap-1 overflow-hidden">
                                 <span className="text-[13px] font-bold text-[#374151] truncate">
                                   {tx.collaborators?.[0]?.name || "None"}
                                 </span>
                                 {tx.collaborators?.length > 1 && (
                                   <Badge className="bg-[#F5F3FF] text-[#8B5CF6] border-none text-[8.5px] px-1.5 h-3.5 flex items-center justify-center rounded-full font-bold uppercase tracking-tight shrink-0">
                                     +{tx.collaborators.length - 1} more
                                   </Badge>
                                 )}
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                <Sparkles className="size-10 text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium text-[15px]">No {activeTab} data found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
      </Dialog>

      {/* MODALS MOVED OUTSIDE FOR BETTER Z-INDEX HANDLING */}
      <AssignCollaboratorModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={handleAssign}
        onOpenInvite={() => {
          setIsAssignModalOpen(false)
          setIsInviteModalOpen(true)
        }}
        globalPool={collaborators}
        transactions={clientTransactions}
        clientName={client.name}
        canInvite={canInvite}
        defaultType={modalDefaultType}
        defaultTransactionId={modalDefaultTxId}
      />

      <InviteCollaboratorModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInviteSent={(data) => {
          console.log("Invite sent", data);
          toast.success("Invitation successful", {
            description: `Link sent to ${data.email}.`,
          });
        }}
        existingEmails={collaborators.map(c => c.email)}
      />
    </>
  );
};
