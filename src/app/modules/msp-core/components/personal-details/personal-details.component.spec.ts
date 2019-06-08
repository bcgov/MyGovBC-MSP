import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PersonalDetailsComponent } from './personal-details.component';
import { MspDataService } from '../../../../components/msp/service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspPhnComponent} from '../../../../components/msp/common/phn/phn.component';
import {MspNameComponent} from '../../../../components/msp/common/name/name.component';
import {MspProvinceComponent} from '../../../../components/msp/common/province/province.component';
import {MspArrivalDateComponent} from '../../../../components/msp/common/arrival-date/arrival-date.component';
import {MspDepartureDateComponent} from '../../../../components/msp/common/departure-date/departure-date.component';
import {MspReturnDateComponent} from '../../../../components/msp/common/return-date/return-date.component';
import {MspGenderComponent} from '../../../../components/msp/common/gender/gender.component';
import {MspDischargeDateComponent} from '../../../../components/msp/common/discharge-date/discharge-date.component';
import {MspBirthDateComponent} from '../../../../components/msp/common/birthdate/birthdate.component';
import {MspSchoolDateComponent} from '../../../../components/msp/common/schoolDate/school-date.component';
import {FileUploaderComponent} from '../../../../components/msp/common/file-uploader/file-uploader.component';
import {MspAddressComponent} from '../../../../components/msp/common/address/address.component';
import {Mod11CheckValidator} from '../../../../components/msp/common/phn/phn.validator';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ThumbnailComponent} from '../../../../components/msp/common/thumbnail/thumbnail.component';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import {HealthNumberComponent} from '../../../../components/msp/common/health-number/health-number.component';
import {MspCountryComponent} from '../../../../components/msp/common/country/country.component';
import {MspIdReqModalComponent} from '../../../../components/msp/common/id-req-modal/id-req-modal.component';
import {MspOutofBCRecordComponent} from '../../../../components/msp/common/outof-bc/outof-bc.component';
import {MspImageErrorModalComponent} from '../../../../components/msp/common/image-error-modal/image-error-modal.component';
import {TextMaskModule} from 'angular2-text-mask';
import {CalendarYearFormatter} from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../../../components/msp/common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../../../components/msp/common/calendar/calendar-day.validator';
import { ServicesCardDisclaimerModalComponent } from '../../../../components/msp/common/services-card-disclaimer/services-card-disclaimer.component';

describe('PersonalDetailsComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalDetailsComponent, MspPhnComponent, MspNameComponent, MspProvinceComponent,
        MspArrivalDateComponent, MspArrivalDateComponent, MspGenderComponent, MspDischargeDateComponent,
        MspBirthDateComponent, MspSchoolDateComponent, FileUploaderComponent, MspAddressComponent,
        Mod11CheckValidator, ThumbnailComponent, HealthNumberComponent, MspCountryComponent, MspIdReqModalComponent,
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
