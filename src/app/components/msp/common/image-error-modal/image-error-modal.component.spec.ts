import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import appConstants from '../../../../services/appConstants';
import {MspImageErrorModalComponent} from "./image-error-modal.component";

describe('MspImageErrorModalComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspImageErrorModalComponent],
      imports: [FormsModule, RouterTestingModule, Ng2BootstrapModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspImageErrorModalComponent);
    expect(fixture.componentInstance instanceof MspImageErrorModalComponent).toBe(true, 'should create MspImageErrorModalComponent');

  });
})
