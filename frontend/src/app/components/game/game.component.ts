import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { IconMapTemplate } from 'constants/iconmap-template';
import { GameState } from 'models/gamestate';
import { PieceColourService } from 'services/piece-colour.service';
import { PlayerInfo } from 'models/playerinfo'
import { parse_colour, set_for } from 'utils';

import { ChatComponent } from 'components/chat/chat.component';
import { Instruction as I, Game, PlayerNumber } from 'shared/constants';
import { owner, generate_algerbraic_names } from 'shared/utils';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, ChatComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  autocomplete: number[]=[]
  current_move: string='';
  gamestate: string=' '.repeat(64);
  in_game: boolean=false;
  move_number: number;
  show_guide: boolean;
  valid_moves: string='*';

  ALGERBRAIC_NAMES = generate_algerbraic_names();
  icon_map: any={};
  player1_set: string="doodles";
  player2_set: string="doodles";
  player_number: number;

  constructor(
    public ws: ChessWebsocketHandlerService,
    public colourService: PieceColourService,
  ) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, (msg: GameState)=>this.updateGamestate(msg));
    ws.on(I.PINF, (msg: PlayerInfo)=>this.onPlayerInfo(msg));
    ws.on(I.SETPN, (msg: any)=>this.player_number=msg.player_number);

    this.icon_map[' ']=`blank`
    for(var key in IconMapTemplate) {
      this.icon_map[key.toUpperCase()]=`doodles/${IconMapTemplate[key]}`
      this.icon_map[key.toLowerCase()]=`doodles/${IconMapTemplate[key]}`
    }
  }

  is_player1(piece: string): boolean {
    return owner(piece)==PlayerNumber.ONE;
  }

  finishMove() {
    this.ws.move(this.current_move);
    this.current_move='';
    this.autocomplete=[];
  }

  onClickSquare(square: number) {
    this.current_move=this.current_move+this.ALGERBRAIC_NAMES.encoder[square];
    this.autocomplete=[];
    const current_move_autocomplete = RegExp(`\\*${this.current_move}([A-H]\\d)`,'g');

    for(var move of this.valid_moves.matchAll(current_move_autocomplete)) {
      this.autocomplete.push(this.ALGERBRAIC_NAMES.decoder[move[1]]);
    }

    if(this.autocomplete.length==0) {
      if(this.current_move.length>2 && this.valid_moves.includes(this.current_move))
        this.ws.move(this.current_move);

      this.current_move='';
    }
  }

  onPlayerInfo(msg: PlayerInfo) {
    var mod, c_set=set_for(msg.prefered_set);
    if(msg.player_number==PlayerNumber.ONE) {
      this.colourService.setColour('player1', 'custom_colour', parse_colour(msg.favourite_colour));
      this.player1_set=c_set;
      mod=(a: string)=>a.toUpperCase()
    }
    else if (msg.player_number==PlayerNumber.TWO) {
      this.colourService.setColour('player2', 'custom_colour', parse_colour(msg.favourite_colour));
      this.player2_set=c_set;
      mod=(a: string)=>a.toLowerCase()
    }
    else {
      return;
    }

    var suffix = this.player_number==msg.player_number?'_back':'';
    for(var key in IconMapTemplate)
      this.icon_map[mod(key)]=`${c_set}/${IconMapTemplate[key]}${suffix}`;
  }

  updateGamestate(msg: GameState) {
    this.in_game=true;
    this.move_number=msg.move_number;
    this.gamestate=msg.gamestate;
    this.valid_moves=this.move_number%2==this.player_number?msg.valid_moves:'*';
  }
}
