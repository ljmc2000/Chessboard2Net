import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { Instruction as I, UserEvent } from 'shared/constants';
import { UserInfo } from 'models/user-info';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  online_users: Map<string,UserInfo>=new Map();

  constructor(public ws: ChessWebsocketHandlerService) {
    ws.on(I.READY, (data: any)=>this.ws.subscribeToUserEvents());
    ws.on(I.UENV,(message: any)=>this.onUserEvent(message.ev, message.sender));
  }

  onUserEvent(ev: string, user: UserInfo) {
    switch(ev) {
      case UserEvent.CONN:
        this.online_users.set(user.user_id, user);
        break
      case UserEvent.DCONN:
        this.online_users.delete(user.user_id);
        break
    }
  }
}
