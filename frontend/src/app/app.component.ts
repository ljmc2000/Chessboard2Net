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
import { Instruction as I } from 'shared/constants';
import { ChallengeMessage } from 'models/challenge-message';
import { UserInfo } from 'models/user-info';
import { UserService } from 'services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Chessboard2Net';
  user: UserInfo={} as UserInfo;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,

    public ws: ChessWebsocketHandlerService,
    public userService: UserService
  ) {
    this.ws.on(I.AUTH,()=>this.onauth())
    this.ws.on(I.CLNG, (data: ChallengeMessage)=>this.onChallenge(data));
    this.ws.subscribeToSinf(this, ()=>this.onsinf())
    this.registerIcons();
  }

  onauth() {
    if(window.location.pathname!='/login')
      window.location.pathname='/login'
  }

  onChallenge(challenge: ChallengeMessage) {
    if(confirm(CHALLENGE_MESSAGE(challenge))) {
      this.ws.acceptChallenge(challenge.sender.username);
    }
    else {
      this.ws.rejectChallenge(challenge.sender.username);
    }
  }

  onsinf() {
    if(this.user.current_gameid && !window.location.pathname.startsWith('/game'))
      window.location.pathname=`/game`;
  }

  registerIcons() {
    this.iconRegistry.addSvgIcon('blank',this.sanitizer.bypassSecurityTrustResourceUrl('/assets/blank.svg'));
    for(var _set of ['doodles', 'goblins', 'teatime'])
    {
      for(var piece of ['king','queen','bishop','knight','rook','pawn']) {
        this.iconRegistry.addSvgIcon(`${_set}/${piece}`, this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/${_set}/${piece}.svg`))
        this.iconRegistry.addSvgIcon(`${_set}/${piece}_back`, this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/${_set}/${piece}_back.svg`))
      }
    }

    this.iconRegistry.addSvgIcon('locked', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/locked.svg'))
  }
}
