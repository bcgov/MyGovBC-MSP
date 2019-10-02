import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { PersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspDepartureDateComponent} from '../../../../components/msp/common/departure-date/departure-date.component';
import {MspReturnDateComponent} from '../../../../components/msp/common/return-date/return-date.component';
import {MspDischargeDateComponent} from '../../../../components/msp/common/discharge-date/discharge-date.component';
import {MspBirthDateComponent} from '../../../msp-core/components/birthdate/birthdate.component';
import {MspSchoolDateComponent} from '../../../../components/msp/common/schoolDate/school-date.component';
import {MspAddressComponent} from '../../../msp-core/components/address/address.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import {MspOutofBCRecordComponent} from '../../../../components/msp/common/outof-bc/outof-bc.component';
import {MspCancelComponent} from '../../../../components/msp/common/cancel/cancel.component';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {MspLoggerDirective} from '../../../msp-core/components/logging/msp-logger.directive';
import { MspLogService } from '../../../../services/log.service';
import {TextMaskModule} from 'angular2-text-mask';
import {RouterTestingModule} from '@angular/router/testing';
import {CalendarYearFormatter} from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../../../components/msp/common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../../../components/msp/common/calendar/calendar-day.validator';
import { ProcessService } from '../../../../services/process.service';


describe('PersonalInfoComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PersonalInfoComponent,
        MspDischargeDateComponent,
        MspBirthDateComponent,
        MspSchoolDateComponent,
        MspAddressComponent,
        MspOutofBCRecordComponent,
        MspDepartureDateComponent,
        MspReturnDateComponent,
        MspCancelComponent,
        MspImageErrorModalComponent,
        MspLoggerDirective,
        CalendarYearFormatter, CalendarYearValidator, CalendarDayValidator,
        ],
      imports: [TextMaskModule,
        FormsModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
      ],
      providers: [
        MspDataService,
        MspLogService,
        ProcessService,
        CompletenessCheckService,
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(PersonalInfoComponent);
    expect(fixture.componentInstance instanceof PersonalInfoComponent).toBe(true, 'should create PersonalInfoComponent');

  });
});
