import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RemoveDependentComponent } from './remove-dependents.component';
import { MspStatusInCanadaRadioComponent } from '../../../../modules/msp-core/components/status-in-canada-radio/status-in-canada-radio.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component';
import { AddNewDependentBeneficiaryComponent } from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { MspBirthDateComponent } from '../../../../modules/msp-core/components/birthdate/birthdate.component';
import { MspAddressComponent } from '../../../../modules/msp-core/components/address/address.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import { LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import { ProcessService } from '../../../../services/process.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { MspValidationService} from '../../../../services/msp-validation.service';
import {ModalModule} from 'ngx-bootstrap';
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
import { MspProvinceComponent } from '../../../../components/msp/common/province/province.component';
import { MspArrivalDateComponent } from '../../../../components/msp/common/arrival-date/arrival-date.component';
import { MspOutofBCRecordComponent } from '../../../../components/msp/common/outof-bc/outof-bc.component';
import { MspCountryComponent } from '../../../../components/msp/common/country/country.component';
import { MspDepartureDateComponent } from '../../../../components/msp/common/departure-date/departure-date.component';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
import { MspReturnDateComponent } from '../../../../components/msp/common/return-date/return-date.component';
import { Person } from 'moh-common-lib';
import { Relationship } from '../../../../models/status-activities-documents';



describe('RemoveDependentComponent', () => {
  let component: RemoveDependentComponent;
  let fixture: ComponentFixture<RemoveDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDependentComponent, MspToggleComponent, MspStatusInCanadaRadioComponent, MspDateComponent, AccountPersonalDetailsComponent, CalendarYearValidator, CalendarMonthValidator, CalendarDayValidator, CalendarYearFormatter, AddNewDependentBeneficiaryComponent, MspGenderComponent, MspBirthDateComponent, MspPhnComponent, MspPhoneComponent, MspDischargeDateComponent, MspSchoolDateComponent, MspAddressComponent, MspProvinceComponent, MspArrivalDateComponent, MspOutofBCRecordComponent, Mod11CheckValidator, MspCountryComponent, MspDepartureDateComponent, ServicesCardDisclaimerModalComponent, MspReturnDateComponent],
      imports: [
        FormsModule,
        TextMaskModule,
        TypeaheadModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        RouterTestingModule,
          ModalModule.forRoot()
      ],
      providers: [
        MspDataService,
        ProcessService,
        CompletenessCheckService,
        MspValidationService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveDependentComponent);
    component = fixture.componentInstance;
    component.person = new Person(Relationship.Spouse);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a cancellationIterable for child19To24', () => {
    expect(component.getCancellationReasonsIterable(Relationship.Child19To24)).toBeDefined();
    expect(component.getCancellationReasonsIterable(Relationship.Child19To24).length).toBeDefined();
    expect(component.getCancellationReasonsIterable(Relationship.Child19To24).length).toBeDefined();
    expect(component.getCancellationReasonsIterable(Relationship.Child19To24)[0]).toBeDefined();
  });

  it('should return "Other" for reason for cancellation when a custom reason is provided to person', () => {
    component.person.reasonForCancellation = 'random';
    expect(component.reasonForCancellation).toEqual('Other');
  });

  it('should return a default reason for cancellation if a default reason is used', () => {
    const reason = component.getCancellationReasonsIterable(Relationship.Child19To24)[0];
    component.onChangeReasonForCancellation(reason);
    expect(component.reasonForCancellation).toEqual(reason);
  });

  it('should have an element it focuses on on init', () => {
    expect(component.firstFocus).toBeDefined();
    expect(component.firstFocus.nativeElement).toEqual(document.activeElement);
  });

});
