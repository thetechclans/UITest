import { TestBed } from '@angular/core/testing';

import { SourcetypeService } from './sourcetype.service';

describe('SourcetypeService', () => {
  let service: SourcetypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourcetypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
