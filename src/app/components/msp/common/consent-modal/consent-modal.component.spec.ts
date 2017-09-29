import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspConsentModalComponent } from './consent-modal.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspAddressCardPartComponent} from "../address-card-part/address-card-part.component";
import {RouterTestingModule} from "@angular/router/testing";
import {Ng2BootstrapModule} from "ngx-bootstrap";
import appConstants from '../../../../services/appConstants';

describe('MspConsentModalComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspConsentModalComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule, Ng2BootstrapModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspConsentModalComponent);
    expect(fixture.componentInstance instanceof MspConsentModalComponent).toBe(true, 'should create MspConsentModalComponent');

  });
})
