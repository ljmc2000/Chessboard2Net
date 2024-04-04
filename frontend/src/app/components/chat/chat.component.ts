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

import * as M from 'constants/standard-messages';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  chatMessageContent: string='';
  chatLog: ChatMessage[] = [M.ON_JOIN_MESSAGE, M.CHAT_CONNECTING_MESSAGE];
  @ViewChild('chat_parent') chatParent: ElementRef;
  @ViewChild('chat') chat: ElementRef;

  constructor(private ws: ChessWebsocketHandlerService, private cli: CommandInterpreterService) {
    ws.on(I.ACLNG, (data: any)=>this.chatLog.push(M.CHALLENGE_ACCEPT_MESSAGE(data.sender.username)));
    ws.on(I.BUSY, (data: any)=>this.chatLog.push(M.BUSY_MESSAGE(data.target.username)));
    ws.on(I.NOPLR, (data: any)=>this.chatLog.push(M.ON_NO_PLAYER_MESSAGE(data.target)));
    ws.on(I.READY, (data: any)=>this.ws.subscribeToPublicChat());
    ws.on(I.SUB, (data: any)=>this.onSub(data.callback));
    ws.on(I.TELL, (data: ChatMessage)=>this.chatLog.push(data));
    ws.on(I.OUCNT, (data: any)=>this.chatLog.push(M.ONLINE_PLAYER_COUNT_MESSAGE(data.count)));
    ws.on(I.XCLNG, (data: any)=>this.chatLog.push(M.CHALLENGE_REJECTION_MESSAGE(data.sender.username)));

    ws.addEventListener('close',()=>this.chatLog.push(M.DISCONNECTION_MESSAGE));
  }

  ngAfterViewInit() {
    var observer = new ResizeObserver((ev) => this.chatParent.nativeElement.scrollTop=this.chatParent.nativeElement.scrollHeight);
    observer.observe(this.chat.nativeElement)
  }

  onSub(callback: string) {
    switch(callback) {
      case I.TELL:
        this.chatLog.push(M.CHAT_CONNECTED_MESSAGE);
        break;
    }
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
}
