import { TestBed } from '@angular/core/testing';

import { BusinesssystemService } from './businesssystem.service';

describe('BusinesssystemService', () => {
  let service: BusinesssystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinesssystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
