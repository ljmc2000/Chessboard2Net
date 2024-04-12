import { ActivatedRoute } from "@angular/router";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { IconMapTemplate } from 'constants/iconmap-template';
import { GameState } from 'models/gamestate';
import { PieceColourService } from 'services/piece-colour.service';
import { PlayerInfo } from 'models/playerinfo'
import { parse_colour, set_for } from 'utils';

import { ChatComponent } from 'components/chat/chat.component';
import { getValidChessMoves } from 'shared/chess-rules';
import { getValidCheckersMoves } from 'shared/checkers-rules';
import { Instruction as I, Game, PlayerNumber } from 'shared/constants';
import { owner, generate_algerbraic_names } from 'shared/utils';

const ALGERBRAIC_NAMES = generate_algerbraic_names();

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ChatComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  in_game: boolean=false;
  move_number: number;
  gamestate: string=' '.repeat(64);
  selected_origin: number=-1;
  valid_moves: number[]=[];

  icon_map: any={};
  player1_set: string="doodles";
  player2_set: string="doodles";
  player_number: number;

  constructor(
    public ws: ChessWebsocketHandlerService,
    public colourService: PieceColourService,
    routes: ActivatedRoute,
  ) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, (msg: GameState)=>this.updateGamestate(msg));
    ws.on(I.PINF, (msg: PlayerInfo)=>this.onPlayerInfo(msg));
    ws.on(I.SETPN, (msg: any)=>this.player_number=msg.player_number);

    routes.params.subscribe(params=>this.setRules(params['game']));

    this.icon_map[' ']=`blank`
    for(var key in IconMapTemplate) {
      this.icon_map[key.toUpperCase()]=`doodles/${IconMapTemplate[key]}`
      this.icon_map[key.toLowerCase()]=`doodles/${IconMapTemplate[key]}`
    }
  }

  getValidMoves=(square: number)=>{return []};

  is_player1(piece: string): boolean {
    return owner(piece)==PlayerNumber.ONE;
  }

  onClickSquare(square: number, piece: string) {
    if(this.selected_origin==-1) {
      this.valid_moves=this.getValidMoves(square);
      if(this.valid_moves.length>0) {
        this.selected_origin=square;
      }
    }
    else {
      if(this.valid_moves.includes(square)) {
        this.ws.move(ALGERBRAIC_NAMES.encoder[this.selected_origin]+ALGERBRAIC_NAMES.encoder[square])
      }

      this.selected_origin=-1;
      this.valid_moves=[];
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

  setRules(ruleset: string) {
    switch(ruleset) {
      case Game.CHECKERS:
        this.getValidMoves=(square: number)=>getValidCheckersMoves(this.gamestate, square, this.player_number, this.move_number);
        break;
      case Game.CHESS:
        this.getValidMoves=(square: number)=>getValidChessMoves(this.gamestate, square, this.player_number, this.move_number);
        break;
    }
  }

  updateGamestate(msg: GameState) {
    this.in_game=true;
    this.move_number=msg.move_number;
    this.gamestate=msg.gamestate;
  }
}
