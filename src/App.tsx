import { Layout } from "./components/Layout"
import { TeamSettingsContent } from "./modules/TeamSettings/TeamSettingsContent"
import { Toaster } from "sonner"

function App() {
  return (
    <Layout activeTab="Team settings">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TeamSettingsContent />
      </div>
      <Toaster position="bottom-right" richColors />
    </Layout>
  )
}

export default App
