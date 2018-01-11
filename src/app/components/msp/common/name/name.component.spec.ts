import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspNameComponent } from './name.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

describe('MspNameComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspNameComponent],
      imports: [FormsModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspNameComponent);
    expect(fixture.componentInstance instanceof MspNameComponent).toBe(true, 'should create MspNameComponent');
  });
})
