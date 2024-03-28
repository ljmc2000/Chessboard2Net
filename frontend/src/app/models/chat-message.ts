import { User } from 'models/user';

export interface ChatMessage {
  sender: User;
  content: string;
  secret_message: boolean;
  system_message: boolean;
}
