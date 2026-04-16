import * as React from "react"
import { Search, Plus, MessageSquare, MessagesSquare, ThumbsDown } from "lucide-react"
import { cn } from "../../lib/utils"
import { useRole } from "../../contexts/RoleContext"
import { ConversationList } from "./components/Sidebar/ConversationList"
import { ChatWindow } from "./components/Chat/ChatWindow"
import { Conversation, Message } from "./types"
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "./mockData"

export function InboxPage() {
  const { hasFullAccess, currentRole } = useRole()
  const [activeTab, setActiveTab] = React.useState<'chat' | 'message'>('message')
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null)
  const [conversations, setConversations] = React.useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null
  const messages = selectedConversationId ? (MOCK_MESSAGES[selectedConversationId] || []) : []

  const handleSendMessage = (text: string, type: 'text' | 'file' = 'text') => {
    if (!selectedConversationId) return
    
    // In a real app, this would be an API call
    console.log("Sending message:", text, type)
  }

  return (
    <div className="flex h-[calc(100vh-70px)] bg-white overflow-hidden border-t border-[#EFEFEF]">
      {/* Inbox Sidebar */}
      <div className="w-[380px] border-r border-[#EFEFEF] flex flex-col bg-white shrink-0">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[28px] font-black text-[#303030] tracking-tighter italic uppercase">Inbox</h1>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-[#F5F5F7] rounded-2xl">
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn(
                "flex-1 py-1.5 text-[13px] font-black uppercase tracking-tight rounded-xl transition-all",
                activeTab === 'chat' ? "bg-white text-[#303030] shadow-sm shadow-black/5" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveTab('message')}
              className={cn(
                "flex-1 py-1.5 text-[13px] font-black uppercase tracking-tight rounded-xl transition-all border-2",
                activeTab === 'message' ? "bg-white text-[#5A5FF2] border-[#5A5FF2] shadow-sm shadow-[#5A5FF2]/10" : "text-slate-400 hover:text-slate-600 border-transparent"
              )}
            >
               Messages
            </button>
          </div>

          {/* New Message Button */}
          <button className="w-full h-[48px] bg-[#5A5FF2] text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:opacity-90 transition-opacity mb-6 shadow-md shadow-[#5A5FF2]/20">
            <Plus className="size-5" />
            <span>New {activeTab === 'chat' ? 'Chat' : 'Message'}</span>
          </button>

          {/* Filters & Search */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-full bg-[#5A5FF2] text-white text-[12px] font-bold">All</button>
              <button className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[12px] font-bold flex items-center gap-1.5">
                Unread
                <span className="bg-[#5A5FF2] text-white size-5 rounded-full flex items-center justify-center text-[10px] tabular-nums">3</span>
              </button>
              <button className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[12px] font-bold">Client replied</button>
              {activeTab === 'chat' && (
                <button className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[12px] font-bold">Agents</button>
              )}
              {activeTab === 'message' && (
                <button className="p-1.5 rounded-full bg-slate-50 text-slate-400">
                  <ThumbsDown className="size-4" />
                </button>
              )}
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#5A5FF2] transition-colors" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F5F7] border-none rounded-xl py-2.5 pl-10 pr-4 text-[14px] font-medium focus:ring-2 focus:ring-[#5A5FF2]/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className={cn("pt-8 w-full border-t border-transparent", (activeTab === "Clients" || activeTab === "Inbox") ? "px-0 pt-0" : "px-8")}>
             {activeTab !== "Clients" && activeTab !== "Documents" && activeTab !== "Inbox" && (
             <div className="px-4 mb-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/50 transition-colors border border-indigo-100 group">
                   <div className="size-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <div className="size-6 text-indigo-600">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                           <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                           <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                   </div>
                   <span className="flex-1 text-[14px] font-bold text-slate-700 text-left">Chat with Mel</span>
                   <Plus className="size-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
             </div>
          )}
          <ConversationList 
             conversations={conversations.filter(c => c.type === activeTab)}
             selectedId={selectedConversationId}
             onSelect={setSelectedConversationId}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white relative">
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            hasFullAccess={hasFullAccess}
            currentRole={currentRole}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
            <div className="size-24 rounded-[40px] bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-8 animate-pulse text-slate-200">
               <MessageSquare className="size-12" />
            </div>
            <h2 className="text-[28px] font-black text-slate-700 uppercase tracking-tighter mb-2 italic">No conversation selected</h2>
            <p className="text-slate-400 font-bold max-w-sm tracking-tight leading-snug">
              Select a client and thread to start chatting with them effortlessly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
