import * as React from "react"
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  MoreVertical, 
  Plus, 
  Send, 
  MessageSquare,
  MoreHorizontal,
  Users,
  ShieldCheck
} from "lucide-react"
import { useRole } from "../../../contexts/RoleContext"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "../../../components/ui/Tooltip"
import { cn } from "../../../lib/utils"
import { Button } from "../../../components/ui/Button"
import { Badge } from "../../../components/ui/Badge"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/Avatar"
import { Separator } from "../../../components/ui/Separator"
import { Client, Collaborator } from "../types"
import { GLOBAL_COLLABORATOR_POOL, MOCK_ASSIGNMENTS } from "../mockData"
import { CollaboratorAssignmentModal } from "./CollaboratorAssignmentModal"

interface ClientProfilePageProps {
  client: Client
  onBack: () => void
}

export function ClientProfilePage({ client, onBack }: ClientProfilePageProps) {
  const [activeTab, setActiveTab] = React.useState("Searches")
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [assignments, setAssignments] = React.useState(MOCK_ASSIGNMENTS)

  const clientAssignments = assignments.filter(a => a.clientId === client.id)
  const assignedCollabs = GLOBAL_COLLABORATOR_POOL.filter(c => 
    clientAssignments.some(a => a.collaboratorId === c.id)
  )

  const { isCollaborator } = useRole()
  const baseTabs = ["Activity", "Searches", "Transactions", "Notes", "Reminders", "Property recommendations"]
  const tabs = isCollaborator ? baseTabs.filter(t => t !== "Property recommendations" && t !== "Searches") : baseTabs

  const stats = [
    { label: "Email", value: client.email, sub: "+2 emails", icon: Mail },
    { label: "Phone", value: client.phone, sub: "+1 phone", icon: Phone },
    { label: "Added on", value: client.addedOn, icon: Calendar },
    { label: "Source", value: client.source, icon: Search },
  ]

  const handleAssign = (collaborator: Collaborator, level: 'client' | 'transaction') => {
    // Union logic: check if already assigned
    const exists = assignments.find(a => a.clientId === client.id && a.collaboratorId === collaborator.id && a.assignmentType === level)
    if (exists) return

    const newAssignment = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: client.id,
      collaboratorId: collaborator.id,
      assignmentType: level,
      assignedAt: new Date().toISOString().split('T')[0]
    }
    setAssignments([...assignments, newAssignment])
  }

  return (
    <div className="flex flex-col gap-0 p-0 animate-in fade-in slide-in-from-right-4 duration-500 bg-white min-h-screen">
      {/* Header Info Banner */}
      <div className="flex flex-col gap-6 p-8 border border-[#EFEFEF] rounded-[16px] m-4 bg-white shadow-sm overflow-hidden relative">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-slate-50 relative group cursor-pointer shadow-lg">
                <Avatar className="h-full w-full">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback className="text-[32px]">{client.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">Update Photo</div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={onBack} className="p-1.5 hover:bg-[#EEF2FF] rounded-xl transition-all -ml-1 flex items-center gap-2 text-slate-400 group active:scale-95 shadow-sm border border-transparent hover:border-[#5A5FF2]/20">
                    <ChevronLeft className="h-5 w-5 group-hover:text-[#5A5FF2] transition-colors" />
                    <span className="text-[13px] font-bold group-hover:text-[#5A5FF2] hidden sm:block">Back</span>
                  </button>
                  <h2 className="text-[36px] font-bold text-[#373758] tracking-tight">{client.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {client.types.map((type, i) => (
                    <Badge key={i} className="bg-[#5A5FF2]/10 text-[#5A5FF2] border-none font-bold text-[11px] px-3.5 py-1.5 uppercase tracking-wider rounded-md shadow-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-[46px] px-8 text-[#5A5FF2] border-[#5A5FF2]/30 hover:bg-[#5A5FF2] hover:text-white transition-all font-bold rounded-[32px] flex items-center gap-2 shadow-sm">
                SEND APP INVITE <ChevronDown className="h-4 w-4 stroke-[3px]" />
              </Button>
              <Button className="h-[46px] px-8 bg-[#EEF2FF] text-[#5A5FF2] hover:bg-[#5A5FF2] hover:text-white transition-all font-bold rounded-[14px] flex items-center gap-2 border border-[#5A5FF2]/10 shadow-sm shadow-[#5A5FF2]/5 group">
                <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" /> Chat
              </Button>
              <button className="p-3.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all text-slate-300 hover:text-slate-900 active:scale-95 shadow-sm">
                <MoreVertical className="h-6 w-6" />
              </button>
            </div>
         </div>

         {/* Dropdowns */}
         <div className="flex items-center gap-4 mt-2">
            <Button variant="outline" className="bg-[#EEF2FF]/50 border-none text-[#5A5FF2] font-black h-11 px-8 rounded-2xl flex items-center gap-3 shadow-inner hover:bg-[#EEF2FF] transition-colors">
               NEW CLIENT <ChevronDown className="h-4 w-4 text-[#5A5FF2]/40 stroke-[3px]" />
            </Button>
            <Button variant="outline" className="border-slate-100 border-2 text-[#373758] font-black h-11 px-8 rounded-2xl flex items-center gap-3 bg-white shadow-sm hover:border-[#5A5FF2]/20 transition-all">
               <Avatar className="h-6 w-6 ring-2 ring-[#5A5FF2]/10 shadow-sm">
                  <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&auto=format&fit=crop" />
               </Avatar>
               MONICA MILLER <ChevronDown className="h-4 w-4 text-slate-300 stroke-[3px]" />
            </Button>
         </div>

         <Separator className="bg-[#F8FAFC] my-4" />

         {/* Stats Grid */}
         <div className="grid grid-cols-4 gap-12 py-2">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">{stat.label}</span>
                <div className="flex items-center gap-2 group cursor-pointer w-fit">
                  <span className="text-[15px] font-bold text-[#373758] group-hover:text-[#5A5FF2] transition-colors decoration-[#5A5FF2]/20 underline-offset-4 group-hover:underline">{stat.value}</span>
                  {stat.sub && (
                    <span className="text-[10px] font-black text-[#5A5FF2] bg-[#EEF2FF] px-2 py-0.5 rounded shadow-sm border border-[#5A5FF2]/5 uppercase tracking-tighter">{stat.sub}</span>
                  )}
                </div>
              </div>
            ))}
         </div>

         <div className="flex flex-col gap-2.5 mt-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Address</span>
            <span className="text-[15px] font-bold text-[#373758] leading-relaxed max-w-3xl flex items-center gap-2 group cursor-pointer hover:text-[#5A5FF2] transition-colors decoration-[#5A5FF2]/20 underline-offset-4 hover:underline">
               <MapPin className="h-4 w-4 text-[#5A5FF2]/40" />
               {client.address}
            </span>
         </div>

         {/* AI Toggle Bar - Permission Guarded */}
         {!isCollaborator && (
           <div className="mt-8 p-5 bg-[#5A5FF2]/5 rounded-[24px] border border-[#5A5FF2]/10 flex items-center justify-between group hover:border-[#5A5FF2]/40 hover:bg-[#5A5FF2]/10 transition-all cursor-pointer shadow-sm mx-0.5">
              <div className="flex items-center gap-4">
                 <div className="size-11 rounded-2xl bg-white shadow-radius-nav flex items-center justify-center text-[#5A5FF2] group-hover:scale-110 transition-transform">
                    <Send className="h-5 w-5 rotate-[-45deg] scale-x-[-1] fill-[#5A5FF2]/5 stroke-[#5A5FF2] stroke-[2px]" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-black text-[16px] text-slate-900 tracking-tight">AI Prospecting</span>
                    <span className="text-[12px] text-slate-400 font-medium">Automatic lead matching and smart outreach</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-6 bg-[#5A5FF2] rounded-full relative shadow-inner overflow-hidden border-2 border-[#5A5FF2]">
                   <div className="absolute right-0.5 top-0.5 w-[16px] h-[16px] bg-white rounded-full shadow-lg transition-all" />
                </div>
              </div>
           </div>
         )}
         
         {/* Accordions */}
         <div className="flex flex-col mt-8 gap-px bg-slate-50 border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
            {["Additional Details", "Tags", "Family Members"].map((label, i) => (
              <button key={i} className="flex items-center justify-between p-6 bg-white hover:bg-[#F8FAFF] transition-all group text-left relative active:z-10 first:rounded-t-[24px] last:rounded-b-[24px]">
                 <div className="flex items-center gap-4">
                    <div className="size-2 rounded-full bg-[#5A5FF2]/20 group-hover:bg-[#5A5FF2] transition-colors" />
                    <span className="font-bold text-[16px] text-[#373758] tracking-tight">{label}</span>
                 </div>
                 {label === "Family Members" ? (
                   <div className="flex items-center gap-4">
                      <div className="size-7 rounded-full border-2 border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:border-[#5A5FF2] group-hover:text-[#5A5FF2] transition-all shadow-sm group-hover:scale-110 group-hover:rotate-90">
                        <Plus className="h-4 w-4 stroke-[3px]" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#5A5FF2] group-hover:translate-x-1 transition-all" />
                   </div>
                 ) : (
                   <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#5A5FF2] group-hover:translate-x-1 transition-all" />
                 )}
              </button>
            ))}
         </div>

         {/* Collaborators Section (Expanded) */}
         <div className="flex flex-col mt-4 bg-white border border-[#EFEFEF] rounded-[24px] overflow-hidden shadow-sm shadow-[#5A5FF2]/5 outline outline shadow-inner">
            <div className="flex items-center justify-between p-6 group cursor-pointer bg-[#FDFEFE] border-b border-[#F8FAFC]">
               <div className="flex items-center gap-4">
                  <div className="size-11 rounded-2xl bg-[#5A5FF2]/5 flex items-center justify-center text-[#5A5FF2]">
                     <Users className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[16px] text-[#373758] tracking-tight">Collaborators</span>
                    <span className="text-[12px] text-slate-400 font-medium">Team members and partners assigned to this client</span>
                  </div>
                  {assignedCollabs.length > 0 && <Badge className="bg-[#5A5FF2] h-6 w-6 p-0 flex items-center justify-center text-[11px] rounded-full font-black shadow-lg shadow-[#5A5FF2]/20 animate-in zoom-in duration-500">{assignedCollabs.length}</Badge>}
               </div>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsAssignModalOpen(true); }}
                    className="size-8 rounded-full border-2 border-[#5A5FF2]/20 bg-white flex items-center justify-center text-[#5A5FF2] hover:bg-[#5A5FF2] hover:text-white hover:border-[#5A5FF2] transition-all shadow-sm active:scale-95 group-hover:scale-105"
                  >
                    <Plus className="h-4 w-4 stroke-[3px]" />
                  </button>
                  <ChevronDown className="h-6 w-6 text-slate-300 transition-transform duration-500 group-hover:translate-y-0.5" />
               </div>
            </div>
            
            <div className="p-0">
               {assignedCollabs.length === 0 ? (
                 <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-slate-50/20">
                    <div className="size-[100px] rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-inner relative">
                       <Users className="h-10 w-10 text-slate-200" />
                       <div className="absolute right-0 bottom-0 size-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                          <Plus className="h-4 w-4 text-slate-300" />
                       </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <p className="text-slate-900 font-black text-[18px] tracking-tight">No connected clients</p>
                       <p className="text-slate-400 text-[14px] font-medium max-w-[240px]">Start by assigning a collaborator to manage this relationship effectively.</p>
                    </div>
                    <button 
                      onClick={() => setIsAssignModalOpen(true)}
                      className="bg-[#5A5FF2] text-white px-8 py-3 rounded-[30px] font-bold text-[14px] shadow-lg shadow-[#5A5FF2]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4 stroke-[3px]" /> Add collaborator
                    </button>
                 </div>
               ) : (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/10">
                     {assignedCollabs.map((collab, i) => (
                       <div 
                         key={i} 
                         className="group bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-[#5A5FF2]/20 cursor-pointer relative"
                       >
                         <div className="flex items-center gap-4">
                           <div className="relative">
                             <div className="size-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center border border-indigo-100/50 group-hover:scale-105 transition-transform duration-300">
                               <span className="text-[14px] font-black text-indigo-500 uppercase">{collab.name[0]}</span>
                             </div>
                             
                             {/* Avatar Shield Tooltip */}
                             <TooltipProvider>
                               <Tooltip delayDuration={0}>
                                 <TooltipTrigger asChild>
                                   <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm text-indigo-500 cursor-help transform hover:scale-110 transition-transform">
                                      <ShieldCheck className="h-3 w-3 fill-indigo-500/10" />
                                   </div>
                                 </TooltipTrigger>
                                 <TooltipContent className="bg-[#060D4D] text-white border-[#060D4D]/20 shadow-xl">
                                    <p className="font-bold tracking-tight">Verified Professional</p>
                                 </TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                           </div>
                           
                           <div className="flex flex-col gap-0.5">
                              <span className="font-black text-[16px] text-slate-900 tracking-tight">{collab.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#5A5FF2]/5 text-[#5A5FF2] border-none font-black text-[10px] px-2 py-0.5 rounded-full tracking-tighter uppercase shadow-none">
                                   {collab.role}
                                </Badge>
                                <span className="size-1 rounded-full bg-slate-300" />
                                <span className="text-[12px] text-slate-400 font-medium truncate max-w-[120px]">{collab.email}</span>
                              </div>
                           </div>
                         </div>

                         <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end gap-1 px-3 py-1.5 rounded-xl bg-slate-50 group-hover:bg-[#EEF2FF] transition-colors">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">STATUS</span>
                               <div className="flex items-center gap-1.5">
                                  <div className={cn("size-1.5 rounded-full", collab.status === 'active' ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300')} />
                                  <span className={cn("text-[11px] font-black uppercase tracking-wide", collab.status === 'active' ? 'text-[#10B981]' : 'text-slate-400')}>{collab.status}</span>
                               </div>
                            </div>
                            <button className="size-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all text-slate-300 hover:text-slate-900 active:scale-95 shadow-sm">
                               <MoreHorizontal className="h-4 w-4" />
                            </button>
                         </div>
                       </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
         
         <button className="flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-all border-[#EFEFEF] border border-t-0 rounded-[24px] mt-4 shadow-sm group">
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                 <Grid className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                 <span className="font-black text-[16px] text-[#373758] tracking-tight">Buyer Representation</span>
                 <span className="text-[12px] text-slate-400 font-medium">Agreement terms and activity tracking</span>
              </div>
              <Badge className="bg-blue-600 h-6 w-6 p-0 flex items-center justify-center text-[11px] rounded-full font-black text-white ml-2 ring-4 ring-blue-50/50">2</Badge>
            </div>
            <div className="flex items-center gap-4">
                <div className="size-8 rounded-full border-2 border-slate-100 bg-white flex items-center justify-center text-slate-400 group-hover:border-[#5A5FF2] group-hover:text-[#5A5FF2] transition-all shadow-sm">
                  <Plus className="h-4 w-4 stroke-[3px]" />
                </div>
                <ChevronRight className="h-6 w-6 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
         </button>
      </div>

      {/* Tabs Menu */}
      <div className="px-8 mt-6">
         <div className="flex items-center gap-10 border-b border-[#F1F5F9]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-5 text-[15px] font-black relative transition-all group",
                  tab === activeTab
                    ? "text-[#5A5FF2]"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span className={cn("transition-all", tab === activeTab ? "scale-105" : "scale-100")}>{tab}</span>
                {tab === activeTab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#5A5FF2] rounded-t-full shadow-[0_-6px_15px_rgba(90,95,242,0.6)]" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Tab Content Placeholder */}
      <div className="flex-1 p-8 bg-[#F8FAFC]">
         <div className="bg-white rounded-[32px] border-2 border-[#EFEFEF] p-24 flex flex-col items-center justify-center text-center gap-6 border-dashed min-h-[500px] shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(#5A5FF2_0.8px,transparent_0.8px)] [background-size:20px_20px] opacity-[0.03]" />
             <div className="size-24 rounded-[28px] bg-[#EEF2FF] border border-[#5A5FF2]/20 flex items-center justify-center text-[#5A5FF2] mb-2 shadow-inner ring-8 ring-[#EEF2FF]/50 relative z-10">
                <Grid className="h-10 w-10 opacity-60" />
             </div>
             <div className="flex flex-col gap-2 relative z-10">
                <p className="text-[24px] font-black text-[#373758] tracking-tight animate-in fade-in slide-in-from-bottom-2">No {activeTab} yet</p>
                <p className="text-slate-400 font-bold max-w-sm text-[16px] leading-relaxed">Activity and logs for this client will appear here once interactions begin.</p>
             </div>
             <Button className="mt-4 bg-[#5A5FF2] text-white rounded-[30px] font-bold px-10 h-14 shadow-xl shadow-[#5A5FF2]/20 hover:scale-105 transition-all relative z-10">
                Add New {activeTab.slice(0, -1)}
             </Button>
         </div>
      </div>

      <CollaboratorAssignmentModal 
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssign={handleAssign}
        existingCollabs={assignedCollabs}
      />
    </div>
  )
}

function Grid(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function MapPin(props: any) {
   return (
     <svg
       {...props}
       xmlns="http://www.w3.org/2000/svg"
       width="24"
       height="24"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round"
     >
       <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
       <circle cx="12" cy="10" r="3" />
     </svg>
   )
}
