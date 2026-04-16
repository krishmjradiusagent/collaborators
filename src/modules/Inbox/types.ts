import { UserRole } from "../../contexts/RoleContext";

export interface InboxUser {
  id: string;
  name: string;
  avatar?: string;
  phoneNumber?: string;
  role?: UserRole;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participants: InboxUser[];
  lastMessage?: Message;
  unreadCount: number;
  type: 'chat' | 'message'; // chat = internal/team, message = client/sms
  clientGeneratedNumber?: string; // SMS number for client
}

export interface InboxState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  isLoading: boolean;
}
