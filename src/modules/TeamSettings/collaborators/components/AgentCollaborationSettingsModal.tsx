import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Trash2, Shield, User, Info, Check, Search, PlusCircle, X } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collaborator, Agent, DefaultCollaborator } from "../types";
import { MOCK_AGENTS } from "../mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AgentCollaborationSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  globalPool: Collaborator[];
}

export function AgentCollaborationSettingsModal({
  open,
  onOpenChange,
  globalPool
}: AgentCollaborationSettingsModalProps) {
  // For demonstration, we assume the logged in user is either an Agent or Team Lead.
  const [currentUserRole, setCurrentUserRole] = useState<"Agent" | "Team Lead">("Team Lead");
  const [viewMode, setViewMode] = useState<"By Agent" | "By Collaborator">("By Agent");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-1");
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  
  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const isTeamLead = currentUserRole === "Team Lead";

  // For removing a default
  const [removeDialogData, setRemoveDialogData] = useState<{ collabId: string } | null>(null);
  const [removeMode, setRemoveMode] = useState<"future_only" | "all">("future_only");
  
  // For Team Lead adding new default
  const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false);
  const [addingCollabId, setAddingCollabId] = useState<string | null>(null);

  const handleRemove = () => {
    if (!removeDialogData || !selectedAgent) return;
    
    // Update local state
    setAgents(prevAgents => prevAgents.map(a => {
      if (a.id === selectedAgent.id) {
        return {
          ...a,
          default_collab_list: a.default_collab_list.filter(dc => dc.collaboratorId !== removeDialogData.collabId)
        };
      }
      return a;
    }));
    
    toast.success("Default removed", {
      description: removeMode === "all" ? "Removed from all current and future clients." : "Removed from future clients only.",
      icon: <Check className="size-4 text-white" />,
      className: "bg-[#5A5FF2] text-white border-none rounded-2xl",
    });
    setRemoveDialogData(null);
  };

  const handleAddDefault = () => {
    if (!addingCollabId || !selectedAgent) return;
    setAgents(prevAgents => prevAgents.map(a => {
      if (a.id === selectedAgent.id) {
        // Prevent duplicates
        if (a.default_collab_list.some(dc => dc.collaboratorId === addingCollabId)) return a;
        return {
          ...a,
          default_collab_list: [...a.default_collab_list, { collaboratorId: addingCollabId, source: "Lead" }]
        };
      }
      return a;
    }));
    
    toast.success("Default assigned", {
      description: "Successfully applied to Agent's defaults.",
    });
    setAddingCollabId(null);
    setIsAddPopoverOpen(false);
  };

  const handleApplyToAgents = () => {
    if (!selectedCollabId || selectedAgentIds.length === 0) return;
    
    setAgents(prevAgents => prevAgents.map(a => {
      if (selectedAgentIds.includes(a.id)) {
        if (a.default_collab_list.some(dc => dc.collaboratorId === selectedCollabId)) return a;
        return {
          ...a,
          default_collab_list: [...a.default_collab_list, { collaboratorId: selectedCollabId, source: "Lead" }]
        };
      }
      return a;
    }));

    toast.success("Bulk Assignment Complete", {
      description: `Collaborator assigned to ${selectedAgentIds.length} agents.`,
      icon: <Check className="size-4 text-white" />,
      className: "bg-[#5A5FF2] text-white border-none rounded-2xl",
    });
    setSelectedCollabId(null);
    setSelectedAgentIds([]);
  };

  const toggleAgentInList = (agentId: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[650px] bg-[#FAFAFA] rounded-[32px] p-0 border-none shadow-2xl overflow-hidden">
          <>
          <div className="p-6 pb-0 bg-white flex justify-between items-start">
            <div>
               <DialogTitle className="text-xl font-black text-[#171717] mb-0.5">
                 Collaboration Settings
               </DialogTitle>
               <p className="text-[13px] text-slate-500 font-medium">Manage default automation rules for your agents.</p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-6 pt-4 space-y-4">
            {/* View Mode Toggle - Relocated to Body */}
            <div className="flex bg-slate-100 p-1.5 rounded-[18px] w-fit shadow-inner">
               <button 
                onClick={() => setViewMode("By Agent")}
                className={cn(
                  "px-6 py-2 text-[11px] font-black uppercase tracking-wider rounded-[14px] transition-all duration-300", 
                  viewMode === "By Agent" ? "bg-white text-[#5A5FF2] shadow-md" : "text-slate-400 hover:text-slate-600"
                )}
               >
                 By Agent
               </button>
               <button 
                onClick={() => setViewMode("By Collaborator")}
                className={cn(
                  "px-6 py-2 text-[11px] font-black uppercase tracking-wider rounded-[14px] transition-all duration-300", 
                  viewMode === "By Collaborator" ? "bg-white text-[#5A5FF2] shadow-md" : "text-slate-400 hover:text-slate-600"
                )}
               >
                 By Collaborator
               </button>
            </div>
            {isTeamLead && viewMode === "By Agent" && (
               <div className="space-y-3 animate-in fade-in slide-in-from-top-3 duration-500">
                  <label className="text-[11px] font-black text-[#A3A3A3] tracking-widest uppercase">Select Agent to Manage</label>
                  <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                    <SelectTrigger className="w-full h-14 bg-white border-2 border-slate-50 rounded-[20px] px-6 shadow-sm text-sm font-bold focus:border-[#5A5FF2]/30 transition-all hover:border-slate-200">
                      <SelectValue placeholder="Select an Agent" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-xl border-none p-2 z-[10005]">
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id} className="text-sm rounded-xl cursor-pointer p-3 focus:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-slate-100 shadow-sm">
                              <AvatarFallback className="text-[10px] bg-slate-50 text-slate-500 font-black">{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 leading-tight">{agent.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{agent.role}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            )}

            {isTeamLead && viewMode === "By Collaborator" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-top-3 duration-500">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-[#A3A3A3] tracking-widest uppercase flex items-center gap-2">
                       <div className="size-5 rounded-full border-2 border-[#5A5FF2] flex items-center justify-center text-[#5A5FF2]">
                         <PlusCircle className="size-3" />
                       </div>
                       1. SELECT COLLABORATOR
                    </label>
                    <Select value={selectedCollabId || ""} onValueChange={setSelectedCollabId}>
                      <SelectTrigger className="w-full h-14 bg-white border-2 border-slate-50 rounded-[20px] px-6 shadow-sm text-sm font-bold focus:border-[#5A5FF2]/30 transition-all hover:border-slate-200">
                        <SelectValue placeholder="Pick a collaborator to push..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-xl border-none p-2 z-[10005]">
                        <div className="p-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-1">Global Team Pool</div>
                        {globalPool.map(c => (
                          <SelectItem key={c.id} value={c.id} className="text-sm rounded-xl cursor-pointer p-3 focus:bg-slate-50">
                            <div className="flex items-center gap-3">
                               <div className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-black group-hover:bg-[#5A5FF2]/10 group-hover:text-[#5A5FF2]">
                                 {c.name.charAt(0)}
                               </div>
                               <div className="flex flex-col">
                                 <span className="font-bold text-slate-800 leading-tight">{c.name}</span>
                                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.type}</span>
                               </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-[#A3A3A3] tracking-widest uppercase">
                         2. SELECT AGENTS TO ASSIGN DEFAULT
                      </label>
                      <span className="text-[10px] text-[#5A5FF2] font-black uppercase tracking-wider bg-[#5A5FF2]/10 px-3 py-1 rounded-full">
                        {selectedAgentIds.length} SELECTED
                      </span>
                    </div>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full h-14 bg-white border-2 border-slate-50 rounded-[20px] px-6 shadow-sm text-sm font-bold justify-between hover:border-slate-200 focus:border-[#5A5FF2]/30 transition-all"
                        >
                          {selectedAgentIds.length === 0 ? (
                            <span className="text-slate-400 font-medium">Search and select agents...</span>
                          ) : (
                            <div className="flex items-center gap-2 overflow-hidden">
                              {selectedAgentIds.slice(0, 4).map(id => {
                                const agent = agents.find(a => a.id === id);
                                return (
                                  <Badge key={id} className="bg-slate-50 text-slate-600 h-8 rounded-xl px-3 text-[11px] font-bold border-none shrink-0 border border-slate-100 shadow-none">
                                    {agent?.name}
                                  </Badge>
                                )
                              })}
                              {selectedAgentIds.length > 4 && (
                                <span className="text-[11px] text-slate-400 font-black shrink-0">+{selectedAgentIds.length - 4}</span>
                              )}
                            </div>
                          )}
                          <Search className="size-5 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[586px] p-0 rounded-3xl border-none shadow-[0px_20px_60px_rgba(0,0,0,0.15)] z-[10002] overflow-hidden">
                        <Command className="border-none">
                          <div className="flex items-center border-b border-slate-100 px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput placeholder="Search agents by name or role..." className="h-14 border-none ring-0 placeholder:text-slate-400 text-sm font-medium" />
                          </div>
                          <CommandList className="max-h-[320px]">
                            <CommandEmpty className="py-6 text-sm text-slate-500 font-medium">No agents found.</CommandEmpty>
                            <CommandGroup heading={<span className="text-[10px] font-black tracking-widest uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">Team Agents</span>} className="p-2">
                               {agents.map(agent => (
                                 <CommandItem 
                                  key={agent.id} 
                                  onSelect={() => toggleAgentInList(agent.id)}
                                  className="p-3 mx-1 my-0.5 rounded-2xl cursor-pointer flex items-center justify-between aria-selected:bg-slate-50"
                                 >
                                    <div className="flex items-center gap-4">
                                      <div className={cn(
                                        "size-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                        selectedAgentIds.includes(agent.id) ? "bg-[#5A5FF2] border-[#5A5FF2]" : "border-slate-200"
                                      )}>
                                        {selectedAgentIds.includes(agent.id) && <Check className="size-3.5 text-white stroke-[3px]" />}
                                      </div>
                                      <Avatar className="h-10 w-10 border border-slate-100">
                                        <AvatarFallback className="text-xs bg-slate-50 text-slate-500 font-bold">{agent.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 text-[14px] leading-tight">{agent.name}</span>
                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{agent.role}</span>
                                      </div>
                                    </div>
                                 </CommandItem>
                               ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="pt-4">
                    <Button 
                      disabled={!selectedCollabId || selectedAgentIds.length === 0}
                      onClick={handleApplyToAgents}
                      className={cn(
                        "w-full h-20 text-[15px] font-black rounded-[24px] shadow-2xl transition-all duration-300 transform active:scale-[0.98]",
                        (!selectedCollabId || selectedAgentIds.length === 0) 
                          ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed" 
                          : "bg-gradient-to-r from-[#5A5FF2] to-[#7C80F5] text-white shadow-[#5A5FF2]/30 hover:shadow-[#5A5FF2]/50 hover:scale-[1.01]"
                      )}
                    >
                      Set {globalPool.find(c => c.id === selectedCollabId)?.name || 'Collaborator'} as Default for {selectedAgentIds.length} Agents
                    </Button>
                  </div>
               </div>
            )}

            {viewMode === "By Agent" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-3 duration-500">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-[#A3A3A3] tracking-widest uppercase">
                    {isTeamLead ? `DEFAULTS FOR ${selectedAgent?.name?.toUpperCase()}` : "MY DEFAULT COLLABORATORS"}
                  </label>
                  {isTeamLead && (
                    <Popover open={isAddPopoverOpen} onOpenChange={setIsAddPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-[#5A5FF2] hover:bg-[#5A5FF2]/10 rounded-xl h-8 px-3 text-[10px] font-black uppercase tracking-wider">
                          <PlusCircle className="size-3.5 mr-2" /> Assign Default
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-[320px] p-0 rounded-[22px] border-none shadow-[0px_20px_60px_rgba(0,0,0,0.15)] z-[10006] overflow-hidden">
                        <Command className="border-none">
                          <div className="flex items-center border-b border-slate-100 px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput placeholder="Search collaborators..." className="h-11 border-none ring-0 placeholder:text-slate-400 text-xs font-medium" />
                          </div>
                          <CommandList className="max-h-[200px] p-2">
                            <CommandEmpty className="text-xs p-8 text-center text-slate-400 font-medium">No collaborators found.</CommandEmpty>
                            <CommandGroup heading={<span className="text-[9px] font-black tracking-widest uppercase text-slate-400">Team Pool</span>} className="px-2">
                              {globalPool.map(c => {
                                 const isAlreadyAdded = selectedAgent?.default_collab_list.some(dc => dc.collaboratorId === c.id);
                                 return (
                                   !isAlreadyAdded && (
                                     <CommandItem 
                                       key={c.id} 
                                       onSelect={() => {
                                         setAddingCollabId(c.id);
                                       }}
                                       className="rounded-xl cursor-pointer p-2.5 flex items-center justify-between aria-selected:bg-slate-50"
                                     >
                                       <div className="flex flex-col">
                                         <span className="font-bold text-xs text-slate-800 leading-tight">{c.name}</span>
                                         <span className="text-[9px] uppercase text-slate-400 font-black tracking-widest mt-0.5">{c.type}</span>
                                       </div>
                                       {addingCollabId === c.id && <Check className="size-3.5 text-[#5A5FF2] stroke-[3px]" />}
                                     </CommandItem>
                                   )
                                 );
                              })}
                            </CommandGroup>
                          </CommandList>
                          {addingCollabId && (
                             <div className="p-3 bg-slate-50 border-t border-slate-100 items-center justify-center flex">
                               <Button onClick={handleAddDefault} className="w-full h-10 rounded-xl bg-[#5A5FF2] text-white font-black text-[10px] uppercase tracking-wider shadow-lg shadow-[#5A5FF2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                 Confirm Assignment
                               </Button>
                             </div>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {selectedAgent?.default_collab_list.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[28px] bg-white/50 space-y-2">
                     <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center">
                       <User className="size-5 text-slate-300" />
                     </div>
                     <div className="text-center">
                       <p className="text-xs font-bold text-slate-800">No defaults assigned</p>
                       <p className="text-[10px] text-slate-400 font-medium max-w-[180px] mt-0.5">Select "Assign Default" to proceed.</p>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedAgent?.default_collab_list.map((defaultCollab, idx) => {
                      const collabDetails = globalPool.find(g => g.id === defaultCollab.collaboratorId);
                      if (!collabDetails) return null;

                      const canDelete = isTeamLead || defaultCollab.source === "Self";

                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-[20px] border-2 border-slate-50 shadow-sm transition-all hover:border-[#5A5FF2]/20 hover:shadow-md group">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl border-2 border-slate-50 flex items-center justify-center text-slate-400 font-black text-xs bg-slate-50/50 group-hover:bg-[#5A5FF2]/5 group-hover:text-[#5A5FF2] group-hover:border-[#5A5FF2]/10 transition-colors">
                              {collabDetails.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                 <p className="font-black text-[13px] text-slate-900 tracking-tight">{collabDetails.name}</p>
                                 {defaultCollab.source === "Lead" ? (
                                   <Badge className="bg-[#FFF8E6] text-[#B26E00] hover:bg-[#FFF8E6] border-none px-1.5 h-5 text-[8px] uppercase font-black flex items-center gap-1 shadow-none rounded-lg">
                                     <Shield className="size-2" /> Lead
                                   </Badge>
                                 ) : (
                                   <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-1.5 h-5 text-[8px] uppercase font-black shadow-none rounded-lg">
                                     Self
                                   </Badge>
                                 )}
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{collabDetails.type} • {collabDetails.email}</p>
                            </div>
                          </div>

                          {canDelete && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="size-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              onClick={() => setRemoveDialogData({ collabId: collabDetails.id })}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
        </div>
          
          <div className="p-4 px-6 bg-white border-t border-slate-50 flex justify-end">
            <Button variant="outline" className="h-10 px-6 rounded-xl font-bold border-slate-200 text-xs" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
          </>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog open={!!removeDialogData} onOpenChange={(val) => !val && setRemoveDialogData(null)}>
        <DialogContent className="sm:max-w-[400px] border-none rounded-3xl p-6 shadow-2xl z-[10001]">
          <DialogHeader className="mb-4">
            <div className="size-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="size-6 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold">Remove Default Status?</DialogTitle>
          </DialogHeader>

          <RadioGroup value={removeMode} onValueChange={(val: any) => setRemoveMode(val)} className="space-y-3 mb-6">
            <Label className={cn("flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all", removeMode === "future_only" ? "border-[#5A5FF2] bg-[#5A5FF2]/5" : "border-slate-100")}>
              <RadioGroupItem value="future_only" className="sr-only" />
              <div className="flex-1">
                <span className={cn("font-bold text-sm", removeMode === "future_only" ? "text-[#5A5FF2]" : "text-slate-700")}>Remove from future clients only</span>
                <p className="text-xs text-slate-500 mt-1">Existing clients will keep this collaborator.</p>
              </div>
              <div className={cn("size-4 rounded-full border-2 flex items-center justify-center mt-0.5", removeMode === "future_only" ? "border-[#5A5FF2]" : "border-slate-300")}>
                {removeMode === "future_only" && <div className="size-2 rounded-full bg-[#5A5FF2]" />}
              </div>
            </Label>
            
            <Label className={cn("flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all", removeMode === "all" ? "border-[#5A5FF2] bg-[#5A5FF2]/5" : "border-slate-100")}>
              <RadioGroupItem value="all" className="sr-only" />
              <div className="flex-1">
                <span className={cn("font-bold text-sm", removeMode === "all" ? "text-red-600" : "text-slate-700")}>Remove from all clients</span>
                <p className="text-xs text-slate-500 mt-1">Will be removed from current and future clients.</p>
              </div>
              <div className={cn("size-4 rounded-full border-2 flex items-center justify-center mt-0.5", removeMode === "all" ? "border-red-500" : "border-slate-300")}>
                {removeMode === "all" && <div className="size-2 rounded-full bg-red-500" />}
              </div>
            </Label>
          </RadioGroup>

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setRemoveDialogData(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 h-12 rounded-xl font-bold bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20" onClick={handleRemove}>Confirm Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
