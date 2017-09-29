import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspProvinceComponent } from './province.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {Ng2CompleterModule} from "ng2-completer";

describe('MspProvinceComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspProvinceComponent],
      imports: [FormsModule, Ng2CompleterModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspProvinceComponent);
    expect(fixture.componentInstance instanceof MspProvinceComponent).toBe(true, 'should create MspProvinceComponent');
  });
})
