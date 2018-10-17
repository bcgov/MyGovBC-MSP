import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspProvinceComponent } from './province.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';

describe('MspProvinceComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspProvinceComponent],
      imports: [FormsModule, TypeaheadModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspProvinceComponent);
    expect(fixture.componentInstance instanceof MspProvinceComponent).toBe(true, 'should create MspProvinceComponent');
  });
});
