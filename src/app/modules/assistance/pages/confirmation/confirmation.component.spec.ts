import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssistanceConfirmationComponent } from './confirmation.component';
import {LandingComponent} from '../../../../pages/landing/landing.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspLogService} from '../../../../services/log.service';
import { HttpClientModule} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


describe('AssistanceConfirmationComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceConfirmationComponent],
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
            ]
          }
        ]
      )],
      providers: [MspDataService, MspLogService, ActivatedRoute,


      ]
    });
  });
  // it ('should work', () => {
  //   let fixture = TestBed.createComponent(AssistanceConfirmationComponent);
  //   expect(fixture.componentInstance instanceof AssistanceConfirmationComponent).toBe(true, 'should create AssistanceConfirmationComponent');

  // });
});
