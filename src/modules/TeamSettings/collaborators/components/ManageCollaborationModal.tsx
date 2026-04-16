import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, X, Users } from "lucide-react";
import { Collaborator } from "../types";
import { cn } from "@/lib/utils";

interface ManageCollaborationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator;
}


const MOCK_ALL_AGENTS = [
  { id: "a1", name: "Sarah Connor", email: "sarah@radius.com" },
  { id: "a2", name: "John Doe", email: "john@radius.com" },
  { id: "a3", name: "Jane Smith", email: "jane@radius.com" },
];

export function ManageCollaborationModal({
  open,
  onOpenChange,
  collaborator,
}: ManageCollaborationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sharedAgents, setSharedAgents] = useState<typeof MOCK_ALL_AGENTS>([]);

  const filteredAgents = MOCK_ALL_AGENTS.filter(
    (agent) =>
      !sharedAgents.some((sa) => sa.id === agent.id) &&
      (agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addAgent = (agent: typeof MOCK_ALL_AGENTS[0]) => {
    setSharedAgents((prev) => [...prev, agent]);
    setSearchQuery("");
  };

  const removeAgent = (agentId: string) => {
    setSharedAgents((prev) => prev.filter((a) => a.id !== agentId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 shadow-2xl rounded-3xl p-6 border-none">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black text-[#171717]">
            Manage Collaboration
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Manage visibility and access for {collaborator.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Shared Agents
            </h3>
            
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search to add agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-[#F8FAFC] border-none rounded-xl"
              />
            </div>

            {searchQuery && filteredAgents.length > 0 && (
              <div className="bg-white border text-sm rounded-xl overflow-hidden shadow-sm mt-4">
                {filteredAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => addAgent(agent)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b last:border-0"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{agent.name}</p>
                      <p className="text-slate-500 text-[12px]">{agent.email}</p>
                    </div>
                    <span className="text-[#5A5FF2] text-[12px] font-bold uppercase tracking-wider bg-[#5A5FF2]/10 px-2 py-1 rounded-md">
                      Add
                    </span>
                  </button>
                ))}
              </div>
            )}

            {sharedAgents.length > 0 && (
              <div className="space-y-2 mt-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Current Members ({sharedAgents.length})
                </p>
                <div className="space-y-2">
                  {sharedAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[12px]">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-[13px]">{agent.name}</p>
                          <p className="text-slate-400 text-[11px]">{agent.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAgent(agent.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="rounded-xl bg-[#5A5FF2] hover:bg-[#4B50D9] text-white font-bold">
            Save Prefernces
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
