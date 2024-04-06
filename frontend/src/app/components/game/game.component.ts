import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { GameState } from 'models/gamestate'
import { PlayerInfo } from 'models/playerinfo'
import * as S from 'shared/chess-sets'
import * as I from 'shared/instructions';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  IS_CAP=/[A-Z]/

  in_game: boolean=false;
  is_player1: boolean=true;
  gamestate: string='';
  icon_map: any={};

  //@ViewChild('board') board: ElementRef;

  constructor(public ws: ChessWebsocketHandlerService) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, (msg: GameState)=>this.updateGamestate(msg));
    ws.on(I.PINF, (msg: PlayerInfo)=>this.onPlayerInfo(msg));
  }

  invertBoard(gamestate: string) {
    return gamestate.split('').reverse().join('')
  }

  onPlayerInfo(msg: PlayerInfo) {
    var c_set='doodles/';
    switch(msg.prefered_set) {
      case S.DOODLES:
        c_set='doodles/'
        break
      case S.GOBLINS:
        c_set='goblins/'
        break
      case S.TEATIME:
        c_set='teatime/'
        break
    }
    if(this.is_player1) {
      if(msg.is_player1) {
        this.icon_map['P']=c_set+'pawn_back'
        this.icon_map['R']=c_set+'rook_back'
        this.icon_map['N']=c_set+'knight_back'
        this.icon_map['B']=c_set+'bishop_back'
        this.icon_map['Q']=c_set+'queen_back'
        this.icon_map['K']=c_set+'king_back'
      }
      else {
        this.icon_map['p']=c_set+'pawn'
        this.icon_map['r']=c_set+'rook'
        this.icon_map['n']=c_set+'knight'
        this.icon_map['b']=c_set+'bishop'
        this.icon_map['q']=c_set+'queen'
        this.icon_map['k']=c_set+'king'
      }
    }
    else {
      if(msg.is_player1) {
        this.icon_map['P']=c_set+'pawn'
        this.icon_map['R']=c_set+'rook'
        this.icon_map['N']=c_set+'knight'
        this.icon_map['B']=c_set+'bishop'
        this.icon_map['Q']=c_set+'queen'
        this.icon_map['K']=c_set+'king'
      }
      else {
        this.icon_map['p']=c_set+'pawn_back'
        this.icon_map['r']=c_set+'rook_back'
        this.icon_map['n']=c_set+'knight_back'
        this.icon_map['b']=c_set+'bishop_back'
        this.icon_map['q']=c_set+'queen_back'
        this.icon_map['k']=c_set+'king_back'
      }
    }
  }

  updateGamestate(msg: GameState) {
    this.in_game=true;
    this.is_player1=msg.is_player1
    if(this.is_player1)
      this.gamestate=msg.gamestate;
    else
      this.gamestate=this.invertBoard(msg.gamestate)
  }
}
