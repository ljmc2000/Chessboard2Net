import { ChatMessage } from 'models/chat-message'

export interface WebsocketConsumer {
  onChatMessage(message: ChatMessage): void
}
