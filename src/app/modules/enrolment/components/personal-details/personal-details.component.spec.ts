import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PersonalDetailsComponent } from './personal-details.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {PhnComponent} from 'moh-common-lib';
import {MspProvinceComponent} from '../../../../components/msp/common/province/province.component';
import {MspArrivalDateComponent} from '../../../../components/msp/common/arrival-date/arrival-date.component';
import {MspDepartureDateComponent} from '../../../../components/msp/common/departure-date/departure-date.component';
import {MspReturnDateComponent} from '../../../../components/msp/common/return-date/return-date.component';
import {MspGenderComponent} from '../../../../components/msp/common/gender/gender.component';
import {MspDischargeDateComponent} from '../../../../components/msp/common/discharge-date/discharge-date.component';
import {MspBirthDateComponent} from '../birthdate/birthdate.component';
import {MspSchoolDateComponent} from '../../../../components/msp/common/schoolDate/school-date.component';
import {MspAddressComponent} from '../address/address.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import {HealthNumberComponent} from '../../../../components/msp/common/health-number/health-number.component';
import {MspCountryComponent} from '../../../../components/msp/common/country/country.component';
import {MspIdReqModalComponent} from '../id-req-modal/id-req-modal.component';
import {MspOutofBCRecordComponent} from '../../../../components/msp/common/outof-bc/outof-bc.component';
import {MspImageErrorModalComponent} from '../image-error-modal/image-error-modal.component';
import {TextMaskModule} from 'angular2-text-mask';
import {CalendarYearFormatter} from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../../../components/msp/common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../../../components/msp/common/calendar/calendar-day.validator';
import { ServicesCardDisclaimerModalComponent } from '../services-card-disclaimer/services-card-disclaimer.component';
import { FileUploaderComponent, ThumbnailComponent } from 'moh-common-lib';

describe('PersonalDetailsComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalDetailsComponent, PhnComponent, MspProvinceComponent,
        MspArrivalDateComponent, MspArrivalDateComponent, MspGenderComponent, MspDischargeDateComponent,
        MspBirthDateComponent, MspSchoolDateComponent, FileUploaderComponent, MspAddressComponent,
        ThumbnailComponent, HealthNumberComponent, MspCountryComponent, MspIdReqModalComponent,
        MspOutofBCRecordComponent, MspDepartureDateComponent, MspReturnDateComponent, MspImageErrorModalComponent, ServicesCardDisclaimerModalComponent,
        CalendarYearFormatter, CalendarYearValidator, CalendarDayValidator],
      imports: [TextMaskModule, FormsModule, TypeaheadModule, ModalModule.forRoot(), AccordionModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(PersonalDetailsComponent);
    expect(fixture.componentInstance instanceof PersonalDetailsComponent).toBe(true, 'should create PersonalDetailsComponent');

  });
});
