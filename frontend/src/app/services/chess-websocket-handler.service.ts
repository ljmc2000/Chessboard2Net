import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import * as I from 'shared/instructions';
import { ChatMessage } from 'models/chat-message';
class WsPacketEvent extends Event {data: any};

@Injectable({
  providedIn: 'root'
})
export class ChessWebsocketHandlerService extends WebSocket {

  constructor(private router: Router) {
    super(`ws://${window.location.host}/api`)
    this.onmessage=this.onMessage;
    this.onerror=this.onError;
    this.onclose=this.onClose;
    this.setupDefaultEventListeners();
  }

  public sendChatMessage(content: string, target?: string) {
    this.jsend({instr: I.TELL, content: content, target: target});
  }

  public countOnlinePlayers() {
    this.jsend({instr: I.OUCNT, target: 0});
  }

  public subscribeToPublicChat() {
    this.jsend({instr: I.SUB, callback: I.TELL, target: 0});
  }

  public on(instr: string, callback: Function) {
    this.addEventListener(instr, (ev: any) => callback(ev.data));
  }

  onMessage(message: MessageEvent) {
    var data = JSON.parse(message.data);
    var ev = new WsPacketEvent(data.instr);
    ev.data=data;
    this.dispatchEvent(ev);
  }

  onError(err: Event) {
    console.error(err);
  }

  onClose() {
  }

  jsend(data: any) {
    this.send(JSON.stringify(data));
  }

  setupDefaultEventListeners() {
    this.addEventListener(I.AUTH,()=>this.router.navigate(['/login']));
  }
}
