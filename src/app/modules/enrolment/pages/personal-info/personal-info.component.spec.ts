import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { PersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspBirthDateComponent} from '../../../msp-core/components/birthdate/birthdate.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import {MspCancelComponent} from '../../../../components/msp/common/cancel/cancel.component';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { MspLogService } from '../../../../services/log.service';
import {TextMaskModule} from 'angular2-text-mask';
import {RouterTestingModule} from '@angular/router/testing';

import { ProcessService } from '../../../../services/process.service';


describe('PersonalInfoComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PersonalInfoComponent,
        MspBirthDateComponent,
        MspCancelComponent,
        MspImageErrorModalComponent,        ],
      imports: [TextMaskModule,
        FormsModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
      ],
      providers: [
        MspDataService,
        MspLogService,
        ProcessService,
        CompletenessCheckService,
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(PersonalInfoComponent);
    expect(fixture.componentInstance instanceof PersonalInfoComponent).toBe(true, 'should create PersonalInfoComponent');

  });
});
