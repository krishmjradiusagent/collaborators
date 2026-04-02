import * as React from "react"
import { Layout } from "./components/Layout"
import { TeamSettingsContent } from "./modules/TeamSettings/TeamSettingsContent"
import { ClientListPage } from "./modules/Clients/components/ClientListPage"
import { ClientProfilePage } from "./modules/Clients/components/ClientProfilePage"
import { Client } from "./modules/Clients/types"

function App() {
  const [activeTab, setActiveTab] = React.useState("Team settings")
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

  const renderContent = () => {
    if (selectedClient) {
      return (
        <ClientProfilePage 
          client={selectedClient} 
          onBack={() => setSelectedClient(null)} 
        />
      )
    }

    switch (activeTab) {
      case "Clients":
        return <ClientListPage />
      case "Team settings":
      case "Team":
        return <TeamSettingsContent />
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
    <Layout activeTab={activeTab} setActiveTab={handleSidebarClick}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderContent()}
      </div>
    </Layout>
  )
}

export default App
