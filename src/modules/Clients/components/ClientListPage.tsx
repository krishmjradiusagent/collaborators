import * as React from "react"
import {
  Plus,
  Grid,
  Upload,
  Download,
  Filter,
  Bookmark,
  MoreVertical,
  ChevronDown,
  Search,
  Users,
  ShieldAlert
} from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { Badge } from "../../../components/ui/Badge"
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
  TooltipProvider,
} from "../../../components/ui/Tooltip"
import { MOCK_CLIENTS, GLOBAL_COLLABORATOR_POOL, MOCK_ASSIGNMENTS, MOCK_TRANSACTIONS } from "../mockData"
import { Client } from "../types"
import { ClientDetailSidePanel } from "./ClientDetailSidePanel"
import { AssignCollaboratorModal } from "./AssignCollaboratorModal"
import { InviteCollaboratorModal } from "../../TeamSettings/collaborators/components/InviteCollaboratorModal"
import { useRole } from "../../../contexts/RoleContext"

interface ClientListPageProps {
  onSelectClient?: (client: Client) => void
}

export function ClientListPage({ onSelectClient }: ClientListPageProps) {
  const { role, activeContext, activeTeam } = useRole()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [isPanelOpen, setIsPanelOpen] = React.useState(false)

  const isCollaborator = ['TC/VA', 'Lender', 'Vendor'].includes(role)

  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [clientForAssign, setClientForAssign] = React.useState<Client | null>(null)

  // Local state for instant updates
  const [localAssignments, setLocalAssignments] = React.useState<any[]>(MOCK_ASSIGNMENTS)

  const filteredClients = React.useMemo(() => {
    if (!activeContext) return MOCK_CLIENTS
    
    if (activeContext.type === 'client') {
      return MOCK_CLIENTS.filter(c => c.id === activeContext.id || c.name === activeContext.name)
    }
    
    if (activeContext.type === 'transaction') {
      const txn = MOCK_TRANSACTIONS.find(t => t.id === activeContext.id || activeContext.name.includes(t.address))
      if (txn) {
        return MOCK_CLIENTS.filter(c => c.id === txn.clientId)
      }
      // If we can't find by ID, try fuzzy match name
      return MOCK_CLIENTS.filter(c => c.id === 'client-1') // Fallback to first for demo
    }

    if (activeContext.type === 'agent') {
      // In production, filter by assigned agent. Here we just show all for the team context.
      return MOCK_CLIENTS
    }

    return MOCK_CLIENTS
  }, [activeContext])

  const handleRowClick = (client: Client) => {
    setSelectedClient(client)
    setIsPanelOpen(true)
    onSelectClient?.(client)
  }

  const handleAddCollabClick = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation()
    setClientForAssign(client)
    setIsAssignModalOpen(true)
  }

  const handleAssignSuccess = (collaboratorId: string, type: 'client' | 'transaction', transactionIds?: string[]) => {
    if (!clientForAssign) return

    const newAssignments = (transactionIds && transactionIds.length > 0) 
      ? transactionIds.map(txId => ({
          id: `list-a-${Date.now()}-${txId}`,
          clientId: clientForAssign.id,
          collaboratorId,
          assignmentType: type,
          transactionId: txId,
          assignedAt: new Date().toISOString()
        }))
      : [{
          id: `list-a-${Date.now()}`,
          clientId: clientForAssign.id,
          collaboratorId,
          assignmentType: type,
          assignedAt: new Date().toISOString()
        }]

    setLocalAssignments(prev => [...prev, ...newAssignments])
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white min-h-[calc(100vh-64px)]">
        {/* Side Panel */}
        {selectedClient && (
          <ClientDetailSidePanel
            client={selectedClient}
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            collaborators={GLOBAL_COLLABORATOR_POOL}
            initialCollabExpanded={false}
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
            canInvite={!isCollaborator}
            defaultType="client"
          />
        )}

        <InviteCollaboratorModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
          onInviteSent={() => {
            setIsInviteModalOpen(false)
          }}
          existingEmails={GLOBAL_COLLABORATOR_POOL.map(c => c.email)}
        />

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-[32px] font-black text-[#111827] tracking-tight">
                {isCollaborator ? "Your Clients" : "Clients"}
              </h2>
              <Badge 
                className="text-white border-none font-black text-[12px] h-7 flex items-center justify-center min-w-[50px] rounded-xl px-3"
                style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
              >
                {filteredClients.length}
              </Badge>
            </div>
            {isCollaborator && (
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mirror CRM Perspective</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isCollaborator && (
              <>
                <Button variant="outline" className="flex items-center gap-2 text-slate-600 font-bold border-slate-100 rounded-xl h-12 px-5 hover:bg-slate-50 transition-all">
                  Archived <ChevronDown className="h-4 w-4 opacity-40" />
                </Button>
                <Button variant="outline" className="flex items-center gap-2 text-slate-600 font-bold border-slate-100 rounded-xl h-12 px-5 hover:bg-slate-50 transition-all">
                  <Grid className="h-4 w-4 opacity-40" /> Integrations
                </Button>
                <Button 
                  className="text-white hover:opacity-90 font-black px-8 h-12 rounded-[16px] flex items-center gap-2 shadow-lg shadow-[#5A5FF2]/10 transition-all border-none"
                  style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
                >
                  <Plus className="h-4 w-4 stroke-[3px]" /> Client
                </Button>
                <Button className="bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold px-6 h-12 rounded-xl flex items-center gap-2 border-none">
                  <Upload className="h-4 w-4 opacity-40" /> Import
                </Button>
                <Button className="bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold px-6 h-12 rounded-xl flex items-center gap-2 border-none">
                  <Download className="h-4 w-4 opacity-40" /> Export
                </Button>
              </>
            )}
            {isCollaborator && (
              <Button className="bg-[#5A5FF2]/5 text-[#5A5FF2] hover:bg-[#5A5FF2]/10 font-black px-8 h-12 rounded-xl border-none">
                REFRESH DATA
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 w-full">
          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <Input
              placeholder="Search context pool..."
              className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#5A5FF2]/20 rounded-[20px] font-medium text-[15px] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 px-8 text-slate-600 font-black border-slate-100 bg-white rounded-[20px] shadow-sm hover:bg-slate-50 transition-all">
            View For: <span className="ml-2 text-[#5A5FF2]">{activeContext?.name || "All"}</span> <ChevronDown className="h-4 w-4 ml-2 opacity-30" />
          </Button>
          <Button variant="outline" className="h-14 px-8 text-slate-600 font-black border-slate-100 bg-white rounded-[20px] shadow-sm hover:bg-slate-50 transition-all">
            Type: All <ChevronDown className="h-4 w-4 ml-2 opacity-30" />
          </Button>
          <Button variant="outline" className="h-14 px-8 text-slate-600 font-black border-slate-100 bg-white rounded-[20px] shadow-sm hover:bg-slate-50 transition-all">
            Status <ChevronDown className="h-4 w-4 ml-2 opacity-30" />
          </Button>
          {!isCollaborator && (
            <Button variant="outline" className="h-14 px-8 text-slate-600 font-black border-slate-100 bg-white rounded-[20px] shadow-sm hover:bg-slate-50 transition-all">
              <Grid className="h-4 w-4 mr-2 opacity-40" /> Columns <ChevronDown className="h-4 w-4 ml-2 opacity-30" />
            </Button>
          )}
          <Button variant="ghost" className="h-14 size-14 p-0 text-slate-400 hover:text-[#5A5FF2] bg-slate-50 rounded-[20px] hover:bg-slate-100 transition-all">
            <Filter className="h-6 w-6" />
          </Button>
          {!isCollaborator && (
            <Button variant="outline" className="h-14 px-8 text-slate-300 font-black bg-white border-slate-100 flex items-center gap-2 italic rounded-[20px] shadow-sm hover:border-[#5A5FF2]/30 transition-all">
              <Bookmark className="h-4 w-4" /> Save Smart List
            </Button>
          )}
        </div>

        {/* Permission Warning for Mirror View */}
        {isCollaborator && (
          <div className="p-5 rounded-[24px] bg-amber-50 border border-amber-100 flex items-center gap-5">
            <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="size-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[16px] font-black text-amber-900 leading-none mb-1.5">Context Isolation Enabled</p>
              <p className="text-[13px] text-amber-800 font-bold opacity-80">You are currently restricted to viewing data associated with your active assignments. Sensitive metadata and administrative controls are shielded.</p>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="border border-slate-100 rounded-[32px] bg-white overflow-hidden shadow-xl shadow-slate-200/40">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-slate-100 h-14">
                <TableHead className="w-[80px] pl-8">
                  <div className="w-[20px] h-[20px] border-2 border-slate-200 rounded-[6px]" />
                </TableHead>
                <TableHead className="text-slate-400 font-black text-[11px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    Identity <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-400 font-black text-[11px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    Classification <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-400 font-black text-[11px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    Engagement <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-400 font-black text-[11px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    Lifecycle <ChevronDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-400 font-black text-[11px] uppercase tracking-widest">
                  Relationship
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const assignments = localAssignments.filter(a => a.clientId === client.id)
                const assignedCollabs = GLOBAL_COLLABORATOR_POOL.filter(c =>
                  assignments.some(a => a.collaboratorId === c.id)
                )

                return (
                  <TableRow
                    key={client.id}
                    className="hover:bg-slate-50/50 cursor-pointer transition-all border-slate-50 h-[100px] group"
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell className="pl-8" onClick={(e) => e.stopPropagation()}>
                      <div className="w-[20px] h-[20px] border-2 border-slate-200 group-hover:border-[#5A5FF2] rounded-[6px] transition-colors" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-[48px] w-[48px] ring-4 ring-transparent group-hover:ring-[#5A5FF2]/10 transition-all rounded-[16px]">
                          <AvatarImage src={client.avatar} className="object-cover" />
                          <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">{client.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-[16px] font-black text-slate-900 leading-tight group-hover:text-[#5A5FF2] transition-colors">{client.name}</span>
                          <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">{client.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2 max-w-[280px]">
                        {client.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 border-none text-slate-500 font-black px-3 py-1 rounded-lg uppercase">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center justify-center w-[72px] h-[38px] border-2 rounded-full text-white font-black text-[14px] gap-0.5 shadow-lg group-hover:scale-110 transition-all border-none"
                        style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
                      >
                        {client.score}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-900 text-[13px] font-black leading-tight">
                      <span className="text-slate-400 uppercase tracking-tighter text-[10px] mb-1 block">Created</span>
                      {client.createdDate}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-1 min-w-[160px] py-2 justify-center">
                        {assignedCollabs.length === 0 && (
                          <div className="flex items-center gap-3 h-[24px]">
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none">
                              Unassigned
                            </span>
                            {!isCollaborator && (
                              <button
                                onClick={(e) => handleAddCollabClick(e, client)}
                                className="h-7 w-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#5A5FF2] hover:bg-[#5A5FF2] hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                              >
                                <Plus className="h-3.5 w-3.5 stroke-[4px]" />
                              </button>
                            )}
                          </div>
                        )}

                        {assignedCollabs.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                  <Users className="size-4 text-slate-400" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[14px] font-black text-slate-900 leading-none mb-1">
                                    {isCollaborator ? activeTeam?.name : assignedCollabs[0].name}
                                  </span>
                                  <Badge className="bg-slate-50 text-slate-400 border-none h-4 px-1.5 text-[8px] font-black uppercase tracking-widest rounded-md w-fit">
                                     {isCollaborator ? "TEAM" : assignedCollabs[0].type.toUpperCase()}
                                  </Badge>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-8" onClick={(e) => e.stopPropagation()}>
                      <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 group-hover:text-slate-900">
                        <MoreVertical className="h-6 w-6" />
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
