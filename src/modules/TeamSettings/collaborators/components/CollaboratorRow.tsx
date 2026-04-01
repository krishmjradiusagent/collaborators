import { Collaborator, Client, Transaction } from "../types";
import { TableRow, TableCell } from "../../../../components/ui/Table";
import { TypeBadge } from "./badges/TypeBadge";
import { StatusBadge } from "./badges/StatusBadge";
import { CollaboratorExpandView } from "./CollaboratorExpandView";
import { Button } from "../../../../components/ui/Button";
import { ChevronDown, MoreHorizontal, Mail, Trash2 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "../../../../components/ui/DropdownMenu";

interface CollaboratorRowProps {
  collaborator: Collaborator;
  isExpanded: boolean;
  onToggleExpand: () => void;
  allClients: Client[];
  allTransactions: Transaction[];
  onRemove: (c: Collaborator) => void;
  onResend: (id: string) => void;
}

export function CollaboratorRow({
  collaborator,
  isExpanded,
  onToggleExpand,
  allClients,
  allTransactions,
  onRemove,
  onResend,
}: CollaboratorRowProps) {
  const isTCorVA = collaborator.type === "tc" || collaborator.type === "va";
  const { assignments } = collaborator;
  
  return (
    <>
      <TableRow 
        className={cn(
          "group transition-colors border-b-[#F6F6F6] last:border-0",
          isExpanded ? "bg-slate-50/80" : "bg-white hover:bg-slate-50/50"
        )}
        onClick={onToggleExpand}
      >
        <TableCell className="py-4 pl-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-xl bg-white border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")} />
             </div>
             <span className={cn(
               "text-[14px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors",
               collaborator.status === "removed" && "line-through text-slate-400"
             )}>
                {collaborator.name}
             </span>
          </div>
        </TableCell>
        
        <TableCell>
          <TypeBadge type={collaborator.type} />
        </TableCell>

        <TableCell>
          <span className="text-[13px] text-slate-500 font-medium tracking-tight">{collaborator.email}</span>
        </TableCell>

        <TableCell>
          <StatusBadge status={collaborator.status} expiryDays={7} />
        </TableCell>

        <TableCell>
          <div className="text-[14px] font-semibold text-slate-900 tracking-tight">
            {assignments.clients.length} <span className="text-slate-400 font-bold uppercase text-[9px] ml-1 tracking-tighter">clients</span>
            {isTCorVA && <span>, {assignments.transactions.length} <span className="text-slate-400 font-bold uppercase text-[9px] ml-1 tracking-tighter">txns</span></span>}
          </div>
        </TableCell>

        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-slate-700 shadow-2xl p-2 rounded-xl">
                 <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-black p-3 tracking-[.25em]">Security Actions</DropdownMenuLabel>
                 <DropdownMenuSeparator className="bg-slate-50 my-1" />
                 {collaborator.status === "invited" && (
                   <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-blue-600 rounded-lg" onClick={() => onResend(collaborator.id)}>
                      <Mail className="h-4 w-4 text-blue-600" /> Resend Credentials
                   </DropdownMenuItem>
                 )}
                 <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-red-600 rounded-lg group" onClick={() => onRemove(collaborator)}>
                    <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" /> Revoke Access
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-transparent hover:bg-transparent border-0 ring-0">
          <TableCell colSpan={6} className="p-0 border-0 outline-none">
            <CollaboratorExpandView 
               collaborator={collaborator}
               allClients={allClients}
               allTransactions={allTransactions}
               onRemove={() => onRemove(collaborator)}
               onResend={() => onResend(collaborator.id)}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
