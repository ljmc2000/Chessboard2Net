import { ActivatedRoute } from "@angular/router";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { IconMapTemplate } from 'constants/iconmap-template';
import { GameState } from 'models/gamestate'
import { PlayerInfo } from 'models/playerinfo'
import { parse_colour, set_for } from 'utils';

import { Instruction as I, Game } from 'shared/constants'
import { getValidChessMoves } from 'shared/chess-rules';
import { getValidCheckersMoves } from 'shared/checkers-rules';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  IS_PLAYER1=/[A-Z]/
  IS_PLAYER2=/[a-z]/

  in_game: boolean=false;
  is_player1: boolean=true;
  move_number: number;
  gamestate: string='';
  selected_square: number=-1;
  targets: number[]=[];

  icon_map: any={};
  player1_set: string='doodles';
  player2_set: string='doodles';
  player1_colour: string='white';
  player2_colour: string='black';

  constructor(public ws: ChessWebsocketHandlerService, routes: ActivatedRoute) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, (msg: GameState)=>this.updateGamestate(msg));
    ws.on(I.PINF, (msg: PlayerInfo)=>this.onPlayerInfo(msg));

    routes.params.subscribe(params=>this.setRules(params['game']));
  }

  getValidMoves=(square: number)=>{return []};

  canMove(piece: string): boolean {
    if(this.move_number%2==0)
      return this.is_player1 && this.IS_PLAYER1.exec(piece)!=null
    else
      return !this.is_player1 && this.IS_PLAYER2.exec(piece)!=null
  }

  onClickSquare(square: number, piece: string) {
    if(this.selected_square==-1 && this.canMove(piece)) {
      this.selected_square=square;
      this.targets=this.getValidMoves(square);
    }
    else {
      this.selected_square=-1;
      this.targets=[];
    }
  }

  onPlayerInfo(msg: PlayerInfo) {
    var c_set=set_for(msg.prefered_set);
    if(msg.is_player1) {
      this.player1_colour=parse_colour(msg.favourite_colour)
      this.player1_set=c_set;
    }
    else {
      this.player2_colour=parse_colour(msg.favourite_colour)
      this.player2_set=c_set;
    }

    var mod = msg.is_player1?(a: string)=>a.toUpperCase():(a: string)=>a.toLowerCase();
    var suffix = this.is_player1==msg.is_player1?'_back':'';
    for(var key in IconMapTemplate)
      this.icon_map[mod(key)]=`${c_set}/${IconMapTemplate[key]}${suffix}`;
  }

  setRules(ruleset: string) {
    switch(ruleset) {
      case Game.CHECKERS:
        this.getValidMoves=(square: number)=>getValidCheckersMoves(this.gamestate, square, this.is_player1);
        break;
      case Game.CHESS:
        this.getValidMoves=(square: number)=>getValidChessMoves(this.gamestate, square, this.is_player1);
        break;
    }
  }

  updateGamestate(msg: GameState) {
    this.in_game=true;
    this.is_player1=msg.is_player1;
    this.move_number=msg.move_number;
    if(this.is_player1)
      this.gamestate=msg.gamestate;
    else
      this.gamestate=msg.gamestate.split('').reverse().join('')
  }

  afterUpdateGamestate() {
    document.querySelectorAll<SVGElement>('.player1 .custom_colour')
    .forEach((area)=>{
      area.style.fill=this.player1_colour
    });

    document.querySelectorAll<SVGElement>('.player2 .custom_colour')
    .forEach((area)=>{
    area.style.fill=this.player2_colour
    });
  }
}
