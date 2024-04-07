import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { GameState } from 'models/gamestate'
import { PlayerInfo } from 'models/playerinfo'
import * as S from 'shared/chess-sets'
import * as I from 'shared/instructions';
import { parse_colour, set_for } from 'utils';

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
  gamestate: string='';
  icon_map: any={};

  player1_colour: string='white';
  player2_colour: string='black';

  constructor(public ws: ChessWebsocketHandlerService) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, (msg: GameState)=>this.updateGamestate(msg));
    ws.on(I.PINF, (msg: PlayerInfo)=>this.onPlayerInfo(msg));
  }

  onPlayerInfo(msg: PlayerInfo) {
    if(msg.is_player1)
      this.player1_colour=parse_colour(msg.favourite_colour)
    else
      this.player2_colour=parse_colour(msg.favourite_colour)

    var c_set=set_for(msg.prefered_set);

    if(this.is_player1) {
      if(msg.is_player1) {
        this.icon_map['P']=c_set+'/pawn_back'
        this.icon_map['R']=c_set+'/rook_back'
        this.icon_map['N']=c_set+'/knight_back'
        this.icon_map['B']=c_set+'/bishop_back'
        this.icon_map['Q']=c_set+'/queen_back'
        this.icon_map['K']=c_set+'/king_back'
      }
      else {
        this.icon_map['p']=c_set+'/pawn'
        this.icon_map['r']=c_set+'/rook'
        this.icon_map['n']=c_set+'/knight'
        this.icon_map['b']=c_set+'/bishop'
        this.icon_map['q']=c_set+'/queen'
        this.icon_map['k']=c_set+'/king'
      }
    }
    else {
      if(msg.is_player1) {
        this.icon_map['P']=c_set+'/pawn'
        this.icon_map['R']=c_set+'/rook'
        this.icon_map['N']=c_set+'/knight'
        this.icon_map['B']=c_set+'/bishop'
        this.icon_map['Q']=c_set+'/queen'
        this.icon_map['K']=c_set+'/king'
      }
      else {
        this.icon_map['p']=c_set+'/pawn_back'
        this.icon_map['r']=c_set+'/rook_back'
        this.icon_map['n']=c_set+'/knight_back'
        this.icon_map['b']=c_set+'/bishop_back'
        this.icon_map['q']=c_set+'/queen_back'
        this.icon_map['k']=c_set+'/king_back'
      }
    }
  }

  updateGamestate(msg: GameState) {
    this.in_game=true;
    this.is_player1=msg.is_player1
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
