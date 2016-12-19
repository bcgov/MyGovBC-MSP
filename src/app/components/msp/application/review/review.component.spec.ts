import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { ReviewComponent } from './review.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspPersonCardComponent} from "../../common/person-card/person-card.component";
import {MspAddressCardPartComponent} from "../../common/address-card-part/address-card-part.component";
import {MspContactCardComponent} from "../../common/contact-card/contact-card.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {ModalModule} from "ng2-bootstrap";
import {RouterTestingModule} from "@angular/router/testing";

describe('ReviewComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewComponent, MspPersonCardComponent, MspAddressCardPartComponent,
        MspContactCardComponent, ThumbnailComponent],
      imports: [FormsModule, ModalModule, RouterTestingModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(ReviewComponent);
    expect(fixture.componentInstance instanceof ReviewComponent).toBe(true, 'should create ReviewComponent');

  });
})
