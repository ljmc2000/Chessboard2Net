import { Injectable } from '@angular/core';

import { COMMAND_ERROR_MESSAGE, HELP_MESSAGE } from 'constants/standard-messages';
import { ChatMessage } from 'models/chat-message';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';

const HelpPattern = /\\h(?:elp)?/
const WhisperPattern = /\\w(?:hisper)? ([^ ]+) (.+)/

@Injectable({
  providedIn: 'root'
})
export class CommandInterpreterService {

  constructor(private ws: ChessWebsocketHandlerService) { }

  interpretCommand(command: string): ChatMessage | null {
    var match;
    if (match=HelpPattern.exec(command)) {
      return HELP_MESSAGE;
    }
    else if(match=WhisperPattern.exec(command)) {
      this.ws.sendChatMessage(match[2], match[1]);
      return null;
    }
    else {
      return COMMAND_ERROR_MESSAGE;
    }
  }
}
