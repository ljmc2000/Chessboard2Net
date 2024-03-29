import { User } from 'models/user';

export interface ChatMessage {
  sender: User;
  target: User;
  content: string;
  secret_message: boolean;
  system_message: boolean;
}
