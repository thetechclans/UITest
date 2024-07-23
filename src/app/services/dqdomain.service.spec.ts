import { TestBed } from '@angular/core/testing';

import { DqdomainService } from './dqdomain.service';

describe('DqdomainService', () => {
  let service: DqdomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqdomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
