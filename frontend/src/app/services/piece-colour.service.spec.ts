import { TestBed } from '@angular/core/testing';

import { PieceColourService } from './piece-colour.service';

describe('PieceColourService', () => {
  let service: PieceColourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceColourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
