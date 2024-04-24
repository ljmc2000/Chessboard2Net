import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { IconMapTemplate, getDefaultIconMap, getReversedDefaultIconMap } from 'constants/iconmap-template';
import { GameLog } from 'models/gamelog';
import { PieceColourService } from 'services/piece-colour.service';
import { ReplayService } from 'services/replay.service';
import { parse_colour, set_for } from 'utils';
import { CHESS_DEFAULT_GAMESTATE, doChessMove } from 'shared/chess-rules';
import { CHECKERS_DEFAULT_GAMESTATE, doCheckersMove } from 'shared/checkers-rules';
import { Game, PlayerNumber } from 'shared/constants';
import { owner } from 'shared/utils';

@Component({
  selector: 'app-replay-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatIconModule, MatPaginatorModule],
  templateUrl: './replay-viewer.component.html',
  styleUrl: '../game/game.component.css'
})
export class ReplayViewerComponent {

  asPlayer2: boolean=false;
  calculatedBoardStates: string[]=[" ".repeat(64)];
  iconMap = getDefaultIconMap();
  reversedIconMap = getReversedDefaultIconMap();
  pageIndex: number=0;
  showGuide: boolean;

  constructor (
    private colourService: PieceColourService,
    replayService: ReplayService,
    route: ActivatedRoute,
  ) {
    route.paramMap.subscribe((params)=>{
      replayService.getReplay(params.get("game_id")).subscribe((replay)=>this.onRecieveReplay(replay));
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.pageIndex=pageEvent.pageIndex;
  }

  isPlayer1(piece: string): boolean {
    return owner(piece)==PlayerNumber.ONE;
  }

  onRecieveReplay(replay: GameLog) {
    var gamestate: string;
    var doMove: Function;

    switch(replay.game) {
      case Game.CHESS:
        gamestate=CHESS_DEFAULT_GAMESTATE;
        doMove=doChessMove
        break;
      case Game.CHECKERS:
        gamestate=CHECKERS_DEFAULT_GAMESTATE;
        doMove=doCheckersMove
        break;
      default:
        throw new Error("unsupported game type");
    }

    this.calculatedBoardStates=[gamestate];
    for(var i=0; i<replay.movelog.length; i++) {
      for(var j=0; j<=replay.movelog[i].length-4; j+=2) {
        gamestate=doMove(gamestate, replay.movelog[i].slice(j,j+4), i%2);
        this.calculatedBoardStates.push(gamestate);
      }
    }

    for(var key in IconMapTemplate) {
      this.iconMap[key.toUpperCase()]=`${set_for(replay.player1.prefered_set)}/${IconMapTemplate[key]}_back`;
      this.iconMap[key.toLowerCase()]=`${set_for(replay.player2.prefered_set)}/${IconMapTemplate[key]}`;
      this.reversedIconMap[key.toUpperCase()]=`${set_for(replay.player1.prefered_set)}/${IconMapTemplate[key]}`;
      this.reversedIconMap[key.toLowerCase()]=`${set_for(replay.player2.prefered_set)}/${IconMapTemplate[key]}_back`;
    }

    this.colourService.setColour('player1', 'custom_colour', parse_colour(replay.player1.favourite_colour));
    this.colourService.setColour('player2', 'custom_colour', parse_colour(replay.player2.favourite_colour));
  }
}
