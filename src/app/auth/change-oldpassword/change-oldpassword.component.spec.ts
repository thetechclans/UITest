import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOldpasswordComponent } from './change-oldpassword.component';

describe('ChangeOldpasswordComponent', () => {
  let component: ChangeOldpasswordComponent;
  let fixture: ComponentFixture<ChangeOldpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeOldpasswordComponent]
    });
    fixture = TestBed.createComponent(ChangeOldpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
