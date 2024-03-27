import { User } from 'models/user';

export interface ChatMessage {
  sender: User;
  content: string;
  global: boolean;
}
