import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistRatesHelperModalComponent } from './assist-rates-helper-modal.component';

describe('AssistRatesHelperModalComponent', () => {
  let component: AssistRatesHelperModalComponent;
  let fixture: ComponentFixture<AssistRatesHelperModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistRatesHelperModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistRatesHelperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
