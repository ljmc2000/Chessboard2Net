import { Injectable } from '@angular/core';

import * as I from 'shared/instructions';
import * as S from 'shared/scope';
import { ChatMessage } from 'models/chat-message';
import { UserInfo } from 'models/user-info';
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
    console.log(data);
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
    console.log(data)
    this.send(JSON.stringify(data));
  }

  setupDefaultEventListeners() {
    this.on(I.IGME, (data: any)=>{
      if(!window.location.pathname.startsWith('/game'))
        window.location.pathname=`/game/${data.game_id}`;
    })
  }
}
