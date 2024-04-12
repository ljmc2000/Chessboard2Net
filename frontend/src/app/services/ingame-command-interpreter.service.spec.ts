import { TestBed } from '@angular/core/testing';

import { IngameCommandInterpreterService } from './ingame-command-interpreter.service';

describe('IngameCommandInterpreterService', () => {
  let service: IngameCommandInterpreterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngameCommandInterpreterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
