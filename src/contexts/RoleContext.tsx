import * as React from "react"
import { toast } from "sonner"

export type UserRole = 'Team Lead' | 'Agent' | 'TC/VA' | 'Lender' | 'Vendor'

export interface Team {
  id: string
  name: string
  logo: string
  primaryColor: string
  accentColor: string
}

export interface ContextItem {
  id: string
  name: string
  type: 'team' | 'agent' | 'transaction' | 'client'
  teamId?: string
}

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  activeContext: ContextItem | null
  setActiveContext: (context: ContextItem | null) => void
  availableContexts: ContextItem[]
  activeTeam: Team | null
}

const TEAMS: Team[] = [
  {
    id: "radius-main",
    name: "Radius Agent",
    logo: "RA",
    primaryColor: "#5A5FF2",
    accentColor: "#EEF2FF"
  },
  {
    id: "luxury-estates",
    name: "Luxury Estates Group",
    logo: "LE",
    primaryColor: "#171717",
    accentColor: "#F5F5F5"
  },
  {
    id: "skyline-realty",
    name: "Skyline Realty",
    logo: "SR",
    primaryColor: "#0EA5E9",
    accentColor: "#F0F9FF"
  }
]

const MOCK_CONTEXTS: ContextItem[] = [
  { id: "radius-main", name: "Radius Agent", type: "team" },
  { id: "luxury-estates", name: "Luxury Estates Group", type: "team" },
  { id: "skyline-realty", name: "Skyline Realty", type: "team" },
  { id: "agent-1", name: "Sarah Chen", type: "agent", teamId: "radius-main" },
  { id: "agent-2", name: "Michael Ross", type: "agent", teamId: "luxury-estates" },
  { id: "tx-1", name: "123 Mission St", type: "transaction", teamId: "radius-main" },
  { id: "tx-2", name: "456 Castro Ave", type: "transaction", teamId: "luxury-estates" }
]

const RoleContext = React.createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<UserRole>('Team Lead')
  const [activeContext, setActiveContextState] = React.useState<ContextItem | null>(MOCK_CONTEXTS[0])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    toast.success(`Role Switched`, {
        description: `Now viewing as ${newRole} for ${activeContext?.name || 'Global Context'}.`,
        className: "bg-[#5A5FF2] text-white border-none rounded-2xl",
    })
  }

  const setActiveContext = (context: ContextItem | null) => {
    setActiveContextState(context)
    if (context) {
      toast.success(`Context Switched`, {
        description: `Now viewing ${context.type}: ${context.name}.`,
        className: "bg-[#5A5FF2] text-white border-none rounded-2xl",
      })
    }
  }

  const activeTeam = React.useMemo(() => {
    if (!activeContext) return TEAMS[0]
    const teamId = activeContext.type === 'team' ? activeContext.id : activeContext.teamId
    return TEAMS.find(t => t.id === teamId) || TEAMS[0]
  }, [activeContext])

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      activeContext, 
      setActiveContext, 
      availableContexts: MOCK_CONTEXTS,
      activeTeam
    }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = React.useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
