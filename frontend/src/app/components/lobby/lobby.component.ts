import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { Instruction as I, UserEvent } from 'shared/constants';
import { PieceColourService } from 'services/piece-colour.service';
import { UserInfo } from 'models/user-info';
import { parse_colour, set_for } from 'utils';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ CommonModule, MatIconModule ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  online_users: Map<string,UserInfo>=new Map();

  constructor(
    private ws: ChessWebsocketHandlerService,
    private colourService: PieceColourService,
  ) {
    ws.on(I.READY, (data: any)=>this.ws.subscribeToUserEvents());
    ws.on(I.UENV,(message: any)=>this.onUserEvent(message.ev, message.sender));
  }

  onUserEvent(ev: string, user: UserInfo) {
    if(ev==UserEvent.DCONN) {
      this.online_users.delete(user.user_id);
    }
    else {
      this.online_users.set(user.user_id, user);
      this.colourService.setColour(user.favourite_colour.toString(16), 'custom_colour', parse_colour(user.favourite_colour));
    }
  }

  iconFor(set_id: number): string {
    return set_for(set_id)+"/pawn";
  }
}
