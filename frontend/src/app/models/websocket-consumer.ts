import { ChatMessage } from 'models/chat-message'

export interface WebsocketConsumer {
  onChatMessage(message: ChatMessage): void
  onCountOnline(online: number): void
  onDisconnect(): void
  onNoPlayer(player: string): void
  onReady(): void
  onSub(callback: string): void
  onUnSub(callback: string): void
}
