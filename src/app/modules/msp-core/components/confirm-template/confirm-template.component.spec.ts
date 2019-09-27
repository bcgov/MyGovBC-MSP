import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTemplateComponent } from './confirm-template.component';

describe('ConfirmTemplateComponent', () => {
  let component: ConfirmTemplateComponent;
  let fixture: ComponentFixture<ConfirmTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
