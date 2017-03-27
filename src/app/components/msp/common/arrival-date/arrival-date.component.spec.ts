import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspArrivalDateComponent } from './arrival-date.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {Ng2CompleterModule} from "ng2-completer";
import {CalendarYearFormatter} from '../../common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../common/calendar/calendar-day.validator';

describe('MspArrivalDateComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspArrivalDateComponent, CalendarYearFormatter,CalendarYearValidator,CalendarDayValidator],
      imports: [FormsModule, Ng2CompleterModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspArrivalDateComponent);
    expect(fixture.componentInstance instanceof MspArrivalDateComponent).toBe(true, 'should create MspArrivalDateComponent');

  });
})
