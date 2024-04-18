import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ChatComponent } from 'components/chat/chat.component';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { Instruction as I, UserEvent } from 'shared/constants';
import { PieceColourService } from 'services/piece-colour.service';
import { UserInfo } from 'models/user-info';
import { parse_colour, set_for } from 'utils';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ CommonModule, MatButtonModule, MatIconModule, ChatComponent ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  challenge_username: string;
  online_users: Map<string,UserInfo>=new Map();
  self: UserInfo={} as UserInfo;

  constructor(
    public ws: ChessWebsocketHandlerService,
    private colourService: PieceColourService,
    private dialog: MatDialog,
  ) {
    ws.on(I.SINF, (user: UserInfo)=>this.self=user);
    ws.on(I.READY, (data: any)=>this.ws.subscribeToUserEvents());
    ws.on(I.UENV,(message: any)=>this.onUserEvent(message.ev, message.sender));
  }

  challenge(username: string) {
    this.challenge_username=username;
    const dialogRef = this.dialog.open(ChallengeDialog, {
      data: {username: this.challenge_username}
    });

    dialogRef.afterClosed().subscribe(game => {
      this.ws.challenge(username, game);
    });
  }

  onSinf(user: UserInfo) {
    this.self=user;
    this.online_users.delete(user.user_id);
  }

  onUserEvent(ev: string, user: UserInfo) {
    if(user.user_id==this.self.user_id) {
    }
    else if(ev==UserEvent.DCONN) {
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

@Component({
  selector: 'challenge-dialog',
  standalone: true,
  imports: [ CommonModule, MatButtonModule, MatDialogModule ],
  templateUrl: './lobby-challenge-dialog.html',
  styleUrl: './lobby.component.css'
})
class ChallengeDialog {
  constructor(
    public dialogRef: MatDialogRef<ChallengeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ChallengeData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

interface ChallengeData {
  username: string;
}
