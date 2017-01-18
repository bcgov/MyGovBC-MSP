import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { SendingComponent } from './sending.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspApiService} from "../../service/msp-api.service";
import {Http, HttpModule} from "@angular/http";

describe('SendingComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendingComponent, ],
      imports: [FormsModule, HttpModule],
      providers: [MspDataService, MspApiService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    //let fixture = TestBed.createComponent(SendingComponent);
    //expect(fixture.componentInstance instanceof SendingComponent).toBe(true, 'should create SendingComponent');

  });
})
