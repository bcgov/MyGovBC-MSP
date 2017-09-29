import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspContactCardComponent } from './contact-card.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspAddressCardPartComponent} from "../address-card-part/address-card-part.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('MspContactCardComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspContactCardComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspContactCardComponent);
    expect(fixture.componentInstance instanceof MspContactCardComponent).toBe(true, 'should create MspContactCardComponent');

  });
})
