import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { GameLog } from 'models/gamelog';
import { ReplayService } from 'services/replay.service';
import { CHESS_DEFAULT_GAMESTATE, doChessMove } from 'shared/chess-rules';
import { CHECKERS_DEFAULT_GAMESTATE, doCheckersMove } from 'shared/checkers-rules';
import { Game, PlayerNumber } from 'shared/constants';
import { getDefaultIconMap, getReversedDefaultIconMap } from 'constants/iconmap-template';
import { owner } from 'shared/utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-replay-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatIconModule, MatPaginatorModule],
  templateUrl: './replay-viewer.component.html',
  styleUrl: '../game/game.component.css'
})
export class ReplayViewerComponent {

  asPlayer2: boolean=false;
  replay: GameLog;
  calculatedBoardStates: string[]=[" ".repeat(64)];
  iconMap = getDefaultIconMap();
  reversedIconMap = getReversedDefaultIconMap();
  pageIndex: number=0;
  showGuide: boolean;

  constructor (replayService: ReplayService, route: ActivatedRoute) {
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
    this.replay=replay;
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
      gamestate=doMove(gamestate, replay.movelog[i], i%2);
      this.calculatedBoardStates.push(gamestate);
    }
  }
}
