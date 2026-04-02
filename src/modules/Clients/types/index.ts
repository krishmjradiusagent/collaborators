export type ClientType = 'Seller' | 'Buyer' | 'Landlord' | 'Tenant' | 'Referrals'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  types: ClientType[]
  score: number
  createdDate: string
  updatedDate: string
  status: 'active' | 'archived'
  tags: string[]
  address: string
  addedOn: string
  source: string
}

export type CollaboratorRole = 'Title Coordinator' | 'VA' | 'Lender' | 'Vendor'

export interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: CollaboratorRole
  type: 'tc' | 'lender' | 'vendor' | 'va'
  status: 'active' | 'invited'
  expiryDate?: string
}

export interface ClientAssignment {
  id: string
  clientId: string
  collaboratorId: string
  assignmentType: 'client' | 'transaction'
  transactionId?: string
  assignedAt: string
}
export interface Transaction {
  id: string
  clientId: string
  address: string
  status: 'Pre-approved' | 'Listing Prepped' | 'Active' | 'Under Contract' | 'Closed'
  price?: number
}
