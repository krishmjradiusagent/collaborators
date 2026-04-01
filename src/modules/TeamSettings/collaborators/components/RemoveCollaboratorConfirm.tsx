import { useState, useMemo } from "react";
import { Collaborator } from "../types";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../../../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import { AlertCircle, Trash2, ArrowRight } from "lucide-react";
import { cn } from "../../../../lib/utils";

interface RemoveCollaboratorConfirmProps {
  collaborator: Collaborator | null;
  activeCollaborators: Collaborator[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, reassignToId?: string) => void;
}

export function RemoveCollaboratorConfirm({
  collaborator,
  activeCollaborators,
  open,
  onOpenChange,
  onConfirm,
}: RemoveCollaboratorConfirmProps) {
  const [reassignTarget, setReassignTarget] = useState<string | null>(null);

  const hasAssignments = useMemo(() => {
    if (!collaborator) return false;
    return collaborator.assignments.clients.length > 0 || collaborator.assignments.transactions.length > 0;
  }, [collaborator]);

  const potentialReassignees = useMemo(() => {
    if (!collaborator) return [];
    return activeCollaborators.filter(c => c.id !== collaborator.id && c.type === collaborator.type);
  }, [collaborator, activeCollaborators]);

  const handleConfirm = () => {
    if (collaborator) {
      onConfirm(collaborator.id, reassignTarget || undefined);
      setReassignTarget(null);
    }
  };

  if (!collaborator) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px] bg-white border-none text-slate-900 shadow-2xl p-0 overflow-hidden rounded-[40px]">
        <div className="p-12">
           <div className="mb-6 flex">
              <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
                 <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
           </div>
           
           <AlertDialogHeader className="space-y-3 text-left mb-8">
              <AlertDialogTitle className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                Remove {collaborator.name}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[16px] text-slate-500 font-medium">
                {collaborator.status === "invited" 
                 ? "Their invitation link will be cancelled immediately." 
                 : "They will lose access to all portal features immediately."}
              </AlertDialogDescription>
           </AlertDialogHeader>

           {hasAssignments && (
             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[24px] space-y-3 shadow-sm relative">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest leading-none">Pending Assignments</p>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                    This collaborator has <span className="font-bold text-slate-900">{collaborator.assignments.clients.length} clients</span> 
                    {collaborator.assignments.transactions.length > 0 && <span> and <span className="font-bold text-slate-900">{collaborator.assignments.transactions.length} transactions</span></span>}.
                  </p>
                </div>

                {potentialReassignees.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pl-1">
                       <ArrowRight className="h-3.5 w-3.5 text-blue-500 font-bold" />
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Transfer to another {collaborator.type.toUpperCase()}</label>
                    </div>
                    <Select onValueChange={setReassignTarget} value={reassignTarget || ""}>
                      <SelectTrigger className="w-full h-14 bg-white border border-slate-200 text-slate-900 rounded-[20px] shadow-sm focus:ring-4 focus:ring-blue-50 transition-all font-semibold px-6">
                        <SelectValue placeholder={`Select a replacement...`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-100 text-slate-700 shadow-2xl rounded-2xl p-2">
                        {potentialReassignees.map(c => (
                          <SelectItem key={c.id} value={c.id} className="rounded-xl py-3 px-4 cursor-pointer focus:bg-slate-50 font-medium">
                            {c.name} ({c.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                   <div className="p-5 rounded-[20px] border border-slate-100 bg-slate-50/50 flex gap-4">
                      <AlertCircle className="h-5 w-5 text-slate-400 shrink-0" />
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        No other active {collaborator.type.toUpperCase()}s available for reassignment. These tasks will become unassigned.
                      </p>
                   </div>
                )}
             </div>
           )}
           
           <AlertDialogFooter className="flex flex-row gap-4 mt-10">
              <AlertDialogCancel className="mt-0 h-14 flex-1 rounded-[30px] border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all font-bold">
                Keep Collaborator
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirm}
                className={cn(
                   "flex-1 h-14 rounded-[30px] font-bold text-white shadow-xl transition-all active:scale-95",
                   reassignTarget ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" : "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                )}
              >
                {reassignTarget ? (
                  <div className="flex items-center gap-2">
                    Transfer <ArrowRight className="h-4 w-4" />
                  </div>
                ) : "Delete"}
              </AlertDialogAction>
           </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
