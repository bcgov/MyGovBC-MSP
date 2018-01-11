import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspAddressCardPartComponent } from './address-card-part.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspProvinceComponent} from "../province/province.component";
import {Ng2CompleterModule} from "ng2-completer";

describe('MspAddressCardPartComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspAddressCardPartComponent],
      imports: [FormsModule, Ng2CompleterModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspAddressCardPartComponent);
    expect(fixture.componentInstance instanceof MspAddressCardPartComponent).toBe(true, 'should create MspAddressCardPartComponent');

  });
})
