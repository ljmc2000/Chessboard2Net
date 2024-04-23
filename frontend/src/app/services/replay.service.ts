import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GameLog } from 'models/gamelog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {

  constructor(public http: HttpClient) { }

  getReplay(game_id: string):Observable<GameLog> {
    return this.http.get<GameLog>(`/api/game_log/${game_id}`);
  }

  listReplays(page: number): Observable<GameLog[]> {
    return this.http.get<GameLog[]>(`/api/game_logs/${page}`);
  }
}
