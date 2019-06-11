import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspArrivalDateComponent } from './arrival-date.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';
import {CalendarYearFormatter} from '../../common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../common/calendar/calendar-day.validator';

describe('MspArrivalDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspArrivalDateComponent, CalendarYearFormatter, CalendarYearValidator, CalendarDayValidator],
      imports: [FormsModule, TypeaheadModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspArrivalDateComponent);
    expect(fixture.componentInstance instanceof MspArrivalDateComponent).toBe(true, 'should create MspArrivalDateComponent');

  });
});
