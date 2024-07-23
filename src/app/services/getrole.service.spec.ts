import { TestBed } from '@angular/core/testing';

import { GetroleService } from './getrole.service';

describe('GetroleService', () => {
  let service: GetroleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetroleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
