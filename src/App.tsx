import * as React from "react"
import { RoleProvider } from "./contexts/RoleContext"
import { RoleSwitcher } from "./components/RoleSwitcher"
import { Layout } from "./components/Layout"
import { TeamSettingsContent } from "./modules/TeamSettings/TeamSettingsContent"
import { ClientListPage } from "./modules/Clients/components/ClientListPage"
import { Client } from "./modules/Clients/types"
import { TransactionsPage } from "./modules/Transactions/components/TransactionsPage"

function AppContent() {
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
        <div key="client-profile">
          <ClientListPage onSelectClient={setSelectedClient} />
        </div>
      )
    }

    switch (activeTab) {
      case "Clients":
        return <ClientListPage onSelectClient={setSelectedClient} />
      case "Transactions":
        return <TransactionsPage />
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

function App() {
  return (
    <RoleProvider>
      <AppContent />
      <RoleSwitcher />
    </RoleProvider>
  )
}

export default App
