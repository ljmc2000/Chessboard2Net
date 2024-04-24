import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { GameLog } from 'models/gamelog';
import { ReplayService } from 'services/replay.service';

@Component({
  selector: 'app-replay-browser',
  standalone: true,
  imports: [ CommonModule, MatPaginatorModule, MatTableModule ],
  templateUrl: './replay-browser.component.html',
  styleUrl: './replay-browser.component.css'
})
export class ReplayBrowserComponent {

  displayed_columns: string[] = ['game', 'conclusion', 'player1', 'player2', 'replay'];
  replay_data: GameLog[];
  page: number=0;

  constructor(public replayService: ReplayService) {
    replayService.listReplays(0).subscribe((data)=>{
      this.replay_data=data;
    });
  }
}
