import { Layout } from "./components/Layout"
import { TeamSettingsContent } from "./modules/TeamSettings/TeamSettingsContent"
import { AgentGoalsTable } from "./modules/GoalSetting/AgentGoalsTable"
import * as React from "react"

function App() {
  const [activeTab, setActiveTab] = React.useState("Team settings")

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === "Team settings" && <TeamSettingsContent />}
        {activeTab === "Goals" && <AgentGoalsTable role="teamLeadView" />}
      </div>
    </Layout>
  )
}

export default App
