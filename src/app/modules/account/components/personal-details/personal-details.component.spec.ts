import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AccountPersonalDetailsComponent } from './personal-details.component';
import {MspDataService} from '../../../../services/msp-data.service';
import {LocalStorageModule } from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';
import {ModalModule, AccordionModule} from 'ngx-bootstrap';
import {MspImageErrorModalComponent} from '../../../../modules/msp-core/components/image-error-modal/image-error-modal.component';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { MspLogService } from '../../../../services/log.service';
import { ProcessService } from '../../../../services/process.service';
import { RouterTestingModule } from '@angular/router/testing';
import {TextMaskModule} from 'angular2-text-mask';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

describe('AccountPersonalDetailsComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountPersonalDetailsComponent,
        MspImageErrorModalComponent
      ],
      imports: [
        TextMaskModule,
        MspCoreModule,
        FormsModule,
        RouterTestingModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      })],
        providers: [MspDataService, MspLogService, ProcessService,
            CompletenessCheckService,

      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AccountPersonalDetailsComponent);
    expect(fixture.componentInstance instanceof AccountPersonalDetailsComponent).toBe(true, 'should create AccountPersonalDetailsComponent');

  });
});
