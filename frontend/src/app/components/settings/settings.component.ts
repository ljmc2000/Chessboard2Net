import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  self_visiblity: boolean;

  constructor(private ws: ChessWebsocketHandlerService) {
  }

  onChangePrivacy() {
  }
}
