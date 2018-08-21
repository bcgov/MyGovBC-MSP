import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspDateComponent } from './date.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';
import {CalendarYearFormatter} from '../../common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../common/calendar/calendar-day.validator';

describe('MspDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspDateComponent, CalendarYearFormatter,CalendarYearValidator,CalendarDayValidator],
      imports: [FormsModule, TypeaheadModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      })],
      providers: [MspDataService,]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspDateComponent);
    expect(fixture.componentInstance instanceof MspDateComponent).toBe(true, 'should create MspDateComponent');

  });
})
