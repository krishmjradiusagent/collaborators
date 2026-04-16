import { Search } from "lucide-react";
import { CollaboratorRow } from "./CollaboratorRow";
import { Collaborator } from "../types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

interface CollaboratorTableProps {
  collaborators: Collaborator[];
  onRemove: (c: Collaborator) => void;
  onResend: (id: string) => void;
}

export function CollaboratorTable({
  collaborators,
  onRemove,
  onResend,
}: CollaboratorTableProps) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="hover:bg-transparent border-b-[#F0F0F0]">
              <TableHead className="w-[200px] pl-8 text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Identity</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-center">Category</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Authentication</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-center">Defaults</TableHead>
              <TableHead className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none text-center">Status</TableHead>

              <TableHead className="w-[50px] pr-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-center">
            {collaborators.map((collaborator) => (
              <CollaboratorRow 
                key={collaborator.id}
                collaborator={collaborator}
                onRemove={onRemove}
                onResend={onResend}
              />
            ))}
            {collaborators.length === 0 && (
              <TableRow className="border-0 hover:bg-transparent">
                  <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-40 text-slate-400">
                     <Search className="h-8 w-8 text-slate-300" />
                     <p className="font-bold uppercase text-[10px] tracking-widest">No matching collaborators found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
