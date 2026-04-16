import { 
  User, 
  Home, 
  MoreHorizontal, 
  MessageSquare, 
  Trash2, 
  UserCheck,
  Clock,
  ChevronRight
} from "lucide-react"
import { cn } from "../../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/Avatar"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/DropdownMenu"
import { Separator } from "../../../components/ui/Separator"
import { TypeBadge } from "../../TeamSettings/collaborators/components/badges/TypeBadge"
import { Collaborator, Transaction } from "../types"

interface CollaboratorCardProps {
  collaborator: Collaborator;
  assignmentType?: 'client' | 'transaction';
  transaction?: Transaction;
  onResendInvite?: () => void;
  onRemoveAccess?: () => void;
  onViewProfile?: () => void;
  onChat?: () => void;
  onUpgrade?: () => void;
}

export function CollaboratorCard({
  collaborator,
  assignmentType,
  transaction,
  onResendInvite,
  onRemoveAccess,
  onViewProfile,
  onChat,
  onUpgrade
}: CollaboratorCardProps) {
  const isInvited = collaborator.status === 'invited';

  return (
    <div className={cn(
      "group bg-white border border-slate-100 rounded-2xl p-4 flex flex-row items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.005] cursor-pointer"
    )}>
      {/* Identity Section (Left) */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
            <AvatarFallback className="bg-indigo-50 text-[#5A5FF2] font-black text-[12px]">
              {collaborator.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-black text-[#373758] text-[15px] tracking-tight truncate">{collaborator.name}</span>
          <TypeBadge type={collaborator.type} className="h-4.5 px-2 font-black tracking-widest rounded-full uppercase shrink-0" />
        </div>
      </div>

      {/* Right Section: Access Pills + Actions */}
      <div className="flex items-center gap-4 shrink-0 overflow-hidden ml-4">
        {isInvited ? (
          <div className="flex items-center gap-3">
            <Badge className="bg-[#5A5FF2] text-white hover:bg-[#5A5FF2] border-none text-[9px] h-5 px-3 font-black tracking-widest rounded-full uppercase">
              INVITED
            </Badge>

            <Button 
              variant="link" 
              className="text-[#5A5FF2] font-black text-[11px] h-auto p-0 hover:no-underline transition-all hover:gap-1.5"
              onClick={(e) => { e.stopPropagation(); onResendInvite?.(); }}
            >
              Resend Invite <ChevronRight className="size-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {assignmentType === 'client' && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex">
                    <Badge variant="outline" className="border-[#EEF2FF] bg-[#EEF2FF]/30 hover:border-[#5A5FF2]/30 hover:bg-[#EEF2FF]/50 transition-all text-[#5A5FF2] text-[11px] font-bold h-7 flex items-center gap-1.5 px-3 rounded-full cursor-help whitespace-nowrap shadow-sm">
                      <User className="size-3.5" />
                      CLIENT LEVEL ACCESS
                    </Badge>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 rounded-2xl shadow-2xl border-slate-100 bg-white z-[301]">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">PERMISSIONS</span>
                    <div className="grid grid-cols-1 gap-2">
                       <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                         <div className="size-1.5 rounded-full bg-[#5A5FF2]" /> Notes & Comments
                       </div>
                       <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                         <div className="size-1.5 rounded-full bg-[#5A5FF2]" /> Documents & Vault
                       </div>
                       <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                         <div className="size-1.5 rounded-full bg-[#5A5FF2]" /> Task Reminders
                       </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {transaction && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] border border-[#5A5FF2]/10 rounded-full cursor-help hover:border-[#5A5FF2]/30 transition-all shadow-sm shrink-0">
                    <Home className="size-3.5 text-[#5A5FF2]" />
                    <span className="text-[11px] font-bold text-[#5A5FF2] truncate max-w-[150px] uppercase">
                      {transaction.address.split(',')[0]}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 rounded-2xl shadow-2xl border-slate-100 bg-white z-[301]">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">TRANSACTION SCOPE</span>
                    <div className="text-[12px] font-bold text-slate-600 leading-relaxed">
                      Specific access restricted to the property at <span className="text-[#5A5FF2]">{transaction.address}</span> and its active timeline.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}

        <div className="shrink-0 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-[#5A5FF2] hover:bg-slate-50 transition-all rounded-xl">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-100 shadow-3xl p-2 rounded-2xl z-[301]">
              <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-[#5A5FF2] rounded-xl font-bold text-[13px]" onClick={() => onViewProfile?.()}>
                <UserCheck className="h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-[#5A5FF2] rounded-xl font-bold text-[13px]" onClick={() => onChat?.()}>
                <MessageSquare className="h-4 w-4" /> Chat
              </DropdownMenuItem>
              <Separator className="bg-slate-50 my-1.5" />
              {isInvited && (
                <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-slate-50 focus:text-[#5A5FF2] rounded-xl font-bold text-[13px]" onClick={() => onResendInvite?.()}>
                  <Clock className="h-4 w-4" /> Resend Credentials
                </DropdownMenuItem>
              )}
              {assignmentType === 'transaction' && (
                <DropdownMenuItem 
                  className="gap-3 p-3 cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 rounded-xl font-bold text-[13px]" 
                  onClick={() => onUpgrade?.()}
                >
                  <UserCheck className="h-4 w-4" /> Upgrade to Client Access
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-red-50 focus:text-red-600 rounded-xl font-bold text-[13px] group" onClick={() => onRemoveAccess?.()}>
                <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" /> Remove Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
