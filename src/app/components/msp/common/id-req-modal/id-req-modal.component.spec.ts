import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspIdReqModalComponent } from './id-req-modal.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";
import {AccordionModule} from "ng2-bootstrap";

describe('MspConsentModalComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspIdReqModalComponent],
      imports: [FormsModule, RouterTestingModule, AccordionModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspIdReqModalComponent);
    expect(fixture.componentInstance instanceof MspIdReqModalComponent).toBe(true, 'should create MspIdReqModalComponent');

  });
})
