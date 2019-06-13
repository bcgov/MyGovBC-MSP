import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspStatusInCanadaRadioComponent } from '../../../../modules/msp-core/components/status-in-canada-radio/status-in-canada-radio.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component';
import { AddNewDependentBeneficiaryComponent } from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { MspBirthDateComponent } from '../../../../modules/msp-core/components/birthdate/birthdate.component';
// '../../common/birthdate/birthdate.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import { LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import { ProcessService } from '../../../../services/process.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { MspValidationService} from '../../../../services/msp-validation.service';
import { ModalModule } from 'ngx-bootstrap';
import {TextMaskModule} from 'angular2-text-mask';
import { MspToggleComponent } from '../../../../components/msp/common/toggle/toggle.component';
import { CalendarYearValidator } from '../../../../components/msp/common/calendar/calendar-year.validator';
import { CalendarMonthValidator } from '../../../../components/msp/common/calendar/calendar-month.validator';
import { CalendarDayValidator } from '../../../../components/msp/common/calendar/calendar-day.validator';
import { CalendarYearFormatter } from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import { MspGenderComponent } from '../../../../components/msp/common/gender/gender.component';
import { MspPhoneComponent } from '../../../../components/msp/common/phone/phone.component';
import { MspDischargeDateComponent } from '../../../../components/msp/common/discharge-date/discharge-date.component';
import { MspSchoolDateComponent } from '../../../../components/msp/common/schoolDate/school-date.component';
import { MspAddressComponent } from '../../../msp-core/components/address/address.component';
import { MspProvinceComponent } from '../../../../components/msp/common/province/province.component';
import { MspArrivalDateComponent } from '../../../../components/msp/common/arrival-date/arrival-date.component';
import { MspOutofBCRecordComponent } from '../../../../components/msp/common/outof-bc/outof-bc.component';
import { MspCountryComponent } from '../../../../components/msp/common/country/country.component';
import { MspDepartureDateComponent } from '../../../../components/msp/common/departure-date/departure-date.component';
import { MspReturnDateComponent } from '../../../../components/msp/common/return-date/return-date.component';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
import { Person } from 'moh-common-lib';
import { Relationship } from '../../../../models/status-activities-documents';
import { AddDependentComponent } from './add-dependents.component';



describe('AddDependentComponent', () => {
  let component: AddDependentComponent;
  let fixture: ComponentFixture<AddDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDependentComponent, MspToggleComponent, MspStatusInCanadaRadioComponent, MspDateComponent, AccountPersonalDetailsComponent, CalendarYearValidator, CalendarMonthValidator, CalendarDayValidator, CalendarYearFormatter, AddNewDependentBeneficiaryComponent, MspGenderComponent, MspBirthDateComponent, MspPhnComponent, MspPhoneComponent, MspDischargeDateComponent, MspSchoolDateComponent, MspAddressComponent, MspProvinceComponent, MspArrivalDateComponent, MspOutofBCRecordComponent, Mod11CheckValidator, MspCountryComponent, MspDepartureDateComponent, MspReturnDateComponent, ServicesCardDisclaimerModalComponent],
      imports: [ TextMaskModule,
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
