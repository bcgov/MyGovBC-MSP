import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PersonalDetailsComponent } from './personal-details.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspArrivalDateComponent} from '../../../../components/msp/common/arrival-date/arrival-date.component';
import {MspDepartureDateComponent} from '../../../../components/msp/common/departure-date/departure-date.component';
import {MspReturnDateComponent} from '../../../../components/msp/common/return-date/return-date.component';
import {MspGenderComponent} from '../../../../components/msp/common/gender/gender.component';
import {MspDischargeDateComponent} from '../../../../components/msp/common/discharge-date/discharge-date.component';
import {MspSchoolDateComponent} from '../../../../components/msp/common/schoolDate/school-date.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import {HealthNumberComponent} from '../../../../components/msp/common/health-number/health-number.component';
import {MspOutofBCRecordComponent} from '../../../../components/msp/common/outof-bc/outof-bc.component';
import {TextMaskModule} from 'angular2-text-mask';
import {CalendarYearFormatter} from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../../../components/msp/common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../../../components/msp/common/calendar/calendar-day.validator';
import { FileUploaderComponent, ThumbnailComponent } from 'moh-common-lib';
import { PhnComponent } from 'moh-common-lib/lib/components/phn/phn.component';
import { MspBirthDateComponent } from '../../../msp-core/components/birthdate/birthdate.component';
import { MspAddressComponent } from '../../../msp-core/components/address/address.component';
import { MspIdReqModalComponent } from '../../../msp-core/components/id-req-modal/id-req-modal.component';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';

describe('PersonalDetailsComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalDetailsComponent, PhnComponent,
        MspArrivalDateComponent, MspArrivalDateComponent, MspGenderComponent, MspDischargeDateComponent,
        MspBirthDateComponent, MspSchoolDateComponent, FileUploaderComponent, MspAddressComponent,
        ThumbnailComponent, HealthNumberComponent, MspIdReqModalComponent,
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
