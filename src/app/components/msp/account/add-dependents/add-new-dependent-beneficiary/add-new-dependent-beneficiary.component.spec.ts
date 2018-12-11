import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspToggleComponent } from '../../../common/toggle/toggle.component';
import { MspDateComponent } from '../../../common/date/date.component';
import { MspProvinceComponent } from '../../../common/province/province.component';
import { MspOutofBCRecordComponent } from '../../../common/outof-bc/outof-bc.component';
import { MspDischargeDateComponent } from '../../../common/discharge-date/discharge-date.component';
import { CalendarYearFormatter } from '../../../common/calendar/calendar-year-formatter.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import { MspDepartureDateComponent } from '../../../common/departure-date/departure-date.component';
import { Person } from '../../../model/person.model';
import { Relationship } from '../../../model/status-activities-documents';

//Weirdly, including MspReturnDateComponent in declarations leads to ALL of the tests failing to run because it can't load the component factory.
//Have to run `ng test --sourcemaps=false`
//https://github.com/angular/angular-cli/issues/7296
import { MspReturnDateComponent } from '../../../common/return-date/return-date.component';
import { AddNewDependentBeneficiaryComponent } from './add-new-dependent-beneficiary.component';

describe('AddNewDependentBeneficiaryComponent', () => {
  let component: AddNewDependentBeneficiaryComponent;
  let fixture: ComponentFixture<AddNewDependentBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewDependentBeneficiaryComponent, MspToggleComponent, MspDateComponent, MspProvinceComponent, MspOutofBCRecordComponent, MspDischargeDateComponent, CalendarYearFormatter,
        MspReturnDateComponent,
        AddNewDependentBeneficiaryComponent,
        MspDepartureDateComponent],
      imports: [FormsModule, TypeaheadModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDependentBeneficiaryComponent);
    component = fixture.componentInstance;
    const spouse = new Person(Relationship.Spouse);
    component.person = spouse;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
