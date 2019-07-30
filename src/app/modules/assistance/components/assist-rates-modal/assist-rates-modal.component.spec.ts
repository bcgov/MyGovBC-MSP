import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistRatesModalComponent } from './assist-rates-modal.component';

describe('AssistRatesModalComponent', () => {
  let component: AssistRatesModalComponent;
  let fixture: ComponentFixture<AssistRatesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistRatesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistRatesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
