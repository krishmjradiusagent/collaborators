import { InboxUser, Conversation, Message } from "./types";

export const MOCK_USERS: Record<string, InboxUser> = {
  'u1': {
    id: 'u1',
    name: 'Vanessa Brown',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    role: 'AGENT'
  },
  'u2': {
    id: 'u2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop',
    phoneNumber: '(555) 456-7890'
  },
  'u3': {
    id: 'u3',
    name: 'Emily Blunt',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop',
  },
  'mel': {
    id: 'mel',
    name: 'Mel',
    avatar: undefined, // Will use AI icon
  }
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participants: [MOCK_USERS['u1'], MOCK_USERS['u2']],
    type: 'message',
    unreadCount: 3,
    clientGeneratedNumber: '+1 (555) 123-4567',
    lastMessage: {
      id: 'm-last',
      senderId: 'u2',
      text: 'Can you send me the property...',
      timestamp: '12:25 PM',
      type: 'text'
    }
  },
  {
    id: 'c2',
    participants: [MOCK_USERS['u1'], MOCK_USERS['u3']],
    type: 'chat',
    unreadCount: 0,
    lastMessage: {
      id: 'm2-last',
      senderId: 'u1',
      text: 'Perfect! How about Saturday at 2 PM?',
      timestamp: '10:38 AM',
      type: 'text'
    }
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1',
      senderId: 'u2',
      text: 'Hi! I saw the listing for the property on Oak Street. Is it still available?',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: 'm2',
      senderId: 'u1',
      text: 'Yes, it is! Would you like to schedule a viewing?',
      timestamp: '10:35 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'm3',
      senderId: 'u2',
      text: 'That would be great! I\'m available this weekend.',
      timestamp: '10:36 AM',
      type: 'text'
    },
    {
      id: 'm4',
      senderId: 'u1',
      text: 'Perfect! How about Saturday at 2 PM?',
      timestamp: '10:38 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'm5',
      senderId: 'u2',
      text: 'Can you send me the property details?',
      timestamp: '12:25 PM',
      type: 'text'
    }
  ],
  'c2': [
    {
       id: 'm2-1',
       senderId: 'u3',
       text: 'Hi! I\'m really interested in the property at 6653 Tralee Village Dr.',
       timestamp: 'Thursday, November 7, 2024',
       type: 'text'
    },
    {
       id: 'm2-2',
       senderId: 'u1',
       text: 'Great! I\'d be happy to help you with that. The property is a beautiful 4-bedroom, 3-bath home with a spacious backyard.',
       timestamp: '10:35 AM',
       type: 'text'
    },
    {
       id: 'm2-3',
       senderId: 'u3',
       text: 'Thanks for sending over the documents!',
       timestamp: '10:36 AM',
       type: 'text'
    },
    {
       id: 'm2-4',
       senderId: 'u1',
       text: '',
       timestamp: '10:38 AM',
       type: 'file',
       fileName: 'Property_Listing_6653_Tralee.pdf',
       fileSize: '2.4 MB'
    }
  ]
};
