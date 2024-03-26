import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessWebsocketHandlerService } from './chess-websocket-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Chessboard2Net';

  constructor(private ws: ChessWebsocketHandlerService) {
  }
}
