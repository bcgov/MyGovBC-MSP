import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AssistanceComponent } from './assistance.component';
import MspDataService from '../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import { RouterModule } from '@angular/router';
import {RouterTestingModule} from "@angular/router/testing";
import { ActivatedRoute, Router, Params } from '@angular/router';
import appConstants from '../../../services/appConstants';
import ProcessService from "../service/process.service";

describe('AssistanceComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceComponent, MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule, HttpModule, RouterModule],
      providers: [MspDataService, ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceComponent);
    expect(fixture.componentInstance instanceof AssistanceComponent).toBe(true, 'should create AssistanceComponent');

  });
})
