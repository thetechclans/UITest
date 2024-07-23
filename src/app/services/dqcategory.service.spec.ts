import { TestBed } from '@angular/core/testing';

import { DqcategoryService } from './dqcategory.service';

describe('DqcategoryService', () => {
  let service: DqcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DqcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
