import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {BenefitDocumentsComponent} from './documents.component';

describe('BenefitDocumentsComponent', () => {
  let component: BenefitDocumentsComponent;
  let fixture: ComponentFixture<BenefitDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
