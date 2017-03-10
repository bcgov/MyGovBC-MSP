import {TestBed, inject} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import CompletenessCheckService from './completeness-check.service';
import MspDataService from './msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('PHN Component', () => {
  let service:CompletenessCheckService;
  let dataService:MspDataService;


  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserModule,
        CommonModule,
        FormsModule],
      providers: [
        CompletenessCheckService, MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
        
      ]
    })
  });
  it('should validate PHN properly', inject([CompletenessCheckService, MspDataService],
      (c:CompletenessCheckService, d:MspDataService) => {
    service = c;
    dataService = d;

    expect(service.validatePHN("")).toBe(false, 
      'empty value should not pass (when calling the function using its default value for isBCPhn and allowEmptyValue');
    expect(service.validatePHN("",true,false)).toBe(false, 'empty value should not pass when using explicit value');

    expect(service.validatePHN("",true,true)).toBe(true, 'empty value should pass when third param is set to true to accept empty value');


    expect(service.validatePHN(null, true, true)).toBe(true, 'null should pass when third param set to true.');
    expect(service.validatePHN(null)).toBe(false, 'null should not pass');

    expect(service.validatePHN("A", true, false)).toBe(false, 'a letter should not pass');
    expect(service.validatePHN(" A ", true, false)).toBe(false, 'a letter should not pass');
    expect(service.validatePHN("0009012372173", true, false)).toBe(true, 'padding (3 zeros) should be allowed');
    expect(service.validatePHN("009012372173")).toBe(true, 'padding(2 zeros) should be allowed');
    expect(service.validatePHN("09012372173")).toBe(true, 'padding (1 zero) should be allowed');
    expect(service.validatePHN("9012372173")).toBe(true, 'padding should not catch interior 0s');
    expect(service.validatePHN("9A00072173")).toBe(false, 'letters should not be allowed');

  }));
})
