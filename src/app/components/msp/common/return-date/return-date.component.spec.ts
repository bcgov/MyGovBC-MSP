import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspReturnDateComponent } from './return-date.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {Ng2CompleterModule} from "ng2-completer";

describe('MspReturnDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspReturnDateComponent],
      imports: [FormsModule, Ng2CompleterModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspReturnDateComponent);
    expect(fixture.componentInstance instanceof MspReturnDateComponent).toBe(true, 'should create MspReturnDateComponent');

  });
})
