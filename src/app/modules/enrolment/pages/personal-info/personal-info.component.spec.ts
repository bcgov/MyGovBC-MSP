import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { PersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { MspLogService } from '../../../../services/log.service';
import {TextMaskModule} from 'angular2-text-mask';
import {RouterTestingModule} from '@angular/router/testing';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

import { ProcessService } from '../../../../services/process.service';


describe('PersonalInfoComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PersonalInfoComponent
      ],
      imports: [
        TextMaskModule,
        FormsModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        MspCoreModule
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
