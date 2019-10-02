import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspAddressCardPartComponent } from './address-card-part.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';

describe('MspAddressCardPartComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspAddressCardPartComponent],
      imports: [FormsModule, TypeaheadModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspAddressCardPartComponent);
    expect(fixture.componentInstance instanceof MspAddressCardPartComponent).toBe(true, 'should create MspAddressCardPartComponent');

  });
});
