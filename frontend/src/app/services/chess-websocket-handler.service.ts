import { Injectable } from '@angular/core';
import {Router} from "@angular/router"

import * as I from 'shared/instructions';

@Injectable({
  providedIn: 'root'
})
export class ChessWebsocketHandlerService extends WebSocket{
  constructor(private router: Router) {
    super(`ws://${window.location.host}/api`)
    this.onmessage=this.onMessage;
    this.onerror=this.onError;
    this.onclose=this.onClose;
  }

  onMessage(message: MessageEvent) {
    var data = JSON.parse(message.data)
    switch(data.instr) {
      case I.AUTH:
        this.router.navigate(['/login'])
        break;
      default:
        console.log(data.instr);
    }
  }

  onError(err: Event) {
    console.error(err);
  }

  onClose() {
  }
}
