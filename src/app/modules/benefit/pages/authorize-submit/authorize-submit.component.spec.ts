import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {BenefitAuthorizeSubmitComponent} from './authorize-submit.component';

describe('BenefitAuthorizeSubmitComponent', () => {
  let component: BenefitAuthorizeSubmitComponent;
  let fixture: ComponentFixture<BenefitAuthorizeSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitAuthorizeSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitAuthorizeSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
