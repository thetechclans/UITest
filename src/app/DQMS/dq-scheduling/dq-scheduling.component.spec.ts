import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DqSchedulingComponent } from './dq-scheduling.component';

describe('DqSchedulingComponent', () => {
  let component: DqSchedulingComponent;
  let fixture: ComponentFixture<DqSchedulingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DqSchedulingComponent]
    });
    fixture = TestBed.createComponent(DqSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
