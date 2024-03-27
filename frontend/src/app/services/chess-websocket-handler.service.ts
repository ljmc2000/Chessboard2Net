import { Injectable } from '@angular/core';
import {Router} from "@angular/router"

import { ChatMessage } from 'models/chat-message'
import * as I from 'shared/instructions';
import { WebsocketConsumer } from 'models/websocket-consumer';

@Injectable({
  providedIn: 'root'
})
export class ChessWebsocketHandlerService extends WebSocket{
  consumer: WebsocketConsumer

  constructor(private router: Router) {
    super(`ws://${window.location.host}/api`)
    this.onmessage=this.onMessage;
    this.onerror=this.onError;
    this.onclose=this.onClose;
  }

  public subscribeToWS(consumer: WebsocketConsumer) {
    this.consumer=consumer;
  }

  onMessage(message: MessageEvent) {
    var data = JSON.parse(message.data)
    switch(data.instr) {
      case I.AUTH:
        this.router.navigate(['/login']);
        break;
      case I.TELL:
      case I.TELL_ALL:
        this.consumer.onChatMessage(data as ChatMessage);
        break;
      default:
        console.log(data.instr);
    }
  }

  onError(err: Event) {
    console.error(err);
  }

  onClose() {
  }
}
