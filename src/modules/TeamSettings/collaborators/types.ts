export type CollaboratorType = "tc" | "lender" | "vendor" | "va";
export type Status = "invited" | "active" | "paused" | "removed";

export interface Assignments {
  clients: string[];
  transactions: string[]; // TC/VA only
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  type: CollaboratorType;
  status: Status;
  invitedDate: string;
  inviteExpiresAt: string | null;
  activatedDate: string | null;
  assignments: Assignments;
  paymentStatus: "pending" | "active" | "paused" | "failed";
  accessLevel?: 'Client level' | 'Transaction level';
}

export interface Client {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  title: string;
}
