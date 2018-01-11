import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspProgressBarComponent } from './progressBar.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";

describe('MspProgressBarComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspProgressBarComponent);
    expect(fixture.componentInstance instanceof MspProgressBarComponent).toBe(true, 'should create MspProgressBarComponent');
  });
})
