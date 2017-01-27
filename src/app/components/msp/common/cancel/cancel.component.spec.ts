import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspCancelComponent } from './cancel.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspAddressCardPartComponent} from "../address-card-part/address-card-part.component";
import {RouterTestingModule} from "@angular/router/testing";
import {Ng2BootstrapModule} from "ng2-bootstrap";

describe('MspCancelComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspCancelComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule, Ng2BootstrapModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspCancelComponent);
    expect(fixture.componentInstance instanceof MspCancelComponent).toBe(true, 'should create MspCancelComponent');

  });
})
