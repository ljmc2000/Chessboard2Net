import { TestBed } from '@angular/core/testing';

import { CommandInterpreterService } from './command-interpreter.service';

describe('CommandInterpreterService', () => {
  let service: CommandInterpreterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandInterpreterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
