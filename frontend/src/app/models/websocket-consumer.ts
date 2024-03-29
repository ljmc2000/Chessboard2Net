import { ChatMessage } from 'models/chat-message'

export interface WebsocketConsumer {
  onChatMessage(message: ChatMessage): void
  onCountOnline(online: number): void
  onNoPlayer(player: string): void
}
