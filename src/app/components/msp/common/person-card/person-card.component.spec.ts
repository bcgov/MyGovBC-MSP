import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspPersonCardComponent } from './person-card.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspAddressCardPartComponent} from "../address-card-part/address-card-part.component";
import {ThumbnailComponent} from "../thumbnail/thumbnail.component";
import {ModalModule} from "ng2-bootstrap";
import {RouterTestingModule} from "@angular/router/testing";

describe('MspPersonCardComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPersonCardComponent, MspAddressCardPartComponent, ThumbnailComponent],
      imports: [FormsModule, ModalModule, RouterTestingModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspPersonCardComponent);
    expect(fixture.componentInstance instanceof MspPersonCardComponent).toBe(true, 'should create MspPersonCardComponent');
  });
})
