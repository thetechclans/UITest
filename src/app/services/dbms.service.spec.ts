import { TestBed } from '@angular/core/testing';

import { DbmsService } from './dbms.service';

describe('DbmsService', () => {
  let service: DbmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
