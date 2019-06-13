import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspCountryComponent } from './country.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspProvinceComponent} from '../province/province.component';
import { TypeaheadModule } from 'ngx-bootstrap';

describe('MspCountryComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspCountryComponent],
      imports: [FormsModule, TypeaheadModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspCountryComponent);
    expect(fixture.componentInstance instanceof MspCountryComponent).toBe(true, 'should create MspCountryComponent');

  });

  it ('should have good data', () => {
    const fixture = TestBed.createComponent(MspCountryComponent);
    expect(fixture.componentInstance instanceof MspCountryComponent).toBe(true, 'should create MspCountryComponent');

    for (const country of fixture.componentInstance.countryData) {
      expect(country.name.length).toBeLessThan(26, 'country name too long: ' + country.name);
    }
  });
});
