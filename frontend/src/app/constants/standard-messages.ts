import { ChatMessage } from 'models/chat-message';

export const HELP_MESSAGE = {system_message: true, content: `
type \\h(elp) to display this message.
type \\o(nline) to see how many players are online.
type \\w(hisper) [player] [message] to send a private message.
`} as ChatMessage;

export const ON_JOIN_MESSAGE = {content: "Welcome to Chessboard2Net. Type \\h for a list of commands or say hello and see if someone challenges you to a chess game."} as ChatMessage;

export function ON_NO_PLAYER_MESSAGE(player: string): ChatMessage {
  return {system_message: true, content: `Player "${player}" does not exist or is not online`} as ChatMessage;
}

export function ONLINE_PLAYER_COUNT_MESSAGE(count: number): ChatMessage {
  return {system_message: true, content: `There are ${count} players online`} as ChatMessage;
}

export const SANTAX_ERROR_MESSAGE = {system_message: true, content: "Santax Error"} as ChatMessage;
