import { Component } from '@angular/core';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private ws: ChessWebsocketHandlerService) {
  }
}
