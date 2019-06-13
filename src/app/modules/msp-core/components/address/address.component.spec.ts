import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspAddressComponent } from './address.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspProvinceComponent} from '../../../../components/msp/common/province/province.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {MspCountryComponent} from '../../../../components/msp/common/country/country.component';

describe('MspAddressComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspAddressComponent, MspProvinceComponent, MspCountryComponent],
      imports: [FormsModule, TypeaheadModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspAddressComponent);
    expect(fixture.componentInstance instanceof MspAddressComponent).toBe(true, 'should create MspAddressComponent');

  });
});
