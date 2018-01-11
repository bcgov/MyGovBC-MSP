import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspGenderComponent } from './gender.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

describe('MspGenderComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspGenderComponent],
      imports: [FormsModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspGenderComponent);
    expect(fixture.componentInstance instanceof MspGenderComponent).toBe(true, 'should create MspGenderComponent');
  });
})
