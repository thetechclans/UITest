import { TestBed } from '@angular/core/testing';

import { ProfiletypeService } from './profiletype.service';

describe('ProfiletypeService', () => {
  let service: ProfiletypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfiletypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
