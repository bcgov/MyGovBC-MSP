import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspDischargeDateComponent } from './discharge-date.component';
import { MspDataService } from '../../service/msp-data.service';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

describe('MspDischargeDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspDischargeDateComponent],
      imports: [FormsModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,


      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspDischargeDateComponent);
    expect(fixture.componentInstance instanceof MspDischargeDateComponent).toBe(true, 'should create MspDischargeDateComponent');

  });
});
