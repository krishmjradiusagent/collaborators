import * as React from "react"
import { useRole, MOCK_TEAMS, MOCK_AGENTS } from "../contexts/RoleContext"
import { cn } from "../lib/utils"
import { 
  ChevronDown, 
  Home, 
  User, 
  ShieldCheck,
  Check
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"

export function ContextSwitcher() {
  const { 
    isCollaborator, 
    selectedTeam, setSelectedTeam,
    selectedAgent, setSelectedAgent,
    selectedTransaction, setSelectedTransaction
  } = useRole()

  const [open, setOpen] = React.useState(false)

  if (!isCollaborator) return null

  // Active label logic
  const activeLabel = selectedTransaction 
    ? selectedTransaction.address 
    : selectedAgent 
    ? selectedAgent.name 
    : selectedTeam?.name || "Select Context"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn(
          "h-11 px-4 gap-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center transition-all group",
          open && "bg-white border-[#5A5FF2]/20 shadow-lg ring-4 ring-[#5A5FF2]/5"
        )}>
           <div className="size-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
             {selectedTransaction ? <Home className="size-3.5" /> : selectedAgent ? <User className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
           </div>
           
           <div className="flex flex-col text-left min-w-[120px] max-w-[200px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60 leading-tight mb-0.5">Assigned Viewing</span>
              <span className="text-[13px] font-bold text-[#171717] truncate leading-tight">{activeLabel}</span>
           </div>
           
           <ChevronDown className={cn("size-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ml-1", open ? "rotate-180" : "")} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0 rounded-3xl shadow-[0px_20px_50px_rgba(0,0,0,0.15)] border-slate-100 overflow-hidden z-[9999]" align="start">
        <Command className="border-none">
          <CommandInput 
            placeholder="Search teams, agents, or deals..." 
            className="h-12 border-none ring-0 focus:ring-0 text-[14px]"
          />
          <CommandList className="max-h-[400px]">
             <CommandEmpty className="py-8 text-center text-sm text-slate-500 font-medium tracking-tight">No assignments found.</CommandEmpty>
             
             {/* Team Switching */}
             <CommandGroup heading={<span className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 opacity-60">Assigned Teams</span>}>
               {MOCK_TEAMS.map(team => (
                 <CommandItem
                   key={team.id}
                   onSelect={() => {
                     setSelectedTeam(team)
                     setSelectedAgent(null)
                     setSelectedTransaction(null)
                     setOpen(false)
                   }}
                   className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all mb-1"
                 >
                   <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-[11px] uppercase tracking-tighter">
                        {team.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[14px] font-bold text-[#171717]">{team.name}</span>
                   </div>
                   {selectedTeam?.id === team.id && !selectedAgent && !selectedTransaction && <Check className="size-4 text-[#5A5FF2] stroke-[3px]" />}
                 </CommandItem>
               ))}
             </CommandGroup>

             <Separator className="my-2 bg-slate-50 mx-3" />

             {/* Agent Switching */}
             <CommandGroup heading={<span className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 opacity-60">Team Agents</span>}>
                {MOCK_AGENTS.map(agent => (
                  <CommandItem
                    key={agent.id}
                    onSelect={() => {
                      setSelectedAgent(agent)
                      setSelectedTransaction(null)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all mb-1"
                  >
                    <div className="flex items-center gap-3">
                       <Avatar className="h-9 w-9 rounded-xl shadow-sm border border-slate-100">
                         <AvatarImage src={agent.avatar} />
                         <AvatarFallback>{agent.name.substring(0,2)}</AvatarFallback>
                       </Avatar>
                       <span className="text-[14px] font-bold text-[#171717]">{agent.name}</span>
                    </div>
                    {selectedAgent?.id === agent.id && !selectedTransaction && <Check className="size-4 text-[#5A5FF2] stroke-[3px]" />}
                  </CommandItem>
                ))}
             </CommandGroup>
             
             <Separator className="my-2 bg-slate-50 mx-3" />

             {/* Transaction Switching (Simplified for Demo) */}
             <CommandGroup heading={<span className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 opacity-60">Assigned Deals</span>}>
                <CommandItem
                  onSelect={() => {
                    setSelectedTransaction({ id: 'tx1', address: '123 Mission St, Apt 4B', clientId: 'c1' })
                    setOpen(false)
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all mb-1"
                >
                   <div className="flex items-center gap-3 overflow-hidden">
                      <div className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Home className="size-4" />
                      </div>
                      <span className="text-[14px] font-bold text-[#171717] truncate">123 Mission St, Apt 4B</span>
                   </div>
                   {selectedTransaction?.id === 'tx1' && <Check className="size-4 text-[#5A5FF2] stroke-[3px]" />}
                </CommandItem>
             </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
