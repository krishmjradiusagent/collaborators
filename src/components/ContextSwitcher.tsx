import * as React from "react"
import { useRole } from "../contexts/RoleContext"
import { 
  Building2, 
  User, 
  Home, 
  ChevronDown, 
  Search, 
  Check,
  Command as CommandIcon 
} from "lucide-react"
import { cn } from "../lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"

export function ContextSwitcher() {
  const { activeContext, setActiveContext, availableContexts, role } = useRole()
  const [open, setOpen] = React.useState(false)

  const teams = availableContexts.filter(c => c.type === 'team')
  const agents = availableContexts.filter(c => c.type === 'agent')
  const transactions = availableContexts.filter(c => c.type === 'transaction')

  const getIcon = (type: string) => {
    switch (type) {
      case 'team': return Building2
      case 'agent': return User
      case 'transaction': return Home
      default: return CommandIcon
    }
  }

  const ActiveIcon = activeContext ? getIcon(activeContext.type) : CommandIcon

  // If role is TC/VA, Lender, Vendor, this is essential. For others, it's a context switcher.
  const label = role === 'Team Lead' || role === 'Agent' ? "Switch Team" : "Viewing Team"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[44px] px-4 rounded-xl bg-[#F8FAFC] border-slate-100 hover:bg-[#EEF2FF] hover:border-[#5A5FF2]/20 text-[#171717] font-bold text-[14px] flex items-center gap-3 transition-all group shrink-0"
        >
          <div className="size-7 rounded-lg bg-[#5A5FF2]/10 flex items-center justify-center shrink-0">
             <ActiveIcon className="size-4 text-[#5A5FF2]" strokeWidth={3} />
          </div>
          <div className="flex flex-col items-start gap-0">
             <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">{label}</span>
             <span className="truncate max-w-[200px] leading-tight flex items-center gap-2">
                {activeContext?.name || "Global Context"}
             </span>
          </div>
          <ChevronDown className={cn("ml-2 size-4 text-slate-300 transition-transform duration-300", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 rounded-[24px] shadow-[0px_20px_60px_rgba(0,0,0,0.15)] border-slate-100 overflow-hidden z-[9999]" align="start">
        <Command className="border-none">
          <div className="p-3 pb-0">
             <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl mb-2">
                <Search className="size-4 text-slate-400" />
                <CommandInput 
                  placeholder="Search context..." 
                  className="h-8 border-none ring-0 focus:ring-0 text-[13px]" 
                />
             </div>
          </div>
          <CommandList className="max-h-[400px] no-scrollbar">
            <CommandEmpty className="py-12 text-center text-[13px] text-slate-400">No context found.</CommandEmpty>
            
            {teams.length > 0 && (
              <CommandGroup heading={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block">Your Teams</span>} className="px-2">
                {teams.map((t) => (
                  <CommandItem
                    key={t.id}
                    onSelect={() => {
                      setActiveContext(t)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[#EEF2FF] aria-selected:bg-[#EEF2FF] transition-all group mb-1",
                      activeContext?.id === t.id && "bg-[#EEF2FF]/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-[#5A5FF2] text-[12px] shadow-sm">
                          {t.name.substring(0, 2).toUpperCase()}
                       </div>
                       <span className="text-[14px] font-black text-[#171717]">{t.name}</span>
                    </div>
                    {activeContext?.id === t.id && <Check className="size-4 text-[#5A5FF2]" strokeWidth={3} />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {agents.length > 0 && (
              <CommandGroup heading={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 mt-4 block">Individual Agents</span>} className="px-2">
                 {agents.map((a) => (
                  <CommandItem
                    key={a.id}
                    onSelect={() => {
                      setActiveContext(a)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[#EEF2FF] aria-selected:bg-[#EEF2FF] transition-all group mb-1",
                      activeContext?.id === a.id && "bg-[#EEF2FF]/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <User className="size-5 text-orange-500" />
                       </div>
                       <span className="text-[14px] font-black text-[#171717]">{a.name}</span>
                    </div>
                    {activeContext?.id === a.id && <Check className="size-4 text-[#5A5FF2]" strokeWidth={3} />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {transactions.length > 0 && (
              <CommandGroup heading={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 mt-4 block">Direct Transactions</span>} className="px-2">
                 {transactions.map((tx) => (
                  <CommandItem
                    key={tx.id}
                    onSelect={() => {
                      setActiveContext(tx)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[#EEF2FF] aria-selected:bg-[#EEF2FF] transition-all group mb-1",
                      activeContext?.id === tx.id && "bg-[#EEF2FF]/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                          <Home className="size-5 text-green-600" />
                       </div>
                       <span className="text-[14px] font-black text-[#171717]">{tx.name}</span>
                    </div>
                    {activeContext?.id === tx.id && <Check className="size-4 text-[#5A5FF2]" strokeWidth={3} />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <div className="p-3">
             <div className="p-4 bg-slate-50 rounded-[20px] text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Need access to more teams?</p>
                <button className="text-[12px] text-[#5A5FF2] font-black mt-1 hover:underline">Request TC Assignment</button>
             </div>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
