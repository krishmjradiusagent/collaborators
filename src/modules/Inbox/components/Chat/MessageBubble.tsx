import * as React from "react"
import { Check, CheckCheck, Download, FileText } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { Message } from "../../types"
import { MOCK_USERS } from "../../mockData"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showSender?: boolean
}

export function MessageBubble({ message, isOwn, showSender }: MessageBubbleProps) {
  const sender = MOCK_USERS[message.senderId]

  return (
    <div className={cn("flex flex-col w-full", isOwn ? "items-end" : "items-start")}>
      {showSender && !isOwn && (
        <span className="text-[12px] font-bold text-slate-400 mb-2 ml-4 italic">{sender?.name}</span>
      )}
      
      <div className={cn("group relative flex items-end gap-3 max-w-[85%]", isOwn ? "flex-row-reverse" : "flex-row")}>
        {/* Actual Bubble */}
        <div className={cn(
          "px-5 py-3.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm transition-all duration-300",
          isOwn 
            ? "bg-[#5A5FF2] text-white rounded-br-none shadow-[#5A5FF2]/10" 
            : "bg-[#F0F0F2] text-[#303030] rounded-bl-none border border-[#F0F0F2]"
        )}>
          {message.type === 'file' ? (
            <div className={cn(
               "flex items-center gap-4 py-1",
               isOwn ? "text-white" : "text-slate-700"
            )}>
               <div className={cn(
                  "size-12 rounded-xl flex items-center justify-center shrink-0",
                  isOwn ? "bg-white/20" : "bg-indigo-500"
               )}>
                  <FileText className={cn("size-6", isOwn ? "text-white" : "text-white")} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="font-bold truncate text-[14px]">{message.fileName}</span>
                  <span className={cn("text-[11px] font-medium opacity-70", isOwn ? "text-white" : "text-slate-500")}>
                    {message.fileSize}
                  </span>
               </div>
               <button className={cn(
                  "size-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors ml-2",
                  isOwn ? "text-white" : "text-slate-400"
               )}>
                  <Download className="size-4" />
               </button>
            </div>
          ) : (
            <p className="font-medium tracking-tight pr-2">{message.text}</p>
          )}

          {/* Metadata Overlay inside bubble (optional) - or outside */}
          <div className={cn(
             "mt-2 flex items-center gap-1.5",
             isOwn ? "justify-end" : "justify-start"
          )}>
             <span className={cn(
                "text-[10px] tabular-nums font-bold uppercase tracking-wider",
                isOwn ? "text-white/60" : "text-slate-400"
             )}>
                {message.timestamp}
             </span>
             {isOwn && message.status && (
                <div className="flex items-center">
                   {message.status === 'read' ? (
                      <CheckCheck className="size-3.5 text-blue-200" />
                   ) : (
                      <Check className="size-3.5 text-white/40" />
                   )}
                   <span className="text-[10px] font-black tracking-widest ml-1 text-white/50 uppercase">Delivered</span>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
