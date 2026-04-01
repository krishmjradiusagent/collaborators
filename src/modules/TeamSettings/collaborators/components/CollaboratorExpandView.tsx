import { Collaborator, Client, Transaction } from "../types";
import { Button } from "../../../../components/ui/Button";
import { 
  Building2, 
  User, 
  History, 
  Mail, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from "lucide-react";


interface CollaboratorExpandViewProps {
  collaborator: Collaborator;
  allClients: Client[];
  allTransactions: Transaction[];
  onRemove: () => void;
  onResend: () => void;
}

export function CollaboratorExpandView({
  collaborator,
  onRemove,
  onResend,
}: CollaboratorExpandViewProps) {
  const isTC = collaborator.type === "tc";
  const { assignments } = collaborator;
  
  return (
    <div className="p-8 bg-slate-50/50 border-x border-b border-slate-100 animate-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                 <User className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-lg font-bold text-slate-900">{collaborator.name}</h4>
                 <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                    <Building2 className="h-4 w-4" />
                    <span>Independent Contractor</span>
                 </div>
              </div>
           </div>

           <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] uppercase tracking-widest text-[#9ca3af] font-bold leading-none">Last Activity</span>
                 <span className="text-[13px] text-slate-600 font-bold">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] uppercase tracking-widest text-[#9ca3af] font-bold leading-none">Accepted On</span>
                 <span className="text-[13px] text-emerald-600 font-bold">Mar 12, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] uppercase tracking-widest text-[#9ca3af] font-bold leading-none">Performance</span>
                 <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[13px]">
                    <TrendingUp className="h-3.5 w-3.5" /> 92% Rank
                 </div>
              </div>
           </div>
        </div>

        {/* Assignments Hub */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">Active Assignments</h5>
              <Button variant="ghost" className="h-7 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-transparent px-0 flex gap-1">
                 Manage Assignments <ExternalLink className="h-3 w-3" />
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 transition-all group/card cursor-pointer">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                       <User className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">{assignments.clients.length}</span>
                 </div>
                 <h6 className="text-[15px] font-bold text-slate-800">Shared Clients</h6>
                 <p className="text-[13px] text-slate-500 font-medium mt-1">Direct access to portal and comms.</p>
                 <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>View all</span>
                    <ChevronRight className="h-3 w-3 group-hover/card:translate-x-1 transition-transform" />
                 </div>
              </div>

              {isTC && (
                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-indigo-300 transition-all group/card cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-900">{assignments.transactions.length}</span>
                  </div>
                  <h6 className="text-[15px] font-bold text-slate-800">Transactions</h6>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">Coordination and file auditing.</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>View all</span>
                      <ChevronRight className="h-3 w-3 group-hover/card:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}
           </div>

           {/* Quick Actions Bar */}
           <div className="flex items-center gap-3 pt-4 border-t border-slate-100/50">
              {collaborator.status === "invited" && (
                <Button 
                   onClick={onResend}
                   className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[30px] flex gap-2"
                >
                  <Mail className="h-4 w-4" /> Resend Invitation
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={onRemove}
                className="h-11 px-6 border-slate-200 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-500 font-bold rounded-[30px] flex gap-2 transition-all border-2"
              >
                <Trash2 className="h-4 w-4" /> Remove Team Access
              </Button>
              <div className="flex-1" />
              <div className="flex items-center gap-2 text-slate-400 font-bold border-l border-slate-200 pl-6 h-10">
                 <History className="h-4 w-4" />
                 <span className="text-[10px] uppercase tracking-widest font-bold leading-none">Audit Logs</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
