import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DqProfilingruleComponent } from './dq-profilingrule.component';

describe('DqProfilingruleComponent', () => {
  let component: DqProfilingruleComponent;
  let fixture: ComponentFixture<DqProfilingruleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DqProfilingruleComponent]
    });
    fixture = TestBed.createComponent(DqProfilingruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
