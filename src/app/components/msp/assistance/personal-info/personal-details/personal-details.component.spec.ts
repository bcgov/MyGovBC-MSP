import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AssistancePersonalDetailComponent } from './personal-details.component';
import { MspDataService } from '../../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspPhnComponent} from "../../../common/phn/phn.component";
import {MspNameComponent} from "../../../common/name/name.component";
import {MspBirthDateComponent} from "../../../common/birthdate/birthdate.component";
import {MspAddressComponent} from "../../../common/address/address.component";
import {Mod11CheckValidator} from "../../../common/phn/phn.validator";
import {MspProvinceComponent} from "../../../common/province/province.component";
import {Ng2CompleterModule} from "ng2-completer";
import {MspGenderComponent} from "../../../common/gender/gender.component";
import {MspCountryComponent} from "../../../common/country/country.component";
import { MspLogService } from '../../../service/log.service';
import { MspValidationService } from '../../../service/msp-validation.service';
import appConstants from '../../../../../services/appConstants';
import { CompletenessCheckService } from '../../../service/completeness-check.service';

import {CalendarYearFormatter} from '../../../common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../../common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../../common/calendar/calendar-day.validator';
import { ProcessService } from "../../../service/process.service";


describe('AssistancePersonalDetailComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePersonalDetailComponent, MspPhnComponent, MspNameComponent,
        MspBirthDateComponent, MspAddressComponent, MspProvinceComponent,
        Mod11CheckValidator, MspGenderComponent, MspCountryComponent,
        CalendarYearFormatter,CalendarYearValidator,CalendarDayValidator],
      imports: [FormsModule, Ng2CompleterModule, HttpModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, CompletenessCheckService,MspValidationService,ProcessService,
        
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistancePersonalDetailComponent);
    expect(fixture.componentInstance instanceof AssistancePersonalDetailComponent).toBe(true, 'should create AssistancePersonalDetailComponent');

  });
})
