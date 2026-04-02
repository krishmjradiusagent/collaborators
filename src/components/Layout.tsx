import * as React from "react"
import {
  Users,
  Settings,
  FileText,
  ChevronDown,
  Bell,
  Check,
} from "lucide-react"
import { useRole } from "../contexts/RoleContext"
import { ContextSwitcher } from "./ContextSwitcher"

import { cn } from "../lib/utils"

interface LayoutProps {
  children: React.ReactNode
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

export function Layout({ children, activeTab = "Team settings", setActiveTab }: LayoutProps) {
  const { currentRole, selectedTeam, isCollaborator } = useRole()
  const tabs = [
    "Accounts",
    "Integrations",
    "Billing",
    "Finances",
    "Team settings",
    "Notification settings",
  ]

  const sidebarItems = [
    { icon: Users, label: "Clients" },
    { icon: FileText, label: "Documents" },
    { icon: Bell, label: "Security" },
    ...(!isCollaborator ? [{ icon: Settings, label: "Team" }] : []),
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden w-full">
      {/* Primary Navigation - Fixed at Top - Height 70px */}
      <header className="h-[70px] border-b border-[#EFEFEF] bg-white px-6 flex items-center justify-between sticky top-0 z-[100] shadow-radius-nav w-full shrink-0">
        <div className="flex items-center gap-4">
           {/* Dynamic Team Logo & Identity */}
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl shadow-sm" style={{ backgroundColor: selectedTeam?.primaryColor }}>
                 {selectedTeam?.logo ? (
                   <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-contain p-1" />
                 ) : (
                   <span className="text-white font-black text-[12px] tracking-tighter">
                     {selectedTeam?.name.split(' ').map(n => n[0]).join('') || 'RA'}
                   </span>
                 )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black tracking-[0.1em] text-[#303030] uppercase">
                  {selectedTeam?.name || 'RADIUS'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                  {currentRole.replace(/_/g, ' ')}
                </span>
              </div>
           </div>
           
           <div className="h-8 w-px bg-slate-100 mx-2" />
           
           <ContextSwitcher />
        </div>

        <div className="flex items-center gap-10">
          {/* Management buttons removed as per request */}

          <div className="h-[70px] w-px bg-[#EFEFEF] ml-2" />

          {/* Profile Section */}
          <div className="flex items-center gap-4 pl-4 pr-2">
             <div className="w-[48px] h-[48px] rounded-full overflow-hidden border border-[#EFEFEF]">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" 
                  alt="VB" 
                  className="w-full h-full object-cover"
                />
             </div>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[16px] font-semibold text-[#303030] leading-none mb-1">Vanessa Brown</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-[12px] h-[12px] bg-blue-600 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: selectedTeam?.primaryColor }}>
                    <Check className="w-[8px] h-[8px] text-white" strokeWidth={4} />
                 </div>
                 <span className="text-[12px] text-[#303030] lining-nums">Radius Agent</span>
              </div>
            </div>
            <ChevronDown className="h-[16px] w-[16px] text-blue-600 ml-2" style={{ color: selectedTeam?.primaryColor }} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full relative">
        {/* Side bar - Starts Exactly Below Header - Absolute position with no gaps */}
        <aside className="w-[72px] border-r border-[#EFEFEF] fixed left-0 top-[70px] bottom-0 bg-white flex flex-col items-center py-5 gap-6 z-50">
           {/* Top Logo Icon (Up Arrow Circle) - Larger and Closer to top */}
           <div className="flex items-center justify-center pb-2">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="16" cy="16" r="14" stroke="#D1D5DB" strokeWidth="1" />
                 <path d="M10 18L16 12L22 18" stroke={selectedTeam?.primaryColor || "#2563EB"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
           </div>

          <div className="flex flex-col items-center gap-6 w-full">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveTab?.(item.label)}
                className={cn(
                  "p-[10px] rounded-[12px] transition-all duration-300 size-[44px] flex items-center justify-center relative group",
                  activeTab === item.label ? "bg-[#EEF2FF] text-[#5A5FF2] shadow-[0_4px_12px_rgba(90,95,242,0.15)] ring-1 ring-[#5A5FF2]/20" : "text-[#4F7396] hover:bg-slate-50 hover:text-slate-900"
                )}
                style={activeTab === item.label ? { backgroundColor: `${selectedTeam?.primaryColor}10`, color: selectedTeam?.primaryColor, boxShadow: `0 4px 12px ${selectedTeam?.primaryColor}15` } : {}}
              >
                <item.icon className={cn("h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-110", activeTab === item.label ? "fill-[#5A5FF2]/10" : "")} style={activeTab === item.label ? { color: selectedTeam?.primaryColor } : {}} />
                {activeTab === item.label && (
                  <div className="absolute left-0 w-1 h-6 bg-[#5A5FF2] rounded-r-full -ml-[1px]" style={{ backgroundColor: selectedTeam?.primaryColor }} />
                )}
              </button>
            ))}
          </div>

          {/* Bottom Settings Icon - Moved to end of side panel */}
          <div className="mt-auto flex flex-col items-center gap-6 pb-4">
             <button
                onClick={() => setActiveTab?.("Settings")}
                className={cn(
                  "p-[10px] rounded-[12px] transition-all duration-300 size-[44px] flex items-center justify-center relative group",
                  activeTab === "Settings" ? "bg-[#EEF2FF] text-[#5A5FF2] shadow-[0_4px_12px_rgba(90,95,242,0.15)] ring-1 ring-[#5A5FF2]/20" : "text-[#4F7396] hover:bg-slate-50 hover:text-slate-900"
                )}
             >
                <Settings className={cn("h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-110", activeTab === "Settings" ? "fill-[#5A5FF2]/10" : "")} />
                {activeTab === "Settings" && (
                  <div className="absolute left-0 w-1 h-6 bg-[#5A5FF2] rounded-r-full -ml-[1px]" />
                )}
             </button>
          </div>
        </aside>

        {/* Main Content Area - Total Screen Width, Flush with Sidebar */}
        <main className="flex-1 ml-[72px] bg-white min-h-[calc(100vh-70px)] pb-32">
          {/* Content Wrapper - Full width */}
          <div className={cn("pt-8 w-full border-t border-transparent", activeTab === "Clients" ? "px-0" : "px-8")}>
             {activeTab !== "Clients" && activeTab !== "Documents" && (
                <>
                  <h1 className="text-[24px] font-semibold text-[#373758] tracking-[-0.48px] mb-8">{activeTab === "Team" ? "Team settings" : activeTab}</h1>
                  
                  {/* Tabs - Only for Team settings / General settings */}
                  <nav className="flex items-center border-b border-[#EFEFEF] w-full mb-6">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab?.(tab)}
                          className={cn(
                            "px-4 py-2 h-[40px] text-[14px] font-semibold transition-all relative whitespace-nowrap flex items-center justify-center",
                            tab === activeTab || (activeTab === "Team" && tab === "Team settings")
                              ? "text-primary border-b-2 border-primary"
                              : "text-[#373758] hover:text-primary"
                          )}
                        >
                          {tab}
                        </button>
                      ))}
                  </nav>
                </>
             )}

             {/* Inner Content - No extra horizontal margins */}
             <div className="w-full">
                {children}
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
