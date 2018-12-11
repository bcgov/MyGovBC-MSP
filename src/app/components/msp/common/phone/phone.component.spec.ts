import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspPhoneComponent } from './phone.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

describe('MspPhoneComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPhoneComponent],
      imports: [FormsModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspPhoneComponent);
    expect(fixture.componentInstance instanceof MspPhoneComponent).toBe(true, 'should create MspPhoneComponent');
  });
});
