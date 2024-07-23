import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DqCreateprofilingComponent } from './dq-createprofiling.component';

describe('DqCreateprofilingComponent', () => {
  let component: DqCreateprofilingComponent;
  let fixture: ComponentFixture<DqCreateprofilingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DqCreateprofilingComponent]
    });
    fixture = TestBed.createComponent(DqCreateprofilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
