import { Collaborator } from "../types";
import { TableRow, TableCell } from "@/components/ui/Table";
import { TypeBadge } from "./badges/TypeBadge";
import { StatusBadge } from "./badges/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MoreHorizontal, Mail, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/DropdownMenu";

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

      <TableCell className="text-center px-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          {collaborator.accessLevel || 'Client level'}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <StatusBadge 
            status={collaborator.status} 
            onResend={() => onResend(collaborator.id)}
          />
        </div>
      </TableCell>

      <TableCell className="text-right pr-12">
        <div className="flex flex-col items-end gap-1.5 h-full">
          <Badge 
            variant="secondary" 
            className={cn(
              "h-5 px-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 shrink-0",
              assignments.clients.length === 0 ? "text-slate-400" : "text-[#5A5FF2]"
            )}
          >
            {assignments.clients.length} CLIENTS
          </Badge>
          {isTCorVA && (
            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 border-slate-100 shrink-0">
              {assignments.transactions.length} TXNS
            </Badge>
          )}
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
               <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-red-600 rounded-lg group" onClick={() => onRemove(collaborator)}>
                  <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" /> Revoke Access
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
