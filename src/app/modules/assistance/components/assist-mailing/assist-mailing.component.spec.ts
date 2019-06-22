import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistMailingComponent } from './assist-mailing.component';

describe('AssistMailingComponent', () => {
  let component: AssistMailingComponent;
  let fixture: ComponentFixture<AssistMailingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistMailingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistMailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
