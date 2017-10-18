import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDependentBeneficiaryComponent } from './add-new-dependent-beneficiary.component';

describe('AddNewDependentBeneficiaryComponent', () => {
  let component: AddNewDependentBeneficiaryComponent;
  let fixture: ComponentFixture<AddNewDependentBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewDependentBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDependentBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
