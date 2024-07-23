import { TestBed } from '@angular/core/testing';

import { DqruleService } from './dqrule.service';

describe('DqruleService', () => {
  let service: DqruleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqruleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
