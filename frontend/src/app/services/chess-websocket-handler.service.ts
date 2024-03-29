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

  public sendChatMessage(content: string, target?: string) {
    this.send(JSON.stringify({instr: I.TELL, content: content, target: target}))
  }

  public countOnlinePlayers() {
    this.send(JSON.stringify({instr: I.OUCNT, target: 0}));
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
      case I.OUCNT:
        this.consumer.onCountOnline(data.count);
        break;
      case I.NOPLR:
        this.consumer.onNoPlayer(data.target);
        break;
      case I.TELL:
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
    setTimeout(()=>location.reload(), 5000)
  }
}
