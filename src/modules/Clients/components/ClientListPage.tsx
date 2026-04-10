import * as React from "react"
import {
  Plus,
  Settings,
  Grid,
  Upload,
  Filter,
  Bookmark,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Search,
  MoreHorizontal
} from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { Badge } from "../../../components/ui/Badge"
import { Checkbox } from "../../../components/ui/Checkbox"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useRole } from "@/contexts/RoleContext"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/DropdownMenu"
import {
  TooltipProvider,
} from "../../../components/ui/Tooltip"
import { MOCK_CLIENTS, GLOBAL_COLLABORATOR_POOL, MOCK_ASSIGNMENTS, MOCK_TRANSACTIONS } from "../mockData"
import { Client, MortgageStatus } from "../types"
import { ClientDetailSidePanel } from "./ClientDetailSidePanel"
import { AssignCollaboratorModal } from "./AssignCollaboratorModal"
import { InviteCollaboratorModal } from "../../TeamSettings/collaborators/components/InviteCollaboratorModal"
import { TypeBadge } from "../../TeamSettings/collaborators/components/badges/TypeBadge"
import { ManageCollaboratorsModal } from "./ManageCollaboratorsModal"

interface ClientListPageProps {
}

export function ClientListPage({ }: ClientListPageProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [isPanelOpen, setIsPanelOpen] = React.useState(false)
  const [shouldExpandCollab, setShouldExpandCollab] = React.useState(false)

  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [clientForAssign, setClientForAssign] = React.useState<Client | null>(null)
  const [clientForManage, setClientForManage] = React.useState<Client | null>(null)

  // Local state for instant updates
  const [localAssignments, setLocalAssignments] = React.useState<any[]>(MOCK_ASSIGNMENTS)
  const [localClients, setLocalClients] = React.useState<Client[]>(MOCK_CLIENTS)
  const { currentRole, isCollaborator, canInvite } = useRole()

  // Handle custom trigger from Manage Modal
  React.useEffect(() => {
    const handleOpenAssign = (e: any) => {
      setClientForAssign(e.detail.client)
      setIsAssignModalOpen(true)
    }
    window.addEventListener('open-assign-collab', handleOpenAssign)
    return () => window.removeEventListener('open-assign-collab', handleOpenAssign)
  }, [])

  const isMortgageVisible = ["LENDER"].includes(currentRole)
  const canEditMortgage = ["LENDER"].includes(currentRole)

  const handleMortgageStatusUpdate = (clientId: string, newStatus: MortgageStatus) => {
    setLocalClients(prev => prev.map(c => c.id === clientId ? { ...c, mortgage_status: newStatus } : c))

    if (newStatus === 'Approved' || newStatus === 'Rejected') {
      // Trigger notification (mock)
      console.log(`Notification: Client ${clientId} mortgage status changed to ${newStatus}. Assigned agent notified.`)
    }
  }

  const handleRowClick = (client: Client) => {
    setShouldExpandCollab(false) // Default: don't specific expand on row click
    setSelectedClient(client)
    setIsPanelOpen(true)
  }

  const handleAddCollabClick = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation()
    setClientForAssign(client)
    setIsAssignModalOpen(true)
  }

  const handleManageCollabClick = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation()
    setClientForManage(client)
    setIsManageModalOpen(true)
  }

  const handleRemoveCollaborator = (collaboratorId: string) => {
    if (!clientForManage) return
    setLocalAssignments(prev => prev.filter(a => 
      !(a.clientId === clientForManage.id && a.collaboratorId === collaboratorId)
    ))
  }

  const handleRemoveAllCollaborators = () => {
    if (!clientForManage) return
    setLocalAssignments(prev => prev.filter(a => a.clientId !== clientForManage.id))
    setIsManageModalOpen(false)
    toast.success("All Collaborators Removed", {
      className: "bg-[#EF4444] text-white border-none rounded-2xl",
    })
  }

  const handleUpdateAccess = (collaboratorId: string, newType: 'client' | 'transaction') => {
    if (!clientForManage) return
    setLocalAssignments(prev => prev.map(a => 
      (a.clientId === clientForManage.id && a.collaboratorId === collaboratorId)
        ? { ...a, assignmentType: newType }
        : a
    ))
  }

  const handleAssignSuccess = (collaboratorId: string, type: 'client' | 'transaction', transactionIds?: string[]) => {
    if (!clientForAssign) return

    if (type === 'transaction' && transactionIds) {
      const newAssignments = transactionIds.map(txId => ({
        id: `list-a-${Date.now()}-${txId}`,
        clientId: clientForAssign.id,
        collaboratorId,
        assignmentType: type,
        transactionId: txId,
        assignedAt: new Date().toISOString()
      }))
      setLocalAssignments(prev => [...prev, ...newAssignments])
    } else {
      const newAssignment = {
        id: `list-a-${Date.now()}`,
        clientId: clientForAssign.id,
        collaboratorId,
        assignmentType: type,
        assignedAt: new Date().toISOString()
      }
      setLocalAssignments(prev => [...prev, newAssignment])
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white">
        {/* Side Panel */}
        {selectedClient && (
          <ClientDetailSidePanel
            client={selectedClient}
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            collaborators={GLOBAL_COLLABORATOR_POOL}
            initialCollabExpanded={shouldExpandCollab}
          />
        )}

        {/* Global Modals for List Assignments */}
        {clientForAssign && (
          <AssignCollaboratorModal
            open={isAssignModalOpen}
            onOpenChange={setIsAssignModalOpen}
            onAssign={handleAssignSuccess}
            onOpenInvite={() => setIsInviteModalOpen(true)}
            globalPool={GLOBAL_COLLABORATOR_POOL}
            transactions={MOCK_TRANSACTIONS.filter(tx => tx.clientId === clientForAssign.id)}
            clientName={clientForAssign.name}
            canInvite={canInvite}
            defaultType="client"
          />
        )}

        {clientForManage && (
          <ManageCollaboratorsModal
            open={isManageModalOpen}
            onOpenChange={setIsManageModalOpen}
            client={clientForManage}
            assignedCollabs={GLOBAL_COLLABORATOR_POOL.filter(c => 
              localAssignments.some(a => a.clientId === clientForManage.id && a.collaboratorId === c.id)
            )}
            assignments={localAssignments}
            globalPool={GLOBAL_COLLABORATOR_POOL}
            transactions={MOCK_TRANSACTIONS.filter(tx => tx.clientId === clientForManage.id)}
            onRemove={handleRemoveCollaborator}
            onRemoveAll={handleRemoveAllCollaborators}
            onUpdateAccess={handleUpdateAccess}
            onAssign={handleAssignSuccess}
            onOpenInvite={() => setIsInviteModalOpen(true)}
            isGlobal={true}
            contextType="client"
          />
        )}

        <InviteCollaboratorModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
          onInviteSent={() => {
            // Logic handled by modal, could update pool here if dynamic
            setIsInviteModalOpen(false)
          }}
          existingEmails={GLOBAL_COLLABORATOR_POOL.map(c => c.email)}
        />
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[32px] font-bold text-[#373758] tracking-tight">Clients</h2>
            <Badge className="bg-[#E6F8EF] text-[#10B981] border-none font-bold text-[12px] h-6 flex items-center justify-center min-w-[50px] rounded-full">
              15000
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 text-[#373758] font-bold border-[#EFEFEF] rounded-[10px] h-10">
              Archived <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-[#373758] font-bold border-[#EFEFEF] rounded-[10px] h-10">
              <Settings className="h-4 w-4" /> Integrations
            </Button>
            {!isCollaborator && (
              <div className="flex items-center gap-3">
                <Button className="bg-white border border-[#5A5FF2] text-[#5A5FF2] hover:bg-[#5A5FF2]/5 font-bold px-6 h-10 rounded-[30px] flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Client
                </Button>
                <Button className="bg-[#5A5FF2]/10 text-[#5A5FF2] hover:bg-[#5A5FF2]/20 font-bold px-6 h-10 rounded-[30px] flex items-center gap-2 border-none">
                  <Upload className="h-4 w-4" /> Import CSV
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 w-full bg-white">
          <div className="relative flex-1 max-w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by client name or email address"
              className="pl-11 h-[44px] bg-[#F9FAFB] border-none focus-visible:ring-1 focus-visible:ring-[#5A5FF2] rounded-[10px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-[44px] px-6 text-[#373758] font-bold border-none bg-[#F9FAFB] rounded-[10px]">
            View Clients For <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" className="h-[44px] px-6 text-[#373758] font-bold border-none bg-[#F9FAFB] rounded-[10px]">
            Type: All <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" className="h-[44px] px-6 text-[#373758] font-bold border-none bg-[#F9FAFB] rounded-[10px]">
            Status <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" className="h-[44px] px-6 text-[#373758] font-bold border-none bg-[#F9FAFB] rounded-[10px]">
            <Grid className="h-4 w-4 mr-2" /> Columns <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" className="h-[44px] size-[44px] p-0 text-gray-400 hover:text-[#5A5FF2] bg-[#F9FAFB] rounded-[10px]">
            <Filter className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="h-[44px] px-6 text-[#9CA3AF] font-bold bg-[#F9FAFB] border-none flex items-center gap-2 italic rounded-[10px]">
            <Bookmark className="h-4 w-4" /> Save as Smart List
          </Button>
        </div>

        {/* Heritage Bulk Selection Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center justify-between bg-[#171717] rounded-[30px] p-3 shadow-2xl ring-1 ring-white/10 mb-6"
            >
              <div className="flex items-center gap-4 pl-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center size-7 rounded-full bg-[#5A5FF2] text-white text-[13px] font-black shadow-lg shadow-[#5A5FF2]/30">
                    {selectedIds.length}
                  </span>
                  <span className="text-[14px] font-black text-white uppercase tracking-widest">
                    Clients Selected
                  </span>
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <button 
                  onClick={() => setSelectedIds([])}
                  className="text-[12px] font-bold text-white/50 hover:text-white transition-colors uppercase tracking-[0.1em]"
                >
                  Clear Selection
                </button>
              </div>

              <div className="flex items-center gap-3 pr-1">
                <Button 
                  onClick={() => {
                    const client = localClients.find(c => c.id === selectedIds[0]);
                    if (client) {
                      setClientForAssign(client);
                      setIsAssignModalOpen(true);
                    }
                  }}
                  className="bg-[#5A5FF2] hover:bg-[#4B50D9] text-white rounded-[30px] px-8 h-12 font-black text-[14px] gap-3 shadow-xl shadow-[#5A5FF2]/20 border-none active:scale-95 transition-all group/bulk-btn"
                >
                  <Plus className="size-5 stroke-[4px] group-hover:rotate-90 transition-transform" />
                  Assign Collaborator
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Section */}
        <div className="border border-[#EFEFEF] rounded-[16px] bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-[#F9FAFB]">
              <TableRow className="hover:bg-transparent border-[#EFEFEF] h-[52px]">
                <TableHead className="w-[50px] pl-6">
                  <Checkbox 
                    checked={selectedIds.length === localClients.length && localClients.length > 0}
                    onCheckedChange={() => {
                      if (selectedIds.length === localClients.length) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(localClients.map(c => c.id));
                      }
                    }}
                    className="border-slate-300 data-[state=checked]:bg-[#5A5FF2] data-[state=checked]:border-[#5A5FF2]"
                  />
                </TableHead>
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  <div className="flex items-center gap-2">
                    Client Name <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  <div className="flex items-center gap-2">
                    Tags <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  <div className="flex items-center gap-2">
                    Score <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  <div className="flex items-center gap-2">
                    Created <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  <div className="flex items-center gap-2">
                    Updated <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  Type
                </TableHead>
                {isMortgageVisible && (
                  <TableHead className="text-[#373758] font-bold text-[14px]">
                    Mortgage Status
                  </TableHead>
                )}
                <TableHead className="text-[#373758] font-bold text-[14px]">
                  Collaborators
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localClients.map((client) => {
                const assignments = localAssignments.filter(a => a.clientId === client.id)
                const assignedCollabs = GLOBAL_COLLABORATOR_POOL.filter(c =>
                  assignments.some(a => a.collaboratorId === c.id)
                )

                return (
                  <TableRow
                    key={client.id}
                    className={cn(
                      "hover:bg-slate-50/50 cursor-pointer transition-all border-[#EFEFEF] h-[86px] group",
                      selectedIds.includes(client.id) && "bg-[#5A5FF2]/5"
                    )}
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell className="pl-6 w-12" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIds.includes(client.id)}
                        onCheckedChange={() => {
                          setSelectedIds(prev => 
                            prev.includes(client.id) ? prev.filter(id => id !== client.id) : [...prev, client.id]
                          );
                        }}
                        className="border-slate-300 data-[state=checked]:bg-[#5A5FF2] data-[state=checked]:border-[#5A5FF2]"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-[#373758]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-[32px] w-[32px] ring-2 ring-transparent group-hover:ring-[#5A5FF2]/20 transition-all">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-[#5A5FF2] hover:underline decoration-[2px] underline-offset-4 text-[13.5px] truncate max-w-[140px]">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {client.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 border-none text-slate-500 font-bold px-2 py-0.5 rounded-[4px] whitespace-nowrap">
                            {tag}
                          </Badge>
                        ))}
                        {client.tags.length > 2 && (
                          <Badge variant="outline" className="text-[10px] bg-white border-slate-100 text-[#5A5FF2] font-bold px-2 py-0.5 rounded-[4px] shadow-sm whitespace-nowrap">
                            +{client.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center w-[64px] h-[34px] border-2 border-[#5A5FF2] rounded-full text-[#5A5FF2] font-black text-[13px] gap-0.5 bg-white shadow-sm shadow-[#5A5FF2]/10 group-hover:scale-110 transition-transform">
                        <Plus className="h-3 w-3 stroke-[4px]" /> {client.score}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#373758] text-[13px] font-bold leading-tight">
                      {client.createdDate}<br />
                      <span className="text-slate-300 font-medium">12:00 PM</span>
                    </TableCell>
                    <TableCell className="text-[#373758] text-[13px] font-bold leading-tight">
                      {client.updatedDate}<br />
                      <span className="text-slate-300 font-medium">12:00 PM</span>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-cols-2 gap-1 w-fit">
                        {client.types.map((type, i) => (
                          <div key={i} className="flex items-center gap-1 text-[#10B981] font-bold text-[10px] bg-[#EEFDF6] px-2 py-0.5 rounded-full border border-[#10B981]/10 whitespace-nowrap">
                            {type}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    {isMortgageVisible && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={!canEditMortgage}>
                              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] font-bold text-[11px] transition-all border outline-none whitespace-nowrap
                              ${client.mortgage_status === 'Approved' ? 'bg-[#EEFDF6] text-[#10B981] border-[#10B981]/10' :
                                  client.mortgage_status === 'Pre-Approved' ? 'bg-[#5A5FF2]/10 text-[#5A5FF2] border-[#5A5FF2]/10' :
                                    client.mortgage_status === 'Rejected' ? 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/10' :
                                      'bg-slate-50 text-slate-500 border-slate-100'}`}
                              >
                                {client.mortgage_status || 'N/A'}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="rounded-[12px] p-1.5 border-[#EFEFEF]">
                              {(['N/A', 'Pre-Approved', 'Approved', 'Rejected'] as MortgageStatus[]).map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => handleMortgageStatusUpdate(client.id, status)}
                                  className={`rounded-[8px] font-bold text-[13px] px-3 py-2 cursor-pointer
                                  ${client.mortgage_status === status ? 'bg-[#5A5FF2]/5 text-[#5A5FF2]' : 'text-[#373758]'}`}
                                >
                                  {status}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    )}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-2 min-w-[200px] max-w-[320px] py-1">
                        {assignedCollabs.slice(0, 2).map((collab, idx, arr) => (
                          <div key={collab.id} className="flex items-center gap-2 group/collab transition-colors cursor-pointer w-fit" onClick={(e) => handleManageCollabClick(e, client)}>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={collab.avatar} />
                              <AvatarFallback className="text-[10px] bg-[#5A5FF2]/10 text-[#5A5FF2]">{collab.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-[13px] font-black text-[#373758] truncate leading-none max-w-[130px] group-hover/collab:text-[#5A5FF2] transition-colors">{collab.name}</span>
                            <TypeBadge type={collab.type as any} className="h-[14px] px-1.5 text-[8px]" />
                            
                            {idx === arr.length - 1 && assignedCollabs.length > 2 && (
                              <div className="flex items-center gap-1 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5A5FF2] px-2 py-0.5 rounded-full transition-colors ml-1">
                                <span className="text-[11px] font-bold">+{assignedCollabs.length - 2}</span>
                                <ChevronRight className="h-3 w-3 opacity-80" />
                              </div>
                            )}
                            {idx === arr.length - 1 && assignedCollabs.length <= 2 && (
                              <div className="flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 text-[#5A5FF2] transition-colors ml-1">
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        ))}

                        {assignedCollabs.length === 0 && (
                          <button
                            onClick={(e) => handleManageCollabClick(e, client)}
                            className="text-[13px] font-bold text-[#5A5FF2] underline underline-offset-2 leading-none hover:text-[#4B50D9] transition-colors w-fit"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6" onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-300 group-hover:text-slate-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}
