import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
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

describe('AssistancePersonalDetailComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePersonalDetailComponent, MspPhnComponent, MspNameComponent,
        MspBirthDateComponent, MspAddressComponent, MspProvinceComponent,
        Mod11CheckValidator],
      imports: [FormsModule, Ng2CompleterModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistancePersonalDetailComponent);
    expect(fixture.componentInstance instanceof AssistancePersonalDetailComponent).toBe(true, 'should create AssistancePersonalDetailComponent');

  });
})
