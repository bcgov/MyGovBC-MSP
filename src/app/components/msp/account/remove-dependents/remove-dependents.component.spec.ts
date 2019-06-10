import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RemoveDependentComponent } from './remove-dependents.component';
import { MspToggleComponent } from '../../common/toggle/toggle.component';
import { MspStatusInCanadaRadioComponent } from '../../../../modules/msp-core/components/status-in-canada-radio/status-in-canada-radio.component';
import { MspDateComponent } from '../../common/date/date.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component';
import { CalendarYearValidator } from '../../common/calendar/calendar-year.validator';
import { CalendarMonthValidator } from '../../common/calendar/calendar-month.validator';
import { CalendarDayValidator } from '../../common/calendar/calendar-day.validator';
import { CalendarYearFormatter } from '../../common/calendar/calendar-year-formatter.component';
import { AddNewDependentBeneficiaryComponent } from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { MspNameComponent } from '../../common/name/name.component';
import { MspGenderComponent } from '../../common/gender/gender.component';
import { MspBirthDateComponent } from '../../../../modules/msp-core/components/birthdate/birthdate.component';
import { MspPhnComponent } from '../../common/phn/phn.component';
import { MspPhoneComponent } from '../../common/phone/phone.component';
import { MspDischargeDateComponent } from '../../common/discharge-date/discharge-date.component';
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
import { Person } from '../../model/msp-person.model';
import { Relationship } from '../../model/status-activities-documents';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import { ProcessService } from '../../service/process.service';
import { CompletenessCheckService } from '../../service/completeness-check.service';
import { MspValidationService} from '../../service/msp-validation.service';
import { ServicesCardDisclaimerModalComponent } from '../../../msp/common/services-card-disclaimer/services-card-disclaimer.component';
import {ModalModule} from 'ngx-bootstrap';
import {TextMaskModule} from 'angular2-text-mask';



describe('RemoveDependentComponent', () => {
  let component: RemoveDependentComponent;
  let fixture: ComponentFixture<RemoveDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDependentComponent, MspToggleComponent, MspStatusInCanadaRadioComponent, MspDateComponent, AccountPersonalDetailsComponent, CalendarYearValidator, CalendarMonthValidator, CalendarDayValidator, CalendarYearFormatter, AddNewDependentBeneficiaryComponent, MspNameComponent, MspGenderComponent, MspBirthDateComponent, MspPhnComponent, MspPhoneComponent, MspDischargeDateComponent, MspSchoolDateComponent, MspAddressComponent, MspProvinceComponent, MspArrivalDateComponent, MspOutofBCRecordComponent, Mod11CheckValidator, MspCountryComponent, MspDepartureDateComponent, ServicesCardDisclaimerModalComponent, MspReturnDateComponent],
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
