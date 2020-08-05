import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AssistancePersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import {
  LocalStorageService,
  LocalStorageModule
} from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { MspLogService } from '../../../../services/log.service';

import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { AssistCraDocumentsComponent } from '../../components/assist-cra-documents/assist-cra-documents.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

describe('AssistancePersonalInfoComponent Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssistancePersonalInfoComponent,
        AssistCraDocumentsComponent
      ],
      imports: [
        TextMaskModule,
        FormsModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        MspCoreModule
      ],
      providers: [MspDataService, CompletenessCheckService, MspLogService]
    });
  });
  it('should work', () => {
    const fixture = TestBed.createComponent(AssistancePersonalInfoComponent);
    expect(
      fixture.componentInstance instanceof AssistancePersonalInfoComponent
    ).toBe(true, 'should create AssistancePersonalInfoComponent');
  });
});
