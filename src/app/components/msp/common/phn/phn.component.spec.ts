import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspPhnComponent } from './phn.component';
import { MspDataService } from '../../service/msp-data.service';
import { MspValidationService } from '../../service/msp-validation.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {Mod11CheckValidator} from "./phn.validator";
import { CompletenessCheckService } from '../../service/completeness-check.service';

describe('MspPhnComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPhnComponent, Mod11CheckValidator],
      imports: [FormsModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, CompletenessCheckService,MspValidationService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspPhnComponent);
    expect(fixture.componentInstance instanceof MspPhnComponent).toBe(true, 'should create MspPhnComponent');
  });
})
