import { Injectable } from '@angular/core';

import { Instructions as I, Scope as S } from 'shared/constants';
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
    this.jsend({instr: I.ACLNG, scope: S.DIRECT, target: player});
  }

  public challenge(player: string, game: string) {
    this.jsend({instr: I.CLNG, scope: S.DIRECT, target: player, game: game});
  }

  public countOnlinePlayers() {
    this.jsend({instr: I.OUCNT, scope: S.PRIVATE});
  }

  public rejectChallenge(player: string) {
    this.jsend({instr: I.XCLNG, scope: S.DIRECT, target: player});
  }

  public refreshSelfInfo() {
    this.jsend({instr: I.SINF, scope: S.PRIVATE});
  }

  public sendChatMessage(content: string) {
    this.jsend({instr: I.TELL, scope: S.UNIVERSE, content: content});
  }

  public sendWhisperMessage(content: string, target: string) {
    this.jsend({instr: I.TELL, scope: S.DIRECT, content: content, target: target});
  }

  public setupConnection() {
    this._ws=new WebSocket(`ws://${window.location.host}/api`);
    this._ws.onmessage = (msg)=>this.onMessage(msg);
    this._ws.onerror = (err)=>this.onError(err);
    this._ws.onclose = ()=>this.onClose();
  }

  public sinf() {
    this.jsend({instr: I.SINF, scope: S.PRIVATE});
  }

  public surrender() {
    this.jsend({instr: I.SRNDR, scope: S.GAME});
  }

  public subscribeToPublicChat() {
    this.jsend({instr: I.SUB, callback: I.TELL, scope: S.PRIVATE});
  }

  public subscribeToSinf(reciever: UserInfo, callback: Function) {
    this.on(I.SINF, (data: UserInfo)=> {
      reciever.user_id=data.user_id;
      reciever.username=data.username;
      reciever.unlocked_sets=data.unlocked_sets;
      reciever.profile_flags=data.profile_flags;
      reciever.prefered_set=data.prefered_set;
      reciever.favourite_colour=data.favourite_colour;
      reciever.current_gameid=data.current_gameid;
      reciever.current_gametype=data.current_gametype;
      reciever.logged_in=data.logged_in

      callback()
    })
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
