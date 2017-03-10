import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { AssistanceSendingComponent } from './sending.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspApiService} from "../../service/msp-api.service";
import {Http, HttpModule} from "@angular/http";

describe('AssistanceSendingComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceSendingComponent, ],
      imports: [FormsModule, HttpModule, RouterTestingModule],
      providers: [MspDataService, MspApiService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    //let fixture = TestBed.createComponent(AssistanceSendingComponent);
    //expect(fixture.componentInstance instanceof AssistanceSendingComponent).toBe(true, 'should create AssistanceSendingComponent');

  });
})
