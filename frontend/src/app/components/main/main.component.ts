import { Component } from '@angular/core';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { WebsocketConsumer } from 'models/websocket-consumer';
import { ChatMessage } from 'models/chat-message'

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements WebsocketConsumer {
  constructor(private ws: ChessWebsocketHandlerService) {
    ws.subscribeToWS(this);
  }

  onChatMessage(message: ChatMessage) {
    alert(`${message.sender.username} says ${message.content}`);
  }
}
