import { TestBed } from '@angular/core/testing';

import { UserInfoServiceService } from './user-info-service.service';

describe('UserInfoServiceService', () => {
  let service: UserInfoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
