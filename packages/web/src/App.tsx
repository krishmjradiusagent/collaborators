import * as React from "react"
import { Layout } from "./components/Layout"
import { TeamSettingsContent } from "./modules/TeamSettings/TeamSettingsContent"
import { GoalSettingSection } from "./modules/GoalSetting/GoalSettingSection"
import { Toaster } from "sonner"

function App() {
  return (
    <Layout activeTab="Team settings">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TeamSettingsContent>
          <div className="py-4">
             <GoalSettingSection />
          </div>
        </TeamSettingsContent>
      </div>
      <Toaster position="bottom-right" richColors />
    </Layout>
  )
}

export default App
