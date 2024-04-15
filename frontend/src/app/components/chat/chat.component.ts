import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Instruction as I, EndState } from 'shared/constants';
import { ChatMessage } from 'models/chat-message';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { CommandInterpreter } from 'models/command-interpreter.service';
import { GameOverMessage } from 'models/game-over-message';
import { GeneralCommandInterpreter } from 'services/general-command-interpreter.service';
import { IngameCommandInterpreter } from 'services/ingame-command-interpreter.service';

import * as M from 'constants/standard-messages';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  chatMessageContent: string='';
  chatLog: ChatMessage[] = [];
  @ViewChild('chat_parent') chatParent: ElementRef;
  @ViewChild('chat') chat: ElementRef;

  @Input() public private_context: boolean=false;
  cli: CommandInterpreter;
  sendMessage: Function;

  constructor(private ws: ChessWebsocketHandlerService) {
    ws.on(I.ACLNG, (data: any)=>this.chatLog.push(M.CHALLENGE_ACCEPT_MESSAGE(data.sender.username)));
    ws.on(I.BADMV, (data: any)=> this.chatLog.push(M.BAD_MOVE_MESSAGE(data.move)));
    ws.on(I.BUSY, (data: any)=>this.chatLog.push(M.BUSY_MESSAGE(data.target.username)));
    ws.on(I.GOVER, (data: GameOverMessage)=>this.onGameOver(data));
    ws.on(I.NOPLR, (data: any)=>this.chatLog.push(M.ON_NO_PLAYER_MESSAGE(data.target)));
    ws.on(I.READY, (data: any)=>this.subscribeToChat());
    ws.on(I.SUB, (data: any)=>this.onSub(data.callback));
    ws.on(I.TELL, (data: ChatMessage)=>this.chatLog.push(data));
    ws.on(I.OUCNT, (data: any)=>this.chatLog.push(M.ONLINE_PLAYER_COUNT_MESSAGE(data.count)));
    ws.on(I.WAIT, (data: any)=> this.chatLog.push(M.WAIT_YOUR_TURN_MESSAGE));
    ws.on(I.XCLNG, (data: any)=>this.chatLog.push(M.CHALLENGE_REJECTION_MESSAGE(data.sender.username)));

    ws.addEventListener('close',()=>this.chatLog.push(M.DISCONNECTION_MESSAGE));
  }

  ngAfterViewInit() {
    var observer = new ResizeObserver((ev) => this.chatParent.nativeElement.scrollTop=this.chatParent.nativeElement.scrollHeight);
    observer.observe(this.chat.nativeElement)

    if(this.private_context) {
      this.sendMessage=()=>this.ws.sendInGameMessage(this.chatMessageContent);
      this.chatLog.push(M.ON_JOIN_GAME_MESSAGE, M.CHAT_CONNECTING_MESSAGE);
      this.cli=new IngameCommandInterpreter(this.ws);
    }
    else {
      this.sendMessage=()=>this.ws.sendChatMessage(this.chatMessageContent);
      this.chatLog.push(M.ON_JOIN_MESSAGE, M.CHAT_CONNECTING_MESSAGE);
      this.cli=new GeneralCommandInterpreter(this.ws);
    }
  }

  onGameOver(message: GameOverMessage) {
    switch(message.reason) {
      case EndState.CHECKMATE:
        this.chatLog.push(M.CHECKMATE_MESSAGE(message.player.username));
        break;
      case EndState.SURRENDER:
        this.chatLog.push(M.SURRENDER_MESSAGE(message.player.username));
    }
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
      this.sendMessage();
      this.chatMessageContent='';
    }
  }

  subscribeToChat() {
    if(!this.private_context) {
      this.ws.subscribeToPublicChat()
    }
  }
}
