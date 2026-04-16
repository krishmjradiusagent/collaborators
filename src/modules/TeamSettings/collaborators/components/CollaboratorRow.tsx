import { Collaborator } from "../types";
import { TableRow, TableCell } from "@/components/ui/Table";
import { TypeBadge } from "./badges/TypeBadge";
import { StatusBadge } from "./badges/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MoreHorizontal, Mail, Trash2, Users, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/DropdownMenu";
import { ManageCollaborationModal } from "./ManageCollaborationModal";
import { ManageCollaboratorDefaultsModal } from "./ManageCollaboratorDefaultsModal";
import { useState } from "react";
import { MOCK_AGENTS } from "../mockData";
import { useRole } from "@/contexts/RoleContext";

interface CollaboratorRowProps {
  collaborator: Collaborator;
  onRemove: (c: Collaborator) => void;
  onResend: (id: string) => void;
}

export function CollaboratorRow({
  collaborator,
  onRemove,
  onResend,
}: CollaboratorRowProps) {
  const isTCorVA = collaborator.type === "tc" || collaborator.type === "va";
  const { assignments } = collaborator;
  const { currentRole, selectedAgent } = useRole();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDefaultsModalOpen, setIsDefaultsModalOpen] = useState(false);
  
  return (
    <TableRow 
      className={cn(
        "group transition-colors border-b-[#F6F6F6] last:border-0",
        "bg-white hover:bg-slate-50/30"
      )}
    >
      <TableCell className="py-4 pl-8 text-left">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
             <span className="text-[12px] font-bold text-slate-400">{collaborator.name.charAt(0)}</span>
           </div>
           <div className="flex flex-col items-start translate-y-[1px]">
             <span className={cn(
               "text-[14px] font-semibold text-gray-900 text-left",
               collaborator.status === "removed" && "line-through text-slate-400"
             )}>
                {collaborator.name}
             </span>
           </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex justify-center">
          <TypeBadge type={collaborator.type} />
        </div>
      </TableCell>

      <TableCell className="text-left">
         <span className="text-[13px] text-slate-500 font-medium tracking-tight">
           {collaborator.email}
         </span>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          {(() => {
            if (currentRole === 'AGENT') {
              // For agents, show if it's THEIR default
              const agentId = selectedAgent?.id || 'a1'; // Fallback to a1 for demo if none selected
              const agent = MOCK_AGENTS.find(a => a.id === agentId);
              const isMyDefault = agent?.default_collab_list.some(dc => dc.collaboratorId === collaborator.id);
              
              if (!isMyDefault) return <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">None</span>;
              return (
                <Badge className="bg-[#5A5FF2]/5 text-[#5A5FF2] hover:bg-[#5A5FF2]/5 border-none px-3 h-6 text-[11px] font-bold shadow-none uppercase tracking-widest">
                  Personal Default
                </Badge>
              );
            }

            const count = MOCK_AGENTS.filter(a => a.default_collab_list.some(dc => dc.collaboratorId === collaborator.id)).length;
            if (count === 0) return <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">None</span>;
            return (
              <Badge className="bg-[#5A5FF2]/5 text-[#5A5FF2] hover:bg-[#5A5FF2]/5 border-none px-3 h-6 text-[11px] font-bold shadow-none">
                {count} {count === 1 ? 'Agent' : 'Agents'}
              </Badge>
            );
          })()}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <StatusBadge 
            status={collaborator.status} 
            onResend={() => onResend(collaborator.id)}
          />
        </div>
      </TableCell>



      <TableCell className="text-right pr-8">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-slate-700 shadow-2xl p-2 rounded-xl">
               <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-black p-3 tracking-[.25em]">Security Actions</DropdownMenuLabel>
               <DropdownMenuSeparator className="bg-slate-50 my-1" />
               {collaborator.status === "invited" && (
                 <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-[#5A5FF2] rounded-lg" onClick={() => onResend(collaborator.id)}>
                    <Mail className="h-4 w-4 text-[#5A5FF2]" /> Resend Credentials
                 </DropdownMenuItem>
               )}
               {currentRole !== 'AGENT' && (
                 <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-[#5A5FF2] rounded-lg" onClick={() => setIsDefaultsModalOpen(true)}>
                    <Settings className="h-4 w-4 text-[#5A5FF2]" /> Manage Defaults
                 </DropdownMenuItem>
               )}
               <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-red-600 rounded-lg group" onClick={() => onRemove(collaborator)}>
                  <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" /> Revoke Access
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

          <ManageCollaboratorDefaultsModal 
             open={isDefaultsModalOpen}
             onOpenChange={setIsDefaultsModalOpen}
             collaborator={collaborator}
          />
       </TableCell>
    </TableRow>
  );
}
