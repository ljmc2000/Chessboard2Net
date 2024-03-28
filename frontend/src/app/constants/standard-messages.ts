import { ChatMessage } from 'models/chat-message';

export const COMMAND_ERROR_MESSAGE = {system_message: true, content: "bad command"} as ChatMessage;

export const HELP_MESSAGE = {system_message: true, content: `
type \\h(elp) to display this message.
type \\w(hisper) [player] [message] to send a private message.
`} as ChatMessage;

export const ON_JOIN_MESSAGE = {content: "Welcome to Chessboard2Net. Type \\h for a list of commands or say hello and see if someone challenges you to a chess game."} as ChatMessage;
