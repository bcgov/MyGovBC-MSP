import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AccountPersonalDetailsComponent } from './personal-details.component';
import {MspDataService} from '../../../../services/msp-data.service';
import {LocalStorageModule } from 'angular-2-local-storage';
import {MspBirthDateComponent} from '../../../../modules/msp-core/components/birthdate/birthdate.component';
import {MspAddressComponent} from '../../../../modules/msp-core/components/address/address.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import {MspImageErrorModalComponent} from '../../../../modules/msp-core/components/image-error-modal/image-error-modal.component';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { MspLogService } from '../../../../services/log.service';
import { ProcessService } from '../../../../services/process.service';
import { MspStatusInCanadaRadioComponent } from '../../../../modules/msp-core/components/status-in-canada-radio/status-in-canada-radio.component';
import { RouterTestingModule } from '@angular/router/testing';
import {TextMaskModule} from 'angular2-text-mask';
import { MspDischargeDateComponent } from '../../../../components/msp/common/discharge-date/discharge-date.component';
import { MspSchoolDateComponent } from '../../../../components/msp/common/schoolDate/school-date.component';
import { MspOutofBCRecordComponent } from '../../../../components/msp/common/outof-bc/outof-bc.component';
import { MspDepartureDateComponent } from '../../../../components/msp/common/departure-date/departure-date.component';
import { MspReturnDateComponent } from '../../../../components/msp/common/return-date/return-date.component';
import { CalendarYearFormatter } from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import { CalendarYearValidator } from '../../../../components/msp/common/calendar/calendar-year.validator';
import { CalendarDayValidator } from '../../../../components/msp/common/calendar/calendar-day.validator';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
import { SharedCoreModule } from 'moh-common-lib';

describe('AccountPersonalDetailsComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountPersonalDetailsComponent,
         MspDischargeDateComponent,
        MspBirthDateComponent,
        MspSchoolDateComponent,
        MspAddressComponent,
        MspOutofBCRecordComponent,
        MspDepartureDateComponent,
        MspReturnDateComponent,
        MspImageErrorModalComponent,
        CalendarYearFormatter,
        CalendarYearValidator,
        CalendarDayValidator,
        MspStatusInCanadaRadioComponent,
        ServicesCardDisclaimerModalComponent],
      imports: [
        TextMaskModule,
        SharedCoreModule,
        FormsModule,
        RouterTestingModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      })],
        providers: [MspDataService, MspLogService, ProcessService,
            CompletenessCheckService,

      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AccountPersonalDetailsComponent);
    expect(fixture.componentInstance instanceof AccountPersonalDetailsComponent).toBe(true, 'should create AccountPersonalDetailsComponent');

  });
});
