import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessRulesComponent } from './bussiness-rules.component';

describe('BussinessRulesComponent', () => {
  let component: BussinessRulesComponent;
  let fixture: ComponentFixture<BussinessRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BussinessRulesComponent]
    });
    fixture = TestBed.createComponent(BussinessRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
