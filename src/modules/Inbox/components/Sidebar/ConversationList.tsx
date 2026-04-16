import * as React from "react"
import { cn } from "../../../../lib/utils"
import { Conversation } from "../../types"
import { ChevronRight } from "lucide-react"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="flex flex-col">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "w-full flex items-center gap-4 p-4 transition-all border-b border-[#F5F5F7] hover:bg-slate-50 relative group",
            selectedId === conv.id ? "bg-slate-50/80" : "bg-white"
          )}
        >
          {/* Avatar / Icon */}
          <div className="relative shrink-0">
            <div className="size-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
              {conv.participants[1]?.avatar ? (
                <img 
                  src={conv.participants[1].avatar} 
                  alt={conv.participants[1].name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={cn(
                  "w-full h-full flex items-center justify-center text-white font-bold",
                  conv.type === 'message' ? "bg-blue-500" : "bg-indigo-500"
                )}>
                  {conv.participants[1]?.name?.[0] || '?'}
                </div>
              )}
            </div>
            {conv.participants[1]?.isOnline && (
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[15px] font-bold text-[#303030] truncate pr-2">
                {conv.clientGeneratedNumber || conv.participants[1]?.name}
              </span>
              <span className="text-[12px] text-slate-400 font-medium whitespace-nowrap tabular-nums">
                {conv.lastMessage?.timestamp}
              </span>
            </div>
            <p className={cn(
              "text-[13px] truncate leading-tight",
              conv.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
            )}>
              {conv.lastMessage?.text}
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {conv.unreadCount > 0 && (
              <div className="bg-[#5A5FF2] text-white size-5 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums shadow-sm shadow-[#5A5FF2]/20">
                {conv.unreadCount}
              </div>
            )}
             <ChevronRight className={cn(
                "size-4 text-slate-300 transition-transform group-hover:translate-x-0.5",
                selectedId === conv.id ? "text-[#5A5FF2]" : ""
             )} />
          </div>

          {/* Selected Indicator */}
          {selectedId === conv.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#5A5FF2] rounded-r-full" />
          )}
        </button>
      ))}
    </div>
  )
}
