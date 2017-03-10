import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AssistancePersonalDetailComponent } from './personal-details.component';
import MspDataService from '../../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
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
import ValidationService from '../../../service/msp-validation.service';
import appConstants from '../../../../../services/appConstants';
import CompletenessCheckService from '../../../service/completeness-check.service';


describe('AssistancePersonalDetailComponent Test', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePersonalDetailComponent, MspPhnComponent, MspNameComponent,
        MspBirthDateComponent, MspAddressComponent, MspProvinceComponent,
        Mod11CheckValidator, MspGenderComponent, MspCountryComponent],
      imports: [FormsModule, Ng2CompleterModule, HttpModule],
      providers: [MspDataService, CompletenessCheckService,ValidationService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistancePersonalDetailComponent);
    expect(fixture.componentInstance instanceof AssistancePersonalDetailComponent).toBe(true, 'should create AssistancePersonalDetailComponent');

  });
})
