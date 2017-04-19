import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { ApplicationComponent } from './application.component';
import MspDataService from '../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import {RouterTestingModule} from "@angular/router/testing";
import appConstants from '../../../services/appConstants';
import ProcessService from "../service/process.service";

describe('ApplicationComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationComponent, MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [MspDataService, ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(ApplicationComponent);
    expect(fixture.componentInstance instanceof ApplicationComponent).toBe(true, 'should create ApplicationComponent');

  });
})
