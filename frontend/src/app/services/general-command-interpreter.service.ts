import { GENERAL_HELP_MESSAGE, SANTAX_ERROR_MESSAGE } from 'constants/standard-messages';
import { ChatMessage } from 'models/chat-message';
import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import * as CLI from 'models/command-interpreter.service';

export class GeneralCommandInterpreter implements CLI.CommandInterpreter {

  constructor(private ws: ChessWebsocketHandlerService) { }

  interpretCommand(command: string, log: ChatMessage[]): boolean {
    var match;
    if(match=CLI.ChallengePattern.exec(command)) {
      this.ws.challenge(match[1],match[2]);
      return false;
    }
    else if (match=CLI.HelpPattern.exec(command)) {
      log.push(GENERAL_HELP_MESSAGE);
      return false;
    }
    else if(match=CLI.OnlinePattern.exec(command)) {
      this.ws.countOnlinePlayers();
      return false;
    }
    else if(match=CLI.WhisperPattern.exec(command)) {
      this.ws.sendWhisperMessage(match[2], match[1]);
      return false;
    }
    else {
      log.push(SANTAX_ERROR_MESSAGE);
      return true;
    }
  }
}
