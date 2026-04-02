import * as React from "react"
import {
  Users,
  Settings,
  ChevronDown,
  Bell,
  Check,
  Home,
  LayoutGrid
} from "lucide-react"
import { cn } from "../lib/utils"
import { useRole } from "../contexts/RoleContext"
import { ContextSwitcher } from "./ContextSwitcher"

interface LayoutProps {
  children: React.ReactNode
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

export function Layout({ children, activeTab = "Team settings", setActiveTab }: LayoutProps) {
  const { role, activeTeam } = useRole()
  
  const tabs = [
    "Accounts",
    "Integrations",
    "Billing",
    "Finances",
    "Team settings",
    "Notification settings",
  ]

  const isCollaborator = ['TC/VA', 'Lender', 'Vendor'].includes(role)

  const sidebarItems = [
    { icon: Users, label: "Clients" },
    { icon: Home, label: "Transactions" },
    // Only show these for non-collaborators
    ...(!isCollaborator ? [
      { icon: Bell, label: "Security" },
      { icon: Settings, label: "Team" }
    ] : [])
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden w-full">
      {/* Primary Navigation - Fixed at Top - Height 70px */}
      <header className="h-[70px] border-b border-[#EFEFEF] bg-white px-6 flex items-center justify-between sticky top-0 z-[100] shadow-radius-nav w-full shrink-0">
        <div className="flex items-center gap-6">
           {/* Dynamic Team Branding Logo */}
           <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-black/5"
                style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
              >
                 {activeTeam?.logo || "RA"}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black tracking-tight text-[#171717] leading-none mb-0.5">{activeTeam?.name?.toUpperCase()}</span>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 leading-none">WORKSPACE</span>
              </div>
           </div>

           <div className="h-8 w-px bg-slate-100 mx-2" />
           
           <ContextSwitcher />
        </div>

        <div className="flex items-center gap-10">
          <nav className="flex items-center gap-7 text-[15px] text-[#171717] font-bold">
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors text-slate-400">
              Our Brokerage <ChevronDown className="h-4 w-4 text-gray-300" />
            </button>
            <button className="hover:text-primary transition-colors text-slate-400">
              Our Community
            </button>
          </nav>

          <div className="h-[70px] w-px bg-[#EFEFEF] ml-2" />

          {/* Profile Section */}
          <div className="flex items-center gap-4 pl-4 pr-2">
             <div className="w-[44px] h-[44px] rounded-full overflow-hidden border-2 border-slate-50 ring-2 ring-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" 
                  alt="VB" 
                  className="w-full h-full object-cover"
                />
             </div>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[15px] font-black text-[#171717] leading-none mb-1">Vanessa Brown</span>
              <div className="flex items-center gap-1.5">
                 <div 
                   className="size-[14px] rounded-full flex items-center justify-center shrink-0"
                   style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
                 >
                    <Check className="w-[9px] h-[9px] text-white" strokeWidth={5} />
                 </div>
                 <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{role}</span>
              </div>
            </div>
            <ChevronDown className="h-[14px] w-[14px] text-slate-300 ml-2" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full relative">
        {/* Side bar - Starts Exactly Below Header */}
        <aside className="w-[72px] border-r border-[#EFEFEF] fixed left-0 top-[70px] bottom-0 bg-white flex flex-col items-center py-6 gap-6 z-50">
           {/* Top Grid Icon - Dynamic Primary Color */}
           <div className="flex items-center justify-center pb-2">
              <div 
                className="size-11 rounded-2xl flex items-center justify-center shadow-lg shadow-[#5A5FF2]/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{ backgroundColor: activeTeam?.accentColor || "#EEF2FF" }}
              >
                 <LayoutGrid style={{ color: activeTeam?.primaryColor || "#5A5FF2" }} className="size-5" strokeWidth={2.5} />
              </div>
           </div>

          <div className="flex flex-col items-center gap-6 w-full mt-2">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveTab?.(item.label)}
                className={cn(
                  "p-[10px] rounded-[16px] transition-all duration-300 size-[48px] flex items-center justify-center relative group",
                  activeTab === item.label 
                    ? "shadow-[0_8px_20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                )}
                style={activeTab === item.label ? { 
                  backgroundColor: "white",
                  color: activeTeam?.primaryColor || "#5A5FF2" 
                } : {}}
              >
                <item.icon className={cn("h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-110", activeTab === item.label ? "" : "")} strokeWidth={2.5} />
                {activeTab === item.label && (
                  <div 
                    className="absolute left-0 w-1 h-6 rounded-r-full -ml-[1px]" 
                    style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Bottom Settings Icon - Moved to end of side panel */}
          <div className="mt-auto flex flex-col items-center gap-6 pb-6">
             <button
                onClick={() => setActiveTab?.("Settings")}
                className={cn(
                  "p-[10px] rounded-[16px] transition-all duration-300 size-[48px] flex items-center justify-center relative group",
                  activeTab === "Settings" ? "bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                )}
                style={activeTab === "Settings" ? { color: activeTeam?.primaryColor || "#5A5FF2" } : {}}
             >
                <Settings className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
                {activeTab === "Settings" && (
                  <div 
                    className="absolute left-0 w-1 h-6 rounded-r-full -ml-[1px]" 
                    style={{ backgroundColor: activeTeam?.primaryColor || "#5A5FF2" }}
                  />
                )}
             </button>
          </div>
        </aside>

        {/* Main Content Area - Total Screen Width, Flush with Sidebar */}
        <main className="flex-1 ml-[72px] bg-white min-h-[calc(100vh-70px)] pb-32">
          {/* Content Wrapper - Full width */}
          <div className={cn("pt-8 w-full border-t border-transparent", activeTab === "Clients" || activeTab === "Transactions" ? "px-0" : "px-8")}>
             {activeTab !== "Clients" && activeTab !== "Transactions" && (
                <>
                  <h1 className="text-[28px] font-black text-[#171717] tracking-tight mb-8">{activeTab === "Team" ? "Team settings" : activeTab}</h1>
                  
                  {/* Tabs - Only for Team settings / General settings */}
                  <nav className="flex items-center border-b border-slate-100 w-full mb-6 gap-2">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab?.(tab)}
                          className={cn(
                            "px-6 py-3 h-[48px] text-[13px] font-black transition-all relative whitespace-nowrap flex items-center justify-center uppercase tracking-widest",
                            tab === activeTab || (activeTab === "Team" && tab === "Team settings")
                              ? "border-b-2"
                              : "text-slate-400 hover:text-slate-600"
                          )}
                          style={(tab === activeTab || (activeTab === "Team" && tab === "Team settings")) ? {
                            color: activeTeam?.primaryColor || "#5A5FF2",
                            borderBottomColor: activeTeam?.primaryColor || "#5A5FF2"
                          } : {}}
                        >
                          {tab}
                        </button>
                      ))}
                  </nav>
                </>
             )}

             {/* Inner Content */}
             <div className="w-full">
                {children}
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
