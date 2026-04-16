import * as React from "react"
import { Layout } from "./components/Layout"
import { TeamSettingsContent } from "./modules/TeamSettings/TeamSettingsContent"
import { ClientListPage } from "./modules/Clients/components/ClientListPage"
import { ClientProfilePage } from "./modules/Clients/components/ClientProfilePage"
import { Client } from "./modules/Clients/types"
import { TransactionsPage } from "./modules/Transactions/components/TransactionsPage"
import { CollaboratorsSection } from "./modules/TeamSettings/CollaboratorsSection"
import { InboxPage } from "./modules/Inbox/InboxPage"
import { Settings } from "lucide-react"
import { Button } from "./components/ui/Button"

import { RoleProvider, useRole } from "./contexts/RoleContext"
import { FloatingRoleToggler } from "./components/RoleSwitcher"

import { TooltipProvider } from "./components/ui/Tooltip"

function AppContent({ activeTab, setActiveTab, selectedClient, setSelectedClient }: any) {
  const { isCollaborator } = useRole()

  const renderContent = () => {
    if (selectedClient) {
      return (
        <ClientProfilePage 
          key={selectedClient.id}
          client={selectedClient} 
          onBack={() => setSelectedClient(null)} 
        />
      )
    }

    // Protection for Team Settings
    if (isCollaborator && (activeTab === "Team settings" || activeTab === "Team")) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
            <div className="size-20 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
               <Settings className="size-10 text-slate-300" />
            </div>
            <h2 className="text-[20px] font-black text-slate-900 uppercase tracking-tighter mb-2 italic">Access Restricted</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              As a collaborator, you do not have permission to access the <strong>Team Settings</strong> module. 
              Please contact your Team Lead for assistance with member management.
            </p>
          </div>
        )
    }

    switch (activeTab) {
      case "Clients":
        return <ClientListPage />
      case "Documents":
        return <TransactionsPage />
      case "Team settings":
      case "Team":
        return <TeamSettingsContent />
      case "Inbox":
        return <InboxPage />
      case "Collaborators":
          return <div className="w-full h-full overflow-y-auto"><CollaboratorsSection /></div>
      case "Settings":
          return (
             <div className="w-full py-20 px-8">
                 <div className="max-w-4xl mx-auto bg-white border border-[#EFEFEF] rounded-[32px] p-12 shadow-sm">
                    <h2 className="text-[28px] font-black text-slate-900 mb-2">Personal Settings</h2>
                    <p className="text-slate-500 font-medium mb-10">Manage your password, notifications, and primary account details.</p>
                    
                    <div className="space-y-8">
                       <div className="grid grid-cols-2 gap-8 border-b border-slate-50 pb-8 hover:bg-slate-50/50 transition-colors p-4 rounded-xl cursor-not-allowed opacity-60">
                           <div>
                              <p className="text-[14px] font-black uppercase tracking-widest text-[#5A5FF2] mb-1">Display Name</p>
                              <p className="text-slate-900 font-bold">Vanessa Brown</p>
                           </div>
                           <div className="text-right">
                              <Button variant="ghost" className="text-[#5A5FF2] font-black underline italic">Edit</Button>
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8 border-b border-slate-50 pb-8 hover:bg-slate-50/50 transition-colors p-4 rounded-xl cursor-not-allowed opacity-60">
                           <div>
                              <p className="text-[14px] font-black uppercase tracking-widest text-[#5A5FF2] mb-1">Email Address</p>
                              <p className="text-slate-900 font-bold">vanessa.brown@radius.com</p>
                           </div>
                           <div className="text-right">
                              <Button variant="ghost" className="text-[#5A5FF2] font-black underline italic">Change</Button>
                           </div>
                       </div>
                    </div>
                 </div>
             </div>
          )
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-4">
            <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <span className="text-[24px]">🚧</span>
            </div>
            <p className="font-bold">{activeTab} module is under construction</p>
          </div>
        )
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderContent()}
      </div>
    </Layout>
  )
}

function App() {
  const [activeTab, setActiveTab] = React.useState("Clients")
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)

  // Navigation Logic
  const handleSidebarClick = (label: string) => {
    if (label === "Clients") {
      setActiveTab("Clients")
      setSelectedClient(null)
    } else if (label === "Team") {
      setActiveTab("Team settings")
      setSelectedClient(null)
    } else {
      setActiveTab(label)
    }
  }

  return (
    <RoleProvider>
      <TooltipProvider>
        <AppContent 
           activeTab={activeTab} 
           setActiveTab={handleSidebarClick} 
           selectedClient={selectedClient} 
           setSelectedClient={setSelectedClient} 
        />
        <FloatingRoleToggler />
      </TooltipProvider>
    </RoleProvider>
  )
}

export default App
