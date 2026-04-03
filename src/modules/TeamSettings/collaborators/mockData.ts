import { Collaborator, Client, Transaction } from "./types";

export const MOCK_CLIENTS: Client[] = [
  { id: "client-1", name: "John Doe" },
  { id: "client-2", name: "Jane Smith" },
  { id: "client-3", name: "Robert Wilson" },
  { id: "client-4", name: "Maria Garcia" },
  { id: "client-5", name: "David Miller" },
  { id: "client-6", name: "Sarah Taylor" },
  { id: "client-7", name: "James Anderson" },
  { id: "client-8", name: "Emily Brown" },
  { id: "client-9", name: "Michael Thomas" },
  { id: "client-10", name: "Linda Moore" }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "txn-1", clientId: "client-1", title: "Home Purchase - 123 Oak St" },
  { id: "txn-2", clientId: "client-2", title: "Refinance - 456 Maple Ave" },
  { id: "txn-3", clientId: "client-3", title: "Condo Sale - 789 Pine Ln" },
  { id: "txn-4", clientId: "client-4", title: "Title Transfer - 101 Cedar Rd" },
  { id: "txn-5", clientId: "client-5", title: "Mortgage Closing - 202 Elm St" }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: "collab-1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    type: "tc",
    status: "active",
    invitedDate: "2025-03-15",
    inviteExpiresAt: null,
    activatedDate: "2025-03-17",
    assignments: {
      clients: ["client-1", "client-5", "client-12"],
      transactions: ["txn-1", "txn-3", "txn-7", "txn-9"]
    },
    paymentStatus: "active",
    accessLevel: "Client level"
  },
  {
    id: "collab-2",
    name: "Marcus Lee",
    email: "marcus@company.com",
    type: "lender",
    status: "invited",
    invitedDate: "2025-04-01",
    inviteExpiresAt: null,
    activatedDate: null,
    assignments: {
      clients: [],
      transactions: []
    },
    paymentStatus: "pending",
    accessLevel: "Transaction level"
  },
  {
    id: "collab-3",
    name: "Priya Patel",
    email: "priya@company.com",
    type: "vendor",
    status: "active",
    invitedDate: "2025-02-01",
    inviteExpiresAt: null,
    activatedDate: "2025-02-03",
    assignments: {
      clients: ["client-2", "client-6"],
      transactions: []
    },
    paymentStatus: "active",
    accessLevel: "Client level"
  },
  {
    id: "collab-4",
    name: "Alex Rodriguez",
    email: "alex@company.com",
    type: "va",
    status: "active",
    invitedDate: "2025-01-15",
    inviteExpiresAt: null,
    activatedDate: "2025-01-17",
    assignments: {
      clients: ["client-3", "client-8", "client-14"],
      transactions: ["txn-2", "txn-5", "txn-11", "txn-18"]
    },
    paymentStatus: "active",
    accessLevel: "Client level"
  }
];
