import { UserInfo } from './user-info'

export interface ChallengeMessage {
  game: string;
  sender: UserInfo;
  target: UserInfo;
}
