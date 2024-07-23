import { TestBed } from '@angular/core/testing';

import { DqprofilingService } from './dqprofiling.service';

describe('DqprofilingService', () => {
  let service: DqprofilingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqprofilingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
