import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GameLog } from 'models/gamelog';
import { PageableData } from 'models/pageable';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {

  constructor(public http: HttpClient) { }

  getReplay(game_id: string|null):Observable<GameLog> {
    return this.http.get<GameLog>(`/api/game_log/${game_id}`);
  }

  listReplays(page: number): Observable<PageableData<GameLog[]>> {
    return this.http.get<PageableData<GameLog[]>>(`/api/game_logs/${page}`);
  }
}
