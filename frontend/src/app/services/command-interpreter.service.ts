import { Injectable } from '@angular/core';

import { HELP_MESSAGE, SANTAX_ERROR_MESSAGE } from 'constants/standard-messages';
import { ChatMessage } from 'models/chat-message';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';

const ChallengePattern = /\\c(?:hallenge)? ([^ ]+) (chess|checkers)/i
const HelpPattern = /\\h(?:elp)?$/i
const OnlinePattern = /\\o(?:nline)?$/i
const WhisperPattern = /\\w(?:hisper)? ([^ ]+) (.+)/i

@Injectable({
  providedIn: 'root'
})
export class CommandInterpreterService {

  constructor(private ws: ChessWebsocketHandlerService) { }

  interpretCommand(command: string, log: ChatMessage[]): boolean {
    var match;
    if(match=ChallengePattern.exec(command)) {
      this.ws.challenge(match[1],match[2]);
      return false;
    }
    else if (match=HelpPattern.exec(command)) {
      log.push(HELP_MESSAGE);
      return false;
    }
    else if(match=OnlinePattern.exec(command)) {
      this.ws.countOnlinePlayers();
      return false;
    }
    else if(match=WhisperPattern.exec(command)) {
      this.ws.sendChatMessage(match[2], match[1]);
      return false;
    }
    else {
      log.push(SANTAX_ERROR_MESSAGE);
      return true;
    }
  }
}
