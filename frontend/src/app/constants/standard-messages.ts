import { ChallengeMessage } from 'models/challenge-message';
import { ChatMessage } from 'models/chat-message';

export function ACK_CHALLENGE_MESSAGE(challenge: ChallengeMessage): ChatMessage {
  return {system_message: true, content: `You challenged ${challenge.target.username} to ${challenge.game}`} as ChatMessage;
}

export function BUSY_MESSAGE(username: string): ChatMessage {
  return {system_message: true, content: `${username} is not available right now`} as ChatMessage;
}

export function BAD_MOVE_MESSAGE(move: string): ChatMessage {
  return {system_message: true, content: `Move ${move} is invalid` } as ChatMessage;
}

export function CHALLENGE_ACCEPT_MESSAGE(username: string): ChatMessage {
  return {system_message: true, content: `${username} has accepted your challenge, but actual games aren't implemented yet`} as ChatMessage;
}
export function CHALLENGE_MESSAGE(challenge: ChallengeMessage): string {
  return `${challenge.sender.username} would like to play ${challenge.game}`;
}
export function CHALLENGE_REJECTION_MESSAGE(username: string): ChatMessage {
  return {system_message: true, content: `${username} has rejected your challenge`} as ChatMessage;
}

export const CHAT_CONNECTING_MESSAGE = {content: "Connecting to chat…"} as ChatMessage;
export const CHAT_CONNECTED_MESSAGE = {content: "Connected to chat"} as ChatMessage;

export function CHECKMATE_MESSAGE(username: string): ChatMessage {
  return {system_message: true, content: `${username} wins`} as ChatMessage;
}

export const DISCONNECTION_MESSAGE = {system_message: true, content: "Disconnected from the server!"} as ChatMessage;

export const GENERAL_HELP_MESSAGE = {system_message: true, content: `
type \\h(elp) to display this message.
type \\o(nline) to see how many players are online.
type \\w(hisper) [player] [message] to send a private message.
`} as ChatMessage;

export const INGAME_HELP_MESSAGE = {system_message: true, content: `
  type \\h(elp) to display this message.
  type \\m(ove) [move in algerbraic notation] to perform a move
  type \\w(hisper) [player] [message] to send a private message, including to players outside this game.
  `} as ChatMessage;

export const NO_GAME_MESSAGE = "Could not find game. Maybe it's not ready. Maybe it's over";

export const ON_JOIN_GAME_MESSAGE = {content: "Type \\h for a list of commands"} as ChatMessage;

export const ON_JOIN_MESSAGE = {content: "Welcome to Chessboard2Net. Type \\h for a list of commands or say hello and see if someone challenges you to a chess game."} as ChatMessage;

export function ON_NO_PLAYER_MESSAGE(player: string): ChatMessage {
  return {system_message: true, content: `Player "${player}" does not exist or is not online`} as ChatMessage;
}

export function ONLINE_PLAYER_COUNT_MESSAGE(count: number): ChatMessage {
  return {system_message: true, content: `There are ${count} players online`} as ChatMessage;
}

export const PRIVATE_GAME_MESSAGE="One or more users have not consented to their games being observed";

export const SANTAX_ERROR_MESSAGE = {system_message: true, content: "Santax Error"} as ChatMessage;

export function SURRENDER_MESSAGE(username: string): ChatMessage {
  return {system_message: true, content: `${username} has surrendered`} as ChatMessage;
}

export const WAIT_YOUR_TURN_MESSAGE = {system_message: true, content: "Wait your turn"} as ChatMessage;
