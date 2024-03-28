import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { CommandInterpreterService } from 'services/command-interpreter.service';
import { WebsocketConsumer } from 'models/websocket-consumer';
import { ChatMessage } from 'models/chat-message'
import { ON_JOIN_MESSAGE } from 'constants/standard-messages';

const WhisperPattern = /\/w(?:hisper)? ([^ ]+) (.+)/

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements WebsocketConsumer {
  chatMessageContent: string='';
  chatLog: ChatMessage[] = [ON_JOIN_MESSAGE];

  constructor(private ws: ChessWebsocketHandlerService, private cli: CommandInterpreterService) {
    ws.subscribeToWS(this);
  }

  onChatMessage(message: ChatMessage) {
    this.chatLog.push(message);
  }

  sendChatMessage() {
    if(this.chatMessageContent.startsWith("\\")) {
      var msg = this.cli.interpretCommand(this.chatMessageContent);
      if(msg) this.chatLog.push(msg)
    }
    else {
      this.ws.sendChatMessage(this.chatMessageContent);
    }
    this.chatMessageContent='';
  }
}
