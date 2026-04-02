import * as React from "react"
import {
  Users,
  Settings,
  FileText,
  ChevronDown,
  Bell,
  Check,
} from "lucide-react"
import { cn } from "../lib/utils"

interface LayoutProps {
  children: React.ReactNode
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

export function Layout({ children, activeTab = "Team settings", setActiveTab }: LayoutProps) {
  const tabs = [
    "Accounts",
    "Integrations",
    "Billing",
    "Finances",
    "Team settings",
    "Notification settings",
  ]

  const sidebarItems = [
    { icon: Users, label: "Team" },
    { icon: Users, label: "Clients" },
    { icon: FileText, label: "Documents" },
    { icon: Bell, label: "Security" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden w-full">
      {/* Primary Navigation - Fixed at Top - Height 70px */}
      <header className="h-[70px] border-b border-[#EFEFEF] bg-white px-6 flex items-center justify-between sticky top-0 z-[100] shadow-radius-nav w-full shrink-0">
        <div className="flex items-center gap-4">
           {/* Exact Radius Logo & Type from Figma */}
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center">
                 <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" stroke="#D1D5DB" strokeWidth="0.8" />
                    <circle cx="16" cy="16" r="10" stroke="#9CA3AF" strokeWidth="0.8" />
                    <circle cx="16" cy="16" r="6" stroke="#4B5563" strokeWidth="0.8" />
                    <circle cx="16" cy="16" r="2" stroke="#111827" strokeWidth="0.8" />
                 </svg>
              </div>
              <span className="text-[18px] font-extralight tracking-[0.25em] text-[#303030]">RADIUS</span>
           </div>
        </div>

        <div className="flex items-center gap-10">
          <nav className="flex items-center gap-7 text-[16px] text-[#303030]">
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
              Our Brokerage <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            <button className="hover:text-primary transition-colors">
              Our Community
            </button>
          </nav>

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
                 <div className="w-[12px] h-[12px] bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-[8px] h-[8px] text-white" strokeWidth={4} />
                 </div>
                 <span className="text-[12px] text-[#303030] lining-nums">Radius Agent</span>
              </div>
            </div>
            <ChevronDown className="h-[16px] w-[16px] text-blue-600 ml-2" />
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
                 <path d="M10 18L16 12L22 18" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
           </div>

          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab?.(item.label)}
              className={cn(
                "p-[10px] rounded-[12px] transition-all duration-300 size-[44px] flex items-center justify-center relative group",
                activeTab === item.label ? "bg-[#EEF2FF] text-[#5A5FF2] shadow-[0_4px_12px_rgba(90,95,242,0.15)] ring-1 ring-[#5A5FF2]/20" : "text-[#4F7396] hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-110", activeTab === item.label ? "fill-[#5A5FF2]/10" : "")} />
              {activeTab === item.label && (
                <div className="absolute left-0 w-1 h-6 bg-[#5A5FF2] rounded-r-full -ml-[1px]" />
              )}
            </button>
          ))}
        </aside>

        {/* Main Content Area - Total Screen Width, Flush with Sidebar */}
        <main className="flex-1 ml-[72px] bg-white min-h-[calc(100vh-70px)] pb-32">
          {/* Content Wrapper - Full width */}
          <div className={cn("pt-8 w-full border-t border-transparent", activeTab === "Clients" ? "px-0" : "px-8")}>
             {activeTab !== "Clients" && (
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
