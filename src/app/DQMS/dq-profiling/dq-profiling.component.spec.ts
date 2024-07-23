import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DqProfilingComponent } from './dq-profiling.component';

describe('DqProfilingComponent', () => {
  let component: DqProfilingComponent;
  let fixture: ComponentFixture<DqProfilingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DqProfilingComponent]
    });
    fixture = TestBed.createComponent(DqProfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
