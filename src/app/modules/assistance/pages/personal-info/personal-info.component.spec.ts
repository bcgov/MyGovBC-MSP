import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AssistancePersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import {
  LocalStorageModule
} from 'angular-2-local-storage';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MspLogService } from '../../../../services/log.service';
import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { AssistCraDocumentComponent } from '../../components/assist-cra-document/assist-cra-document.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

describe('AssistancePersonalInfoComponent Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssistancePersonalInfoComponent,
        AssistCraDocumentComponent
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
