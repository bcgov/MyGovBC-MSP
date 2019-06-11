import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspReturnDateComponent } from './return-date.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';

describe('MspReturnDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspReturnDateComponent],
      imports: [FormsModule, TypeaheadModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspReturnDateComponent);
    expect(fixture.componentInstance instanceof MspReturnDateComponent).toBe(true, 'should create MspReturnDateComponent');

  });
});
