import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLetterComponent } from './request-letter.component';

describe('RequestLetterComponent', () => {
  let component: RequestLetterComponent;
  let fixture: ComponentFixture<RequestLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
