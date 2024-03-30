import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import * as I from 'shared/instructions';
import { ChatMessage } from 'models/chat-message';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { CommandInterpreterService } from 'services/command-interpreter.service';
import { WebsocketConsumer } from 'models/websocket-consumer';
import { CHAT_CONNECTING_MESSAGE, CHAT_CONNECTED_MESSAGE, DISCONNECTION_MESSAGE, ON_JOIN_MESSAGE, ON_NO_PLAYER_MESSAGE, ONLINE_PLAYER_COUNT_MESSAGE } from 'constants/standard-messages';

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
  chatLog: ChatMessage[] = [ON_JOIN_MESSAGE, CHAT_CONNECTING_MESSAGE];
  @ViewChild('chat_parent') chatParent: ElementRef;
  @ViewChild('chat') chat: ElementRef;

  constructor(private ws: ChessWebsocketHandlerService, private cli: CommandInterpreterService) {
    ws.subscribeToWS(this);
  }

  ngAfterViewInit() {
    var observer = new ResizeObserver((ev) => this.chatParent.nativeElement.scrollTop=this.chatParent.nativeElement.scrollHeight);
    observer.observe(this.chat.nativeElement)
  }

  onReady() {
    this.ws.subscribeToPublicChat();
  }

  onChatMessage(message: ChatMessage): void {
    this.chatLog.push(message);
  }

  onCountOnline(online :number) {
    this.chatLog.push(ONLINE_PLAYER_COUNT_MESSAGE(online));
  }

  onDisconnect() {
    this.chatLog.push(DISCONNECTION_MESSAGE);
  }

  onNoPlayer(player: string) {
    this.chatLog.push(ON_NO_PLAYER_MESSAGE(player));
  }

  sendChatMessage() {
    if(this.chatMessageContent.startsWith("\\")) {
      var problem = this.cli.interpretCommand(this.chatMessageContent, this.chatLog);
      if(!problem) this.chatMessageContent='';
    }
    else {
      this.ws.sendChatMessage(this.chatMessageContent);
      this.chatMessageContent='';
    }
  }

  onSub(callback: string) {
    switch(callback) {
      case I.TELL:
        this.chatLog.push(CHAT_CONNECTED_MESSAGE);
        break;
    }
  }

  onUnSub(callback: string) {
  }
}
