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
  replay_data: Map<number,GameLog[]>=new Map();
  itemCount=0;
  pageIndex: number=0;
  pageSize: number = PAGE_SIZE;
  last_page: number=-1;

  constructor(public replayService: ReplayService) {
    this.getPage(0);
  }

  getPage(pageIndex: number) {
    this.replayService.listReplays(pageIndex).subscribe((resp: PageableData<GameLog[]>)=>{
      this.replay_data.set(pageIndex, resp.data);
      this.itemCount+=resp.data.length;
      if(resp.is_last) {
        this.last_page=pageIndex;
      }
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    if(!this.replay_data.has(pageEvent.pageIndex)) {
      this.getPage(pageEvent.pageIndex);
    }
    this.pageIndex=pageEvent.pageIndex;
  }
}
