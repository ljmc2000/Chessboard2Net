import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import * as I from 'shared/instructions';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  in_game: boolean=false;

  constructor(public ws: ChessWebsocketHandlerService) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, ()=>this.updateGamestate());
  }

  updateGamestate() {
    this.in_game=true;
  }
}
