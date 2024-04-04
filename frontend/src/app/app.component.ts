import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { CHALLENGE_MESSAGE } from 'constants/standard-messages';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import * as I from 'shared/instructions';
import { UserInfo } from 'models/user-info';
import { UserService } from 'services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements UserInfo {
  title = 'Chessboard2Net';
  public user_id: string;
  public username: string;
  public current_gameid: string;
  public logged_in: boolean;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,

    public ws: ChessWebsocketHandlerService,
    public userService: UserService
  ) {
    this.ws.on(I.AUTH,()=>this.onauth())
    this.ws.on(I.CLNG, (data: any)=>this.onChallenge(data));
    this.ws.subscribeToSinf(this,()=>this.onsinf())
    this.registerIcons();
  }

  onauth() {
    if(window.location.pathname!='/login')
      window.location.pathname='/login'
  }

  onChallenge(data: any) {
    if(confirm(CHALLENGE_MESSAGE(data.sender.username, data.game))) {
      this.ws.acceptChallenge(data.sender.username);
    }
    else {
      this.ws.rejectChallenge(data.sender.username);
    }
  }

  onsinf() {
    if(this.current_gameid && !window.location.pathname.startsWith('/game'))
      window.location.pathname=`/game/${this.current_gameid}`;
  }

  registerIcons() {
    this.iconRegistry.addSvgIcon('favicon', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/doodles/pawn.svg'));
  }
}
