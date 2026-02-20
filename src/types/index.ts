export type UserStatus = 'online' | 'away' | 'busy' | 'invisible';

export interface User {
  id: string;
  uq_number: number;
  username: string;
  avatar_url?: string;
  bio?: string;
  tags: string[];
  status: UserStatus;
  last_seen: string;
  created_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  nickname?: string;
  created_at: string;
  contact_user?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  room_id?: string;
  content: string;
  translated_content?: string;
  created_at: string;
  read_at?: string;
  sender?: User;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  created_by: string;
  created_at: string;
}

export interface RoomMember {
  room_id: string;
  user_id: string;
  joined_at: string;
}
