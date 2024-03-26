import { TestBed } from '@angular/core/testing';

import { ChessWebsocketHandlerService } from './chess-websocket-handler.service';

describe('ChessWebsocketHandlerService', () => {
  let service: ChessWebsocketHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessWebsocketHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
