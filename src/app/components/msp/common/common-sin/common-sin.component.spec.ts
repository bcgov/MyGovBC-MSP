import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSinComponent } from './common-sin.component';

describe('CommonSinComponent', () => {
  let component: CommonSinComponent;
  let fixture: ComponentFixture<CommonSinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
