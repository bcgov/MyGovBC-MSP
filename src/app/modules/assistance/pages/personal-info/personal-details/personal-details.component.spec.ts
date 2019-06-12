import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssistancePersonalDetailComponent } from './personal-details.component';
import { MspDataService } from '../../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspBirthDateComponent} from '../../../../msp-core/components/birthdate/birthdate.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import { MspValidationService } from '../../../../../services/msp-validation.service';
import { CompletenessCheckService } from '../../../../../services/completeness-check.service';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {TextMaskModule} from 'angular2-text-mask';
import { MspAddressComponent } from '../../../../msp-core/components/address/address.component';
import { MspProvinceComponent } from '../../../../../components/msp/common/province/province.component';
import { MspGenderComponent } from '../../../../../components/msp/common/gender/gender.component';
import { MspCountryComponent } from '../../../../../components/msp/common/country/country.component';
import { CalendarYearFormatter } from '../../../../../components/msp/common/calendar/calendar-year-formatter.component';
import { CalendarYearValidator } from '../../../../../components/msp/common/calendar/calendar-year.validator';
import { CalendarDayValidator } from '../../../../../components/msp/common/calendar/calendar-day.validator';
import { ProcessService } from '../../../../../services/process.service';


describe('AssistancePersonalDetailComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePersonalDetailComponent, MspPhnComponent,
        MspBirthDateComponent, MspAddressComponent, MspProvinceComponent,
        Mod11CheckValidator, MspGenderComponent, MspCountryComponent,
        CalendarYearFormatter, CalendarYearValidator, CalendarDayValidator, SinCheckValidator],
      imports: [TextMaskModule, 
        FormsModule, 
        RouterTestingModule, 
        TypeaheadModule, 
        HttpClientModule, 
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      })],
      providers: [MspDataService, CompletenessCheckService, MspValidationService, ProcessService,


      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AssistancePersonalDetailComponent);
    expect(fixture.componentInstance instanceof AssistancePersonalDetailComponent).toBe(true, 'should create AssistancePersonalDetailComponent');

  });
});
