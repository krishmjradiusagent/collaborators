import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Search, X, Users, User, Shield } from "lucide-react";
import { Collaborator, Agent } from "../types";
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

interface ManageCollaboratorDefaultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator;
}

export function ManageCollaboratorDefaultsModal({
  open,
  onOpenChange,
  collaborator,
}: ManageCollaboratorDefaultsModalProps) {
  // Local state for which agents this collaborator is a default for
  // We'll initialize it from MOCK_AGENTS
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(
    MOCK_AGENTS.filter(a => a.default_collab_list.some(dc => dc.collaboratorId === collaborator.id))
      .map(a => a.id)
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleAgent = (agentId: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSave = () => {
    // In a real app, this would be an API call to update all selected agents
    toast.success("Default Settings Saved", {
      description: `${collaborator.name} is now a default for ${selectedAgentIds.length} agents.`,
      icon: <Check className="size-4 text-white" />,
      className: "bg-[#5A5FF2] text-white border-none rounded-2xl",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-[#FAFAFA] rounded-[32px] p-0 border-none shadow-2xl overflow-hidden">
        <div className="p-8 pb-6 bg-white border-b border-slate-100">
          <div className="flex items-center gap-4 mb-4">
             <div className="size-12 rounded-2xl bg-[#5A5FF2]/5 flex items-center justify-center text-[#5A5FF2]">
                <Users className="size-6" />
             </div>
             <div>
                <DialogTitle className="text-xl font-black text-[#171717]">
                  Default Assignments
                </DialogTitle>
                <p className="text-sm text-slate-500 font-medium">Configure which agents automatically have {collaborator.name} assigned.</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
             <Avatar className="h-10 w-10 border border-white shadow-sm">
                <AvatarFallback className="bg-white text-slate-400 font-bold text-xs">{collaborator.name.charAt(0)}</AvatarFallback>
             </Avatar>
             <div>
                <p className="text-sm font-bold text-slate-900">{collaborator.name}</p>
                <Badge className="bg-[#5A5FF2]/10 text-[#5A5FF2] hover:bg-[#5A5FF2]/10 border-none px-2 h-5 text-[9px] uppercase font-black shadow-none mt-0.5">
                   {collaborator.type}
                </Badge>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-[#737373] tracking-widest uppercase flex items-center justify-between">
               Assigned Agents
               <span className="text-[#5A5FF2] bg-[#5A5FF2]/10 px-2 py-0.5 rounded-full text-[10px]">{selectedAgentIds.length} Agents</span>
            </label>
            
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  role="combobox" 
                  aria-expanded={isSearchOpen}
                  className="w-full h-14 bg-white border-slate-200 rounded-2xl px-4 shadow-sm text-sm font-bold justify-between hover:bg-white hover:border-[#5A5FF2]/30 transition-all"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Search className="size-4 text-slate-400 shrink-0" />
                    {selectedAgentIds.length === 0 ? (
                      <span className="text-slate-400 font-medium">Search agents to assign...</span>
                    ) : (
                      <div className="flex items-center gap-1.5 overflow-hidden">
                         {selectedAgentIds.slice(0, 2).map(id => {
                            const agent = agents.find(a => a.id === id);
                            return (
                               <Badge key={id} variant="secondary" className="bg-slate-100 text-slate-700 h-7 rounded-lg px-2 text-[11px] font-bold border-none shrink-0">
                                 {agent?.name.split(' ')[0]}
                               </Badge>
                            );
                         })}
                         {selectedAgentIds.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">+{selectedAgentIds.length - 2} more</span>
                         )}
                      </div>
                    )}
                  </div>
                  <Check className={cn("size-4 opacity-50 transition-transform", isSearchOpen && "rotate-180")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[486px] p-0 rounded-2xl border-none shadow-[0px_10px_40px_rgba(0,0,0,0.15)] z-[11000]">
                <Command className="rounded-2xl">
                  <CommandInput placeholder="Search team agents..." className="h-12 border-none ring-0 focus:ring-0" />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No agents found.</CommandEmpty>
                    <CommandGroup heading="Team Agents">
                      {agents.map((agent) => (
                        <CommandItem
                          key={agent.id}
                          onSelect={() => toggleAgent(agent.id)}
                          className="p-3 mx-2 my-1 rounded-xl cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={cn(
                              "size-5 rounded-md border-2 flex items-center justify-center transition-all",
                              selectedAgentIds.includes(agent.id) ? "bg-[#5A5FF2] border-[#5A5FF2]" : "border-slate-200"
                            )}>
                              {selectedAgentIds.includes(agent.id) && <Check className="size-3 text-white stroke-[3px]" />}
                            </div>
                            <Avatar className="h-7 w-7">
                               <AvatarFallback className="text-[10px] bg-slate-100 text-slate-500">{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-800">{agent.name}</span>
                               <span className="text-[10px] text-slate-400 font-medium">{agent.email}</span>
                            </div>
                          </div>
                          {agent.role === "Team Lead" && (
                             <Shield className="size-3.5 text-amber-500 fill-amber-500/10" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedAgentIds.length > 0 && (
             <div className="flex flex-wrap gap-2">
                {selectedAgentIds.map(id => {
                   const agent = agents.find(a => a.id === id);
                   return (
                      <div key={id} className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm animate-in zoom-in duration-200">
                         <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[8px] bg-slate-50 text-slate-400 font-bold">{agent?.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <span className="text-[13px] font-bold text-slate-700">{agent?.name}</span>
                         <button onClick={() => toggleAgent(id)} className="ml-1 text-slate-300 hover:text-red-500 transition-colors">
                            <X className="size-3.5" />
                         </button>
                      </div>
                   )
                })}
             </div>
          )}

          <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4">
             <p className="text-xs text-amber-700 font-medium leading-relaxed">
                <strong>Note:</strong> Saving these assignments will automatically include {collaborator.name} as a collaborator for every new client created by the selected agents.
             </p>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1 h-12 rounded-2xl bg-[#5A5FF2] text-white font-bold shadow-lg shadow-[#5A5FF2]/20 hover:scale-[1.02] transition-all" onClick={handleSave}>
            Save Assignments
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
