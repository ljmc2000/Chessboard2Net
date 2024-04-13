import { ChatMessage } from 'models/chat-message';

export const ChallengePattern = /\\c(?:hallenge)? ([^ ]+) (chess|checkers)/i
export const MovePattern = /\\m(?:ove)? ((?:[A-H]\d){2,})$/i
export const HelpPattern = /\\h(?:elp)?$/i
export const OnlinePattern = /\\o(?:nline)?$/i
export const WhisperPattern = /\\w(?:hisper)? ([^ ]+) (.+)/i

export interface CommandInterpreter {
  interpretCommand(command: string, log: ChatMessage[]): boolean;
}
