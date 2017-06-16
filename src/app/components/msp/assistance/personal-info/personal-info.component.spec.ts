import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AssistancePersonalInfoComponent } from './personal-info.component';
import MspDataService from '../../service/msp-data.service';
import CompletenessCheckService from '../../service/completeness-check.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspPhnComponent} from "../../common/phn/phn.component";
import {MspNameComponent} from "../../common/name/name.component";
import {MspBirthDateComponent} from "../../common/birthdate/birthdate.component";
import {MspAddressComponent} from "../../common/address/address.component";
import {Mod11CheckValidator} from "../../common/phn/phn.validator";
import {MspProvinceComponent} from "../../common/province/province.component";
import {Ng2CompleterModule} from "ng2-completer";
import {AssistancePersonalDetailComponent} from "./personal-details/personal-details.component";
import {MspPhoneComponent} from "../../common/phone/phone.component";
import {MspGenderComponent} from "../../common/gender/gender.component";
import {MspCountryComponent} from "../../common/country/country.component";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {ModalModule} from "ng2-bootstrap";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import ValidationSerivce from '../../service/msp-validation.service';
import appConstants from '../../../../services/appConstants';
import {CalendarYearFormatter} from '../../common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from '../../common/calendar/calendar-year.validator';
import {CalendarDayValidator} from '../../common/calendar/calendar-day.validator';
import ProcessService from "../../service/process.service";


describe('AssistancePersonalInfoComponent Test', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePersonalInfoComponent, AssistancePersonalDetailComponent,
        MspPhnComponent, MspNameComponent, MspPhoneComponent,
        MspBirthDateComponent, MspAddressComponent, MspProvinceComponent, MspCountryComponent,
        Mod11CheckValidator, MspGenderComponent, MspCancelComponent, MspLoggerDirective,
        CalendarYearFormatter,CalendarYearValidator,CalendarDayValidator],
      imports: [FormsModule, Ng2CompleterModule, ModalModule.forRoot(), HttpModule,RouterTestingModule],
      providers: [MspDataService,CompletenessCheckService, MspLogService,ValidationSerivce,ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistancePersonalInfoComponent);
    expect(fixture.componentInstance instanceof AssistancePersonalInfoComponent).toBe(true, 'should create AssistancePersonalInfoComponent');

  });
})
