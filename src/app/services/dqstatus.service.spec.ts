import { TestBed } from '@angular/core/testing';

import { DqstatusService } from './dqstatus.service';

describe('DqstatusService', () => {
  let service: DqstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
