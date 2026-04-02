import { Client, Collaborator } from "./types"

export const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Violet Cole",
    email: "violet.cole@email.com",
    phone: "(555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
    types: ["Buyer", "Seller", "Landlord", "Tenant"],
    score: 9.5,
    createdDate: "Jun 12, 2024",
    updatedDate: "Jun 12, 2024",
    status: "active",
    tags: ["New client", "High priority", "Top priority clients", "FSBO"],
    address: "123 missions street, 3543 bouleverad ave, 4th cross, Palo alto, California, 54323",
    addedOn: "JUN 3 2024",
    source: "Radius Marketplace",
    mortgage_status: "Approved"
  },
  {
    id: "2",
    name: "Steve Owens",
    email: "steve.owens@email.com",
    phone: "(555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
    types: ["Seller"],
    score: 8.2,
    createdDate: "Jun 22, 2024",
    updatedDate: "Jun 22, 2024",
    status: "active",
    tags: ["New client", "High priority"],
    address: "456 Oak Lane, San Francisco, CA 94102",
    addedOn: "JUN 20 2024",
    source: "Referral",
    mortgage_status: "Pre-Approved"
  }
]

export const GLOBAL_COLLABORATOR_POOL: Collaborator[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    email: "sarah.johnson@tc.com",
    role: "Title Coordinator",
    type: "tc",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
    status: "active"
  },
  {
    id: "c2",
    name: "Robert Martinez",
    email: "robert.martinez@lender.com",
    role: "Lender",
    type: "lender",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
    status: "active"
  },
  {
    id: "c3",
    name: "Emily Davis",
    email: "emily.davis@va.com",
    role: "VA",
    type: "va",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
    status: "active"
  },
  {
    id: "c4",
    name: "Michael Chen",
    email: "michael.chen@vendor.com",
    role: "Vendor",
    type: "vendor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop",
    status: "invited",
    expiryDate: "7 days"
  }
]

export const MOCK_ASSIGNMENTS: any[] = [
  {
    id: "a1",
    clientId: "1",
    collaboratorId: "c1",
    assignmentType: "client",
    assignedAt: "2024-06-03"
  },
  {
    id: "a2",
    clientId: "1",
    collaboratorId: "c2",
    assignmentType: "client",
    assignedAt: "2024-06-04"
  }
]

export const MOCK_TRANSACTIONS: any[] = [
  {
    id: "t1",
    clientId: "1",
    address: "123 Mission Street, Apt 4B",
    status: "Under Contract",
    price: 1250000,
    agentName: "Any Williams",
    collaborators: [
      { id: "c1", name: "Sarah Miller", role: "T.C." },
      { id: "c2", name: "Jessica Taylor", role: "Lender" }
    ]
  },
  {
    id: "t2",
    clientId: "1",
    address: "456 Castro Avenue",
    status: "Listing Prepped",
    price: 980000,
    agentName: "Any Williams",
    collaborators: [
      { id: "c1", name: "Sarah Miller", role: "T.C." }
    ]
  },
  {
    id: "t3",
    clientId: "2",
    address: "789 Pine Lane",
    status: "Active",
    price: 3200000,
    agentName: "Any Williams",
    collaborators: []
  }
]
