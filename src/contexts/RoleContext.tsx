import * as React from "react"

export type UserRole = 'TEAM_LEAD' | 'AGENT' | 'TC_VA' | 'LENDER' | 'VENDOR'
export type AssignmentLevel = 'CLIENT' | 'TRANSACTION'

export interface TeamContext {
  id: string
  name: string
  logo?: string
  primaryColor?: string
}

export interface AgentContext {
  id: string
  name: string
  avatar?: string
}

export interface TransactionContext {
  id: string
  address: string
  clientId: string
}

interface RoleContextType {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
  assignmentLevel: AssignmentLevel
  setAssignmentLevel: (level: AssignmentLevel) => void
  selectedTeam: TeamContext | null
  setSelectedTeam: (team: TeamContext | null) => void
  selectedAgent: AgentContext | null
  setSelectedAgent: (agent: AgentContext | null) => void
  selectedTransaction: TransactionContext | null
  setSelectedTransaction: (tx: TransactionContext | null) => void
  isCollaborator: boolean // Restricted collaborators (LENDER, VENDOR)
  hasFullAccess: boolean // Roles with full access (TEAM_LEAD, AGENT, TC_VA)
  canEdit: boolean
  canInvite: boolean
  canAssign: boolean
}

const RoleContext = React.createContext<RoleContextType | undefined>(undefined)

export const MOCK_TEAMS: TeamContext[] = [
  { id: 't1', name: 'Elite Realty Group', primaryColor: '#5A5FF2' },
  { id: 't2', name: 'Radius Premium', primaryColor: '#0F172A', logo: 'https://cdn.radiusagent.com/logo-white.svg' },
  { id: 't3', name: 'The Vanguard Team', primaryColor: '#10B981' }
]

export const MOCK_AGENTS: AgentContext[] = [
  { id: 'a1', name: 'Vanessa Brown', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop' },
  { id: 'a2', name: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop' }
]

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = React.useState<UserRole>('TEAM_LEAD')
  const [assignmentLevel, setAssignmentLevel] = React.useState<AssignmentLevel>('CLIENT')
  const [selectedTeam, setSelectedTeam] = React.useState<TeamContext | null>(MOCK_TEAMS[0])
  const [selectedAgent, setSelectedAgent] = React.useState<AgentContext | null>(null)
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionContext | null>(null)

  // Roles that are considered 'Collaborators' (external/assigned)
  const isCollaborator = ['TC_VA', 'LENDER', 'VENDOR'].includes(currentRole)
  
  // Per user logic: Team Lead, Agent, TC, and VA have 'all access'
  // Restricted roles: LENDER, VENDOR (Read-only on profile)
  const hasFullAccess = ['TEAM_LEAD', 'AGENT', 'TC_VA'].includes(currentRole)
  const canEdit = hasFullAccess;
  
  const canInvite = ['TEAM_LEAD'].includes(currentRole)
  const canAssign = ['TEAM_LEAD', 'AGENT'].includes(currentRole)

  return (
    <RoleContext.Provider value={{
      currentRole,
      setCurrentRole,
      assignmentLevel,
      setAssignmentLevel,
      selectedTeam,
      setSelectedTeam,
      selectedAgent,
      setSelectedAgent,
      selectedTransaction,
      setSelectedTransaction,
      isCollaborator,
      hasFullAccess,
      canEdit,
      canInvite,
      canAssign
    }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = React.useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
