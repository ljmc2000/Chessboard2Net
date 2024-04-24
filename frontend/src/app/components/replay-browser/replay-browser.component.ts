import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { GameLog } from 'models/gamelog';
import { ReplayService } from 'services/replay.service';
import { PAGE_SIZE } from 'shared/constants';
import { PageableData } from 'models/pageable';

@Component({
  selector: 'app-replay-browser',
  standalone: true,
  imports: [ CommonModule, MatPaginatorModule, MatTableModule ],
  templateUrl: './replay-browser.component.html',
  styleUrl: './replay-browser.component.css'
})
export class ReplayBrowserComponent {

  displayed_columns: string[] = ['game', 'conclusion', 'player1', 'player2', 'replay'];
  replay_data: GameLog[][]=[];
  itemCount=0;
  pageIndex: number=0;
  pageSize: number = PAGE_SIZE;
  is_last: boolean;

  constructor(public replayService: ReplayService) {
    replayService.listReplays(0).subscribe((resp: PageableData<GameLog[]>)=>{
      this.replay_data.push(resp.data);
      this.itemCount+=resp.data.length;
      this.is_last=resp.is_last;
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
  }
}
