import { Injectable } from '@angular/core';

import * as I from 'shared/instructions';
import { ChatMessage } from 'models/chat-message';
class WsPacketEvent extends Event {data: any};

@Injectable({
  providedIn: 'root'
})
export class ChessWebsocketHandlerService extends WebSocket {

  constructor() {
    super(`ws://${window.location.host}/api`)
    this.onmessage=this.onMessage;
    this.onerror=this.onError;
    this.onclose=this.onClose;
    this.setupDefaultEventListeners();
  }

  public acceptChallenge(player: string) {
    this.jsend({instr: I.ACLNG, target: player});
  }

  public challenge(player: string, game: string) {
    this.jsend({instr: I.CLNG, target: player, game: game});
  }

  public countOnlinePlayers() {
    this.jsend({instr: I.OUCNT, target: 0});
  }

  public rejectChallenge(player: string) {
    this.jsend({instr: I.XCLNG, target: player});
  }

  public sendChatMessage(content: string, target?: string) {
    this.jsend({instr: I.TELL, content: content, target: target});
  }

  public surrender() {
    this.jsend({instr: I.SRNDR, target:0});
  }

  public subscribeToPublicChat() {
    this.jsend({instr: I.SUB, callback: I.TELL, target: 0});
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

  on(instr: string, callback: Function) {
    this.addEventListener(instr, (ev: any) => callback(ev.data));
  }

  jsend(data: any) {
    this.send(JSON.stringify(data));
  }

  setupDefaultEventListeners() {
    this.on(I.IGME, (data: any)=>{
      if(!window.location.pathname.startsWith('/game'))
        window.location.pathname=`/game/${data.game_id}`;
    })
  }
}
