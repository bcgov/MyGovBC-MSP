import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { ThumbnailComponent } from './thumbnail.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {ModalModule} from "ng2-bootstrap";

describe('ThumbnailComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbnailComponent],
      imports: [FormsModule, ModalModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(ThumbnailComponent);
    expect(fixture.componentInstance instanceof ThumbnailComponent).toBe(true, 'should create ThumbnailComponent');
  });
})
