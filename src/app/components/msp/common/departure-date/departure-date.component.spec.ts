import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspDepartureDateComponent } from './departure-date.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {Ng2CompleterModule} from "ng2-completer";

describe('MspDepartureDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspDepartureDateComponent],
      imports: [FormsModule, Ng2CompleterModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspDepartureDateComponent);
    expect(fixture.componentInstance instanceof MspDepartureDateComponent).toBe(true, 'should create MspDepartureDateComponent');

  });
})
