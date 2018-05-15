import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
import { AssistanceConfirmationComponent } from './confirmation.component';
import {LandingComponent} from '../../landing/landing.component';
import {AssistanceComponent} from '../assistance.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import {MspLogService} from "../../service/log.service";
import {HttpClientModule} from "@angular/http";

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';


describe('AssistanceConfirmationComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceConfirmationComponent, MspLoggerDirective],
      imports: [FormsModule, HttpClientModule, 
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }), 
      RouterModule.forRoot(
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
                    canActivate: [],
                    component: AssistanceConfirmationComponent
                  }
                ]
              }
            ]
          }
        ]
      )],
      providers: [MspDataService,MspLogService,ActivatedRoute,
        
        
      ]
    })
  });
  // it ('should work', () => {
  //   let fixture = TestBed.createComponent(AssistanceConfirmationComponent);
  //   expect(fixture.componentInstance instanceof AssistanceConfirmationComponent).toBe(true, 'should create AssistanceConfirmationComponent');

  // });
})
