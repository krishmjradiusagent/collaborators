import * as React from "react"
import { Phone, ChevronRight, Paperclip, Smile, Send, Sparkles } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { Conversation, Message } from "../../types"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"
import { UserRole } from "../../../../contexts/RoleContext"

interface ChatWindowProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (text: string, type?: 'text' | 'file') => void
  hasFullAccess: boolean
  currentRole: UserRole
}

export function ChatWindow({ conversation, messages, onSendMessage, hasFullAccess, currentRole }: ChatWindowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const contact = conversation.participants[1]

  // Mock "generated number" check for Lender/Vendor
  // In real app, this would be a check like user.generatedNumberMap[clientId]
  const hasGeneratedNumber = false 
  const canSend = hasFullAccess || hasGeneratedNumber

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Chat Header */}
      <header className="h-[76px] border-b border-[#EFEFEF] px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
            {contact?.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                {contact?.name?.[0]}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[17px] font-bold text-[#303030] tracking-tight leading-none mb-1">{contact?.name}</h3>
            {contact?.phoneNumber && (
              <span className="text-[12px] text-slate-400 font-bold tabular-nums tracking-widest leading-none">
                {contact.phoneNumber}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
           {conversation.type === 'chat' && (
              <div className="flex items-center gap-2 bg-[#F5F5F7] p-1 rounded-[10px]">
                 <div className="flex items-center gap-1.5 px-2 py-1">
                    <Sparkles className="size-3.5 text-indigo-500 fill-indigo-500/20" />
                    <span className="text-[12px] font-black text-slate-500 uppercase tracking-tighter italic">Mel</span>
                 </div>
                 <div className="w-10 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer hover:bg-slate-300 transition-colors">
                    <div className="absolute left-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                 </div>
              </div>
           )}
           <button className="flex items-center gap-1 text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
            Details
            <ChevronRight className="size-4" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-[#FAFAFB]/30 custom-scrollbar"
      >
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 bg-slate-100/80 backdrop-blur-sm text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-full">Today</span>
        </div>

        {messages.map((msg, i) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={msg.senderId === 'u1'} //Vanessa Brown ID
            showSender={conversation.type === 'chat'}
          />
        ))}
      </div>

      {/* AI Indicator */}
      {conversation.type === 'chat' && (
         <div className="flex justify-center py-2 bg-gradient-to-b from-transparent to-white/50">
            <div className="flex items-center gap-2 px-4 py-1 bg-indigo-50/50 rounded-full border border-indigo-100/50">
               <span className="text-[11px] font-bold text-indigo-400 tracking-tighter">Powered by <span className="font-black italic">Mel</span></span>
            </div>
         </div>
      )}

      {/* Input Area */}
      <div className="p-6 pt-2 shrink-0 bg-white">
        {!canSend && (
           <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
              <p className="text-[13px] text-amber-600 font-bold leading-relaxed tracking-tight">
                 Access Restricted: You can view messages sent by agents, but you need a generated number to send messages to this client.
              </p>
           </div>
        )}
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={!canSend}
          placeholder={conversation.type === 'chat' ? "Type your message or @mel for AI..." : "Type your message..."}
        />
        {conversation.type === 'chat' && (
           <div className="mt-3 flex justify-center gap-4">
              <span className="text-[10px] text-slate-400 font-medium">Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for new line</span>
           </div>
        )}
      </div>
    </div>
  )
}
