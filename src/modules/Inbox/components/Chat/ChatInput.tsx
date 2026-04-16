import * as React from "react"
import { Paperclip, Smile, Send } from "lucide-react"
import { cn } from "../../../../lib/utils"

interface ChatInputProps {
  onSendMessage: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSendMessage, disabled, placeholder }: ChatInputProps) {
  const [text, setText] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text)
      setText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn(
       "flex items-end gap-3 transition-opacity",
       disabled && "opacity-50"
    )}>
      <div className="flex items-center gap-1 shrink-0 pb-1.5">
         <button 
           disabled={disabled}
           className="size-10 rounded-full flex items-center justify-center bg-[#F5F5F7] text-slate-400 hover:text-[#5A5FF2] hover:bg-[#EEF2FF] transition-all disabled:pointer-events-none"
         >
           <Paperclip className="size-5" />
         </button>
         <button 
           disabled={disabled}
           className="size-10 rounded-full flex items-center justify-center bg-[#F5F5F7] text-slate-400 hover:text-[#5A5FF2] hover:bg-[#EEF2FF] transition-all disabled:pointer-events-none"
         >
           <Smile className="size-5" />
         </button>
      </div>

      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type a message..."}
          disabled={disabled}
          rows={1}
          className="w-full bg-[#F5F5F7] border-none rounded-[20px] py-4 px-6 text-[15px] font-medium focus:ring-2 focus:ring-[#5A5FF2]/20 outline-none transition-all resize-none placeholder:text-slate-400 min-h-[56px] max-h-32 custom-scrollbar"
        />
        <div className="absolute right-4 bottom-4 text-[11px] text-slate-300 font-bold tabular-nums">
           {text.length}/700
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className={cn(
          "size-[56px] rounded-full flex items-center justify-center transition-all shrink-0 shadow-lg",
          text.trim() && !disabled 
            ? "bg-[#5A5FF2] text-white shadow-[#5A5FF2]/30 scale-100" 
            : "bg-[#F5F5F7] text-slate-300 shadow-none scale-95"
        )}
      >
        <Send className="size-6 mr-0.5" />
      </button>
    </div>
  )
}
