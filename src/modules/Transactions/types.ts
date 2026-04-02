export type TransactionStatus = 'Active' | 'Pending' | 'Closed' | 'Cancelled' | 'Referral';

export interface Collaborator {
  id: string;
  name: string;
  role: 'T.C.' | 'Lender' | 'Co-Agent' | 'Assistant' | string;
  email?: string;
  avatar?: string;
  status?: 'active' | 'invited' | 'pending';
  invitationExpiry?: string;
}

export interface Transaction {
  id: string;
  address: string;
  addressLine2?: string;
  clientType: 'Buyer' | 'Seller' | 'Landlord' | 'Tenant' | 'Referral';
  clientName: string;
  subClientName?: string;
  purchasePrice: number;
  status: string;
  agentName: string;
  acceptanceDate?: string;
  closeOfEscrow?: string;
  lastUpdated: string;
  collaborators: Collaborator[];
}
