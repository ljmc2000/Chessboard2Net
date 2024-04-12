import { TestBed } from '@angular/core/testing';

import { GeneralCommandInterpreterService } from './general-command-interpreter.service';

describe('GeneralCommandInterpreterService', () => {
  let service: GeneralCommandInterpreterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralCommandInterpreterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
