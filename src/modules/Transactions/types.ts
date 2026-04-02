export type TransactionStatus = 'Active' | 'Pending' | 'Closed' | 'Cancelled' | 'Referral';

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface Transaction {
  id: string;
  address: string;
  clientType: 'Buyer' | 'Seller' | 'Landlord' | 'Tenant' | 'Referral';
  clientName: string;
  subClientName?: string;
  purchasePrice: number;
  status: string;
  agentName: string;
  acceptanceDate?: string;
  lastUpdated: string;
  closeOfEscrow?: string;
  collaborators: Collaborator[];
}
