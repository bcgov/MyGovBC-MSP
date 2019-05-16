import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPhnComponent } from './common-phn.component';

describe('CommonPhnComponent', () => {
  let component: CommonPhnComponent;
  let fixture: ComponentFixture<CommonPhnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPhnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPhnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
