import { TestBed } from '@angular/core/testing';

import { DqcardService } from './dqcard.service';

describe('DqcardService', () => {
  let service: DqcardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqcardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
