import { UserInfo } from 'models/user-info';

export interface ChatMessage {
  sender: UserInfo;
  target: UserInfo;
  content: string;
  secret_message: boolean;
  system_message: boolean;
}
