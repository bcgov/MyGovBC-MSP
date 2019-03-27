import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspPhnComponent } from './phn.component';
import { MspDataService } from '../../service/msp-data.service';
import { MspValidationService } from '../../service/msp-validation.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {Mod11CheckValidator} from './phn.validator';
import { CompletenessCheckService } from '../../service/completeness-check.service';
import { RouterTestingModule } from '@angular/router/testing';
import {TextMaskModule} from 'angular2-text-mask';


describe('MspPhnComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPhnComponent, Mod11CheckValidator],
      imports: [TextMaskModule, FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, CompletenessCheckService, MspValidationService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspPhnComponent);
    expect(fixture.componentInstance instanceof MspPhnComponent).toBe(true, 'should create MspPhnComponent');
  });
});
