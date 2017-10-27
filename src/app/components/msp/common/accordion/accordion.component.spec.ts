import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MspAccordionComponent } from './accordion.component';

describe('MspAccordionComponent', () => {
  let component: MspAccordionComponent;
  let fixture: ComponentFixture<MspAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MspAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MspAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
