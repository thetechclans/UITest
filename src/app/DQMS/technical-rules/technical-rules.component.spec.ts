import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalRulesComponent } from './technical-rules.component';

describe('TechnicalRulesComponent', () => {
  let component: TechnicalRulesComponent;
  let fixture: ComponentFixture<TechnicalRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRulesComponent]
    });
    fixture = TestBed.createComponent(TechnicalRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
