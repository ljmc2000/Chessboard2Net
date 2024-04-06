import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import * as I from 'shared/instructions';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  constructor(public ws: ChessWebsocketHandlerService) {
  }
}
