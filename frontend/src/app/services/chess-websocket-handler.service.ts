import { Injectable } from '@angular/core';

import { Instruction as I, Scope } from 'shared/constants';
import { ChatMessage } from 'models/chat-message';
import { UserInfo } from 'models/user-info';
class WsPacketEvent extends Event {data: any};

@Injectable({
  providedIn: 'root'
})
export class ChessWebsocketHandlerService extends EventTarget {

  private _ws: WebSocket;
  public reconnectionTimeout?: number;

  constructor() {
    super();
    this.setupConnection();
  }

  public acceptChallenge(player: string) {
    this.jsend({instr: I.ACLNG, scope: Scope.DIRECT, target: player});
  }

  public challenge(player: string, game: string) {
    this.jsend({instr: I.CLNG, scope: Scope.DIRECT, target: player, game: game});
  }

  public countOnlinePlayers() {
    this.jsend({instr: I.OUCNT, scope: Scope.PRIVATE});
  }

  public move(move: string) {
    this.jsend({instr: I.MOVE, scope: Scope.GAME, move: move});
  }

  public rejectChallenge(player: string) {
    this.jsend({instr: I.XCLNG, scope: Scope.DIRECT, target: player});
  }

  public refreshSelfInfo() {
    this.jsend({instr: I.SINF, scope: Scope.PRIVATE});
  }

  public sendChatMessage(content: string) {
    this.jsend({instr: I.TELL, scope: Scope.UNIVERSE, content: content});
  }

  public sendInGameMessage(content: string) {
    this.jsend({instr: I.TELL, scope: Scope.GAME, content: content});
  }

  public sendWhisperMessage(content: string, target: string) {
    this.jsend({instr: I.TELL, scope: Scope.DIRECT, content: content, target: target});
  }

  public setupConnection() {
    this._ws=new WebSocket(`ws://${window.location.host}/api`);
    this._ws.onmessage = (msg)=>this.onMessage(msg);
    this._ws.onerror = (err)=>this.onError(err);
    this._ws.onclose = ()=>this.onClose();
  }

  public setPromotionTarget(target: string) {
    this.jsend({instr: I.PROM, scope: Scope.GAME, promotion_target: target})
  }

  public sinf() {
    this.jsend({instr: I.SINF, scope: Scope.PRIVATE});
  }

  public spectate(game_id: string) {
    this.jsend({instr: I.WATCH, scope: Scope.PRIVATE, game_id: game_id})
  }

  public surrender() {
    this.jsend({instr: I.SRNDR, scope: Scope.GAME});
  }

  public subscribeToPublicChat() {
    this.jsend({instr: I.SUB, callback: I.TELL, scope: Scope.PRIVATE});
  }

  public subscribeToSinf(reciever: {user: UserInfo}, callback: Function) {
    this.on(I.SINF, (user: UserInfo)=> {
      reciever.user=user;
      callback()
    })
  }

  public subscribeToUserEvents() {
    this.jsend({instr: I.SUB, callback: I.UENV, scope: Scope.PRIVATE});
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
    this.dispatchEvent(new Event('close'));
    var reconnectionTimeoutEnd=new Date().valueOf()+15000;
    var interval = setInterval(()=> {
      this.reconnectionTimeout=Math.floor((reconnectionTimeoutEnd-new Date().valueOf())/1000);
      if(this.reconnectionTimeout<0) {
        clearInterval(interval);
        delete this.reconnectionTimeout;
        this.setupConnection();
      }
    }
    ,500);
  }

  on(instr: string, callback: Function) {
    this.addEventListener(instr, (ev: any) => callback(ev.data));
  }

  jsend(data: any) {
    this._ws.send(JSON.stringify(data));
  }
}
