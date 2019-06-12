import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspBirthDateComponent } from './birthdate.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {Relationship} from '../../../../models/status-activities-documents';
import {CalendarYearFormatter} from '../../../../components/msp/common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../../../components/msp/common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../../../components/msp/common/calendar/calendar-day.validator';

describe('MspBirthDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspBirthDateComponent, CalendarYearFormatter, CalendarYearValidator, CalendarDayValidator],
      imports: [FormsModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
      ],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspBirthDateComponent);

    fixture.componentInstance.person = new MspPerson(Relationship.Applicant);
    expect(fixture.componentInstance instanceof MspBirthDateComponent).toBe(true, 'should create MspBirthDateComponent');

  });
});
