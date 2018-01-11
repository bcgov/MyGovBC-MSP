import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspSchoolDateComponent } from './school-date.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

describe('MspSchoolDateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspSchoolDateComponent],
      imports: [FormsModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspSchoolDateComponent);
    expect(fixture.componentInstance instanceof MspSchoolDateComponent).toBe(true, 'should create MspSchoolDateComponent');
  });
})
