import {TestBed, inject} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import { CompletenessCheckService } from './completeness-check.service';
import { MspDataService } from './msp-data.service';
import {MspValidationService} from './msp-validation.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

describe('PHN Component', () => {
  let service:CompletenessCheckService;
  let dataService:MspDataService;
  let validationService:MspValidationService

  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserModule,
        CommonModule,
        FormsModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })],
      providers: [
        CompletenessCheckService, MspDataService,MspValidationService,
        LocalStorageService]
    })
  });
  it('should validate PHN properly', inject([CompletenessCheckService, MspDataService, MspValidationService],
      (c:CompletenessCheckService, d:MspDataService, v:MspValidationService) => {
    service = c;
    dataService = d;
    validationService = v;

    expect(validationService.validatePHN("")).toBe(false, 
      'empty value should not pass (when calling the function using its default value for isBCPhn and allowEmptyValue');
    expect(validationService.validatePHN("",true,false)).toBe(false, 'empty value should not pass when using explicit value');

    expect(validationService.validatePHN("",true,true)).toBe(true, 'empty value should pass when third param is set to true to accept empty value');


    expect(validationService.validatePHN(null, true, true)).toBe(true, 'null should pass when third param set to true.');
    expect(validationService.validatePHN(null)).toBe(false, 'null should not pass');

    expect(validationService.validatePHN("A", true, false)).toBe(false, 'a letter should not pass');
    expect(validationService.validatePHN(" A ", true, false)).toBe(false, 'a letter should not pass');
    expect(validationService.validatePHN("0009012372173", true, false)).toBe(true, 'padding (3 zeros) should be allowed');
    expect(validationService.validatePHN("009012372173")).toBe(true, 'padding(2 zeros) should be allowed');
    expect(validationService.validatePHN("09012372173")).toBe(true, 'padding (1 zero) should be allowed');
    expect(validationService.validatePHN("9012372173")).toBe(true, 'padding should not catch interior 0s');
    expect(validationService.validatePHN("9A00072173")).toBe(false, 'letters should not be allowed');

  }));
})
