import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
import { AssistanceConfirmationComponent } from './confirmation.component';
import {LandingComponent} from '../../landing/landing.component';
import {ConfirmationGuard} from './confirmation.guard';
import {AssistanceComponent} from '../assistance.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import {MspLogService} from "../../service/log.service";
import {HttpModule} from "@angular/http";
import appConstants from '../../../../services/appConstants';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';


describe('AssistanceConfirmationComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceConfirmationComponent, MspLoggerDirective],
      imports: [FormsModule, HttpModule, RouterModule.forRoot(
        [
          {
            path: 'msp',
            children: [
              {
                path: '',
                component: LandingComponent
              },
              {
                path: 'assistance',
                component: AssistanceComponent,
                children: [
                  {
                    path: 'confirmation',
                    canActivate: [ConfirmationGuard],
                    component: AssistanceConfirmationComponent
                  }
                ]
              }
            ]
          }
        ]
      )],
      providers: [MspDataService,MspLogService,ActivatedRoute,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  // it ('should work', () => {
  //   let fixture = TestBed.createComponent(AssistanceConfirmationComponent);
  //   expect(fixture.componentInstance instanceof AssistanceConfirmationComponent).toBe(true, 'should create AssistanceConfirmationComponent');

  // });
})
