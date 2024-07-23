import { TestBed } from '@angular/core/testing';

import { ApppermissionService } from './apppermission.service';

describe('ApppermissionService', () => {
  let service: ApppermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApppermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
