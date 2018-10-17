import { TestBed } from '@angular/core/testing';
import { FormsModule} from '@angular/forms';

import {EligibilityCardComponent} from './eligibility-card.component';
import { MspDataService } from '../../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';

describe('DeductionCalculatorComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EligibilityCardComponent],
      imports: [FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(EligibilityCardComponent);
    expect(fixture.componentInstance instanceof EligibilityCardComponent).toBe(true, 'should create EligibilityCardComponent');
  });
});
