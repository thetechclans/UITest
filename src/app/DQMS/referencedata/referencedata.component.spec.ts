import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedataComponent } from './referencedata.component';

describe('ReferencedataComponent', () => {
  let component: ReferencedataComponent;
  let fixture: ComponentFixture<ReferencedataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferencedataComponent]
    });
    fixture = TestBed.createComponent(ReferencedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
