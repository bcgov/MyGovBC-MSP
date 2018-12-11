import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AddDependentComponent } from './add-dependents.component';
import { MspToggleComponent } from '../../common/toggle/toggle.component';
import { MspStatusInCanadaRadioComponent } from '../../common/status-in-canada-radio/status-in-canada-radio.component';
import { MspDateComponent } from '../../common/date/date.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component';
import { CalendarYearValidator } from '../../common/calendar/calendar-year.validator';
import { CalendarMonthValidator } from '../../common/calendar/calendar-month.validator';
import { CalendarDayValidator } from '../../common/calendar/calendar-day.validator';
import { CalendarYearFormatter } from '../../common/calendar/calendar-year-formatter.component';
import { AddNewDependentBeneficiaryComponent } from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { MspNameComponent } from '../../common/name/name.component';
import { MspGenderComponent } from '../../common/gender/gender.component';
import { MspBirthDateComponent } from '../../common/birthdate/birthdate.component';
import { MspPhnComponent } from '../../common/phn/phn.component';
import { MspPhoneComponent } from '../../common/phone/phone.component';
import { MspDischargeDateComponent } from '../../common/discharge-date/discharge-date.component';
'../../common/birthdate/birthdate.component';
import { MspSchoolDateComponent } from '../../common/schoolDate/school-date.component';
import { MspAddressComponent } from '../../common/address/address.component';
import { MspProvinceComponent } from '../../common/province/province.component';
import { MspArrivalDateComponent } from '../../common/arrival-date/arrival-date.component';
import { MspOutofBCRecordComponent } from '../../common/outof-bc/outof-bc.component';
import { Mod11CheckValidator } from '../../common/phn/phn.validator';
import { MspCountryComponent } from '../../common/country/country.component';
import { MspDataService } from '../../service/msp-data.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import { MspDepartureDateComponent } from '../../common/departure-date/departure-date.component';
import {MspReturnDateComponent} from '../../common/return-date/return-date.component';
import { Person } from '../../model/person.model';
import { Relationship } from '../../model/status-activities-documents';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import { ProcessService } from '../../service/process.service';
import { CompletenessCheckService } from '../../service/completeness-check.service';
import { MspValidationService} from '../../service/msp-validation.service';
import { ServicesCardDisclaimerModalComponent } from '../../../msp/common/services-card-disclaimer/services-card-disclaimer.component';
import { ModalModule } from 'ngx-bootstrap';



describe('AddDependentComponent', () => {
  let component: AddDependentComponent;
  let fixture: ComponentFixture<AddDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDependentComponent, MspToggleComponent, MspStatusInCanadaRadioComponent, MspDateComponent, AccountPersonalDetailsComponent, CalendarYearValidator, CalendarMonthValidator, CalendarDayValidator, CalendarYearFormatter, AddNewDependentBeneficiaryComponent, MspNameComponent, MspGenderComponent, MspBirthDateComponent, MspPhnComponent, MspPhoneComponent, MspDischargeDateComponent, MspSchoolDateComponent, MspAddressComponent, MspProvinceComponent, MspArrivalDateComponent, MspOutofBCRecordComponent, Mod11CheckValidator, MspCountryComponent, MspDepartureDateComponent, MspReturnDateComponent, ServicesCardDisclaimerModalComponent],
      imports: [
        FormsModule,
        TypeaheadModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        ModalModule.forRoot(),
        RouterTestingModule
      ],
      providers: [MspDataService, ProcessService, CompletenessCheckService, MspValidationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDependentComponent);
    component = fixture.componentInstance;
    component.person = new Person(Relationship.Spouse);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('be able to cancel adding a dependent ', () => {
    spyOn(component.onCancel, 'emit');
    expect(component.onCancel.emit).not.toHaveBeenCalled();
    component.cancelDependent();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });

  it('should have the Toggle Component visible on init to ask the beneficiary status', () => {
    expect(component.toggleComp).toBeTruthy();
  });

  it('should only show the status in canada radio if beneficary status is N', () => {
    expect(component.statusRadioComponents).toBeUndefined();
    component.person.isExistingBeneficiary = false;
    fixture.detectChanges();
    expect(component.statusRadioComponents).toBeDefined();
  });

  it('should show the account personal details component if the beneficary status is Y', () => {
    expect(component.personalDetailsComponent.length).toBe(0);
    component.person.isExistingBeneficiary = true;
    fixture.detectChanges();
    expect(component.personalDetailsComponent.length).toBe(1);
  });

  it('should show the account personal details component if the beneficary status is N AND the person\'s status is set', () => {
    expect(component.personalDetailsComponent.length).toBe(0);
    component.person.isExistingBeneficiary = false;
    component.person.status = 1;
    fixture.detectChanges();
    expect(component.personalDetailsComponent.length).toBe(1);
  });

  it('should show the new beneficary questions if the beneficary status is N AND the person\'s status is set', () => {
    expect(component.newDependentBeneficiaryComponents.length).toBe(0);
    component.person.isExistingBeneficiary = true;
    fixture.detectChanges();
    expect(component.newDependentBeneficiaryComponents.length).toBe(0);
    component.person.isExistingBeneficiary = false;
    component.person.status = 1;
    fixture.detectChanges();
    expect(component.newDependentBeneficiaryComponents.length).toBe(1);
  });

});
