import { TestBed } from '@angular/core/testing';

import { ReferencedataService } from './referencedata.service';

describe('ReferencedataService', () => {
  let service: ReferencedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferencedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
 