import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChessWebsocketHandlerService } from 'services/chess-websocket-handler.service';
import { GameState } from 'models/gamestate'
import { PlayerInfo } from 'models/playerinfo'
import { Instruction as I } from 'shared/constants'
import { parse_colour, set_for } from 'utils';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export abstract class GameComponent {

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

  constructor(public ws: ChessWebsocketHandlerService) {
    ws.on(I.GOVER, ()=>this.in_game=false);
    ws.on(I.GST, (msg: GameState)=>this.updateGamestate(msg));
    ws.on(I.PINF, (msg: PlayerInfo)=>this.onPlayerInfo(msg));
  }

  canMove(piece: string): boolean {
    if(this.move_number%2==0)
      return this.is_player1 && this.IS_PLAYER1.exec(piece)!=null
    else
      return !this.is_player1 && this.IS_PLAYER2.exec(piece)!=null
  }

  onClickSquare(square: number, piece: string) {
    if(this.selected_square==-1 && this.canMove(piece)) {
      this.selected_square=square;
    }
    else {
      this.selected_square=-1;
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

    if(this.is_player1) {
      if(msg.is_player1) {
        this.icon_map['P']=c_set+'/pawn_back'
        this.icon_map['R']=c_set+'/rook_back'
        this.icon_map['N']=c_set+'/knight_back'
        this.icon_map['B']=c_set+'/bishop_back'
        this.icon_map['Q']=c_set+'/queen_back'
        this.icon_map['K']=c_set+'/king_back'

        this.icon_map['F']=c_set+'/pawn_back'
        this.icon_map['C']=c_set+'/rook_back'
        this.icon_map['J']=c_set+'/king_back'
      }
      else {
        this.icon_map['p']=c_set+'/pawn'
        this.icon_map['r']=c_set+'/rook'
        this.icon_map['n']=c_set+'/knight'
        this.icon_map['b']=c_set+'/bishop'
        this.icon_map['q']=c_set+'/queen'
        this.icon_map['k']=c_set+'/king'

        this.icon_map['f']=c_set+'/pawn'
        this.icon_map['c']=c_set+'/rook'
        this.icon_map['j']=c_set+'/king'
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

        this.icon_map['F']=c_set+'/pawn'
        this.icon_map['C']=c_set+'/rook'
        this.icon_map['J']=c_set+'/king'
      }
      else {
        this.icon_map['p']=c_set+'/pawn_back'
        this.icon_map['r']=c_set+'/rook_back'
        this.icon_map['n']=c_set+'/knight_back'
        this.icon_map['b']=c_set+'/bishop_back'
        this.icon_map['q']=c_set+'/queen_back'
        this.icon_map['k']=c_set+'/king_back'

        this.icon_map['f']=c_set+'/pawn_back'
        this.icon_map['c']=c_set+'/rook_back'
        this.icon_map['j']=c_set+'/king_back'
      }
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
