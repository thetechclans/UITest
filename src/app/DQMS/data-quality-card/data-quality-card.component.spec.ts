import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataQualityCardComponent } from './data-quality-card.component';

describe('DataQualityCardComponent', () => {
  let component: DataQualityCardComponent;
  let fixture: ComponentFixture<DataQualityCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataQualityCardComponent]
    });
    fixture = TestBed.createComponent(DataQualityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
