import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonButtonGroupComponent } from './common-button-group.component';

describe('CommonButtonGroupComponent', () => {
  let component: CommonButtonGroupComponent;
  let fixture: ComponentFixture<CommonButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
