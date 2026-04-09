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
import { toast } from "sonner"
import { useRole } from "@/contexts/RoleContext"
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

        {/* Table Section */}
        <div className="border border-[#EFEFEF] rounded-[16px] bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-[#F9FAFB]">
              <TableRow className="hover:bg-transparent border-[#EFEFEF] h-[52px]">
                <TableHead className="w-[50px] pl-6">
                  <div className="w-[18px] h-[18px] border-2 border-gray-200 rounded-[2px]" />
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
                    className="hover:bg-slate-50/50 cursor-pointer transition-all border-[#EFEFEF] h-[86px] group"
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                      <div className="w-[18px] h-[18px] border-2 border-gray-200 group-hover:border-[#5A5FF2] rounded-[2px] transition-colors" />
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
                      <div className="flex items-center justify-between min-w-[180px] group/collab">
                        <div className="flex flex-col gap-0.5 justify-center py-1">
                          {/* 0 Collabs Case */}
                          {assignedCollabs.length === 0 && (
                            <div className="flex items-center gap-2 h-[18px]">
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                                None
                              </span>
                            </div>
                          )}

                          {/* 1 Collab Case */}
                          {assignedCollabs.length === 1 && (
                            <div className="flex items-center gap-1.5 h-[18px]">
                              <span className="text-[13px] font-black text-[#373758] truncate leading-none max-w-[100px]">
                                {assignedCollabs[0].name}
                              </span>
                              <TypeBadge type={assignedCollabs[0].type} className="h-[14px] px-1 text-[7px]" />
                            </div>
                          )}

                          {/* 2+ Collabs Case */}
                          {assignedCollabs.length >= 2 && (
                            <>
                              <div className="flex items-center gap-1.5 h-[18px]">
                                <span className="text-[13px] font-black text-[#373758] truncate leading-none max-w-[100px]">
                                  {assignedCollabs[assignedCollabs.length - 1].name}
                                </span>
                                <TypeBadge type={assignedCollabs[assignedCollabs.length - 1].type} className="h-[14px] px-1 text-[7px]" />
                              </div>
                              <div className="flex items-center gap-2 h-[18px]">
                                <button
                                  onClick={(e) => handleManageCollabClick(e, client)}
                                  className="text-[10px] font-bold text-slate-400 hover:text-[#5A5FF2] uppercase tracking-[0.05em] transition-colors leading-none"
                                >
                                  {assignedCollabs.length - 1} more
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Three-Dot Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300 hover:text-[#5A5FF2] hover:bg-[#5A5FF2]/10 transition-all opacity-0 group-hover/collab:opacity-100 data-[state=open]:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px] rounded-[16px] p-1.5 border-slate-100 shadow-[0px_10px_30px_rgba(0,0,0,0.1)]">
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-[#171717] gap-3 p-3 cursor-pointer"
                              onClick={(e) => handleAddCollabClick(e, client)}
                            >
                              <div className="size-8 rounded-full bg-[#5A5FF2]/10 flex items-center justify-center">
                                <Plus className="h-4 w-4 text-[#5A5FF2]" />
                              </div>
                              Add Collab
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-[#171717] gap-3 p-3 cursor-pointer"
                              onClick={(e) => handleManageCollabClick(e, client)}
                            >
                              <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <Settings className="h-4 w-4 text-slate-500" />
                              </div>
                              Manage
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
